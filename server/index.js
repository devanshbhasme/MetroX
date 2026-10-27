require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dataManager = require('./dataManager');

const app = express();
const PORT = process.env.PORT || 3000;
const CPP_ENGINE_URL = process.env.CPP_ENGINE_URL || 'http://127.0.0.1:8080';

app.use(cors());
app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [Express Gateway] ${req.method} ${req.originalUrl}`);
  next();
});

// Helper to forward requests to C++ Core Engine
async function forwardToCpp(path, options = {}) {
  const url = `${CPP_ENGINE_URL}${path}`;
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });
    const data = await res.json().catch(() => ({}));
    return { status: res.status, data };
  } catch (err) {
    console.error(`[C++ Engine Communication Error] Failed to reach ${url}:`, err.message);
    return {
      status: 503,
      data: {
        error: 'C++ Core Engine is unavailable',
        details: err.message,
        hint: 'Ensure MetroX C++ server is running on ' + CPP_ENGINE_URL
      }
    };
  }
}

// Reload C++ state from data/*.txt after modifications
async function triggerCppReload() {
  try {
    await forwardToCpp('/api/system/load', { method: 'POST' });
  } catch (e) {
    console.warn('[C++ Reload Warning] Could not notify C++ server:', e.message);
  }
}

// 1. Health & Gateway Info
app.get('/api/health', async (req, res) => {
  const cppHealth = await forwardToCpp('/api/health');
  res.json({
    gateway: 'MetroX Express Gateway (Node.js)',
    status: 'online',
    port: PORT,
    cppEngineUrl: CPP_ENGINE_URL,
    cppEngineStatus: cppHealth.status === 200 ? 'connected' : 'unreachable',
    cppDetails: cppHealth.data
  });
});

// 2. Stations API
app.get('/api/stations', async (req, res) => {
  const response = await forwardToCpp('/api/stations');
  res.status(response.status).json(response.data);
});

app.post('/api/stations', async (req, res) => {
  const response = await forwardToCpp('/api/stations', {
    method: 'POST',
    body: JSON.stringify(req.body)
  });
  res.status(response.status).json(response.data);
});

app.put('/api/stations/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { name, location } = req.body;
  const ok = dataManager.updateStationInFile(id, name, location);
  if (!ok) {
    return res.status(404).json({ error: `Station ID ${id} not found.` });
  }
  await triggerCppReload();
  res.json({ success: true, message: `Station ${id} updated successfully.` });
});

app.delete('/api/stations/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const ok = dataManager.removeStationFromFile(id);
  if (!ok) {
    return res.status(404).json({ error: `Station ID ${id} not found.` });
  }
  await triggerCppReload();
  res.json({ success: true, message: `Station ${id} and connected tracks removed.` });
});

app.post('/api/stations/connect', async (req, res) => {
  const response = await forwardToCpp('/api/stations/connect', {
    method: 'POST',
    body: JSON.stringify(req.body)
  });
  res.status(response.status).json(response.data);
});

app.put('/api/stations/connect', async (req, res) => {
  const { sourceId, destinationId, distance } = req.body;
  const sId = parseInt(sourceId, 10);
  const dId = parseInt(destinationId, 10);
  const dist = parseFloat(distance);
  if (isNaN(sId) || isNaN(dId) || isNaN(dist) || dist <= 0) {
    return res.status(400).json({ error: 'Valid sourceId, destinationId, and distance (> 0) required.' });
  }
  const ok = dataManager.updateTrackDistanceInFile(sId, dId, dist);
  if (!ok) {
    return res.status(404).json({ error: 'One or both stations not found.' });
  }
  await triggerCppReload();
  res.json({ success: true, message: `Track between ${sId} and ${dId} updated to ${dist} km.` });
});

app.delete('/api/stations/connect', async (req, res) => {
  const { sourceId, destinationId } = req.body;
  const sId = parseInt(sourceId, 10);
  const dId = parseInt(destinationId, 10);
  const ok = dataManager.removeTrackFromFile(sId, dId);
  if (!ok) {
    return res.status(404).json({ error: 'Track connection not found.' });
  }
  await triggerCppReload();
  res.json({ success: true, message: `Track between ${sId} and ${dId} removed.` });
});

// 3. Trains API
app.get('/api/trains', async (req, res) => {
  const response = await forwardToCpp('/api/trains');
  res.status(response.status).json(response.data);
});

app.post('/api/trains', async (req, res) => {
  const response = await forwardToCpp('/api/trains', {
    method: 'POST',
    body: JSON.stringify(req.body)
  });
  res.status(response.status).json(response.data);
});

app.put('/api/trains/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { name, capacity, status } = req.body;
  const ok = dataManager.updateTrainInFile(id, name, capacity, status);
  if (!ok) {
    return res.status(404).json({ error: `Train ID ${id} not found.` });
  }
  await triggerCppReload();
  res.json({ success: true, message: `Train ${id} updated.` });
});

app.delete('/api/trains/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const ok = dataManager.removeTrainFromFile(id);
  if (!ok) {
    return res.status(404).json({ error: `Train ID ${id} not found.` });
  }
  await triggerCppReload();
  res.json({ success: true, message: `Train ${id} retired and removed from fleet.` });
});

app.get('/api/trains/availability', async (req, res) => {
  const response = await forwardToCpp('/api/trains');
  if (response.status !== 200 || !Array.isArray(response.data)) {
    return res.status(response.status).json(response.data);
  }
  const trains = response.data;
  const inService = trains.filter(t => t.status === 'IN_SERVICE');
  const standby = trains.filter(t => t.status === 'STANDBY');
  const maintenance = trains.filter(t => t.status === 'MAINTENANCE');
  const totalCapacity = trains.reduce((acc, t) => acc + (t.capacity || 0), 0);
  const currentPassengers = trains.reduce((acc, t) => acc + (t.currentPassengers || 0), 0);
  const availableCapacity = trains.reduce((acc, t) => acc + (t.availableCapacity || 0), 0);

  res.json({
    totalTrains: trains.length,
    inServiceCount: inService.length,
    standbyCount: standby.length,
    maintenanceCount: maintenance.length,
    totalCapacity,
    currentPassengers,
    availableCapacity,
    occupancyPercent: totalCapacity > 0 ? ((currentPassengers / totalCapacity) * 100).toFixed(1) : 0,
    trains
  });
});

// 4. Passengers API
app.get('/api/passengers', async (req, res) => {
  const response = await forwardToCpp('/api/passengers');
  res.status(response.status).json(response.data);
});

app.post('/api/passengers', async (req, res) => {
  const response = await forwardToCpp('/api/passengers', {
    method: 'POST',
    body: JSON.stringify(req.body)
  });
  res.status(response.status).json(response.data);
});

// 5. Routes API
app.get('/api/routes/find', async (req, res) => {
  const queryParams = new URLSearchParams(req.query).toString();
  const response = await forwardToCpp(`/api/routes/find?${queryParams}`);
  res.status(response.status).json(response.data);
});

// 6. Fare Calculation API
app.post('/api/fare/calculate', async (req, res) => {
  const response = await forwardToCpp('/api/fare/calculate', {
    method: 'POST',
    body: JSON.stringify(req.body)
  });
  res.status(response.status).json(response.data);
});

// 7. Ticketing & Payment API
app.post('/api/tickets/book', async (req, res) => {
  const response = await forwardToCpp('/api/tickets/book', {
    method: 'POST',
    body: JSON.stringify(req.body)
  });
  res.status(response.status).json(response.data);
});

app.post('/api/tickets/cancel', async (req, res) => {
  const response = await forwardToCpp('/api/tickets/cancel', {
    method: 'POST',
    body: JSON.stringify(req.body)
  });
  res.status(response.status).json(response.data);
});

app.get('/api/tickets', async (req, res) => {
  const response = await forwardToCpp('/api/tickets');
  res.status(response.status).json(response.data);
});

// 8. Timings & Schedules API
app.get('/api/schedules', (req, res) => {
  const schedules = dataManager.getSchedules();
  res.json(schedules);
});

app.post('/api/schedules', (req, res) => {
  const schedules = dataManager.getSchedules();
  const newSchedule = {
    id: Date.now(),
    line: req.body.line || 'Orange Line',
    origin: req.body.origin || 'Automotive Square',
    destination: req.body.destination || 'Khapri',
    firstTrain: req.body.firstTrain || '06:00',
    lastTrain: req.body.lastTrain || '22:30',
    frequencyPeak: req.body.frequencyPeak || '6 mins',
    frequencyOffPeak: req.body.frequencyOffPeak || '12 mins',
    activeTrains: req.body.activeTrains || ['101'],
    operatingDays: req.body.operatingDays || 'Monday - Sunday',
    stopsCount: req.body.stopsCount || 18,
    averageTravelTime: req.body.averageTravelTime || '38 mins'
  };
  schedules.push(newSchedule);
  dataManager.saveSchedules(schedules);
  res.status(201).json({ success: true, schedule: newSchedule });
});

app.put('/api/schedules/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const schedules = dataManager.getSchedules();
  const idx = schedules.findIndex(s => s.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Schedule not found' });
  schedules[idx] = { ...schedules[idx], ...req.body, id };
  dataManager.saveSchedules(schedules);
  res.json({ success: true, schedule: schedules[idx] });
});

app.delete('/api/schedules/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  let schedules = dataManager.getSchedules();
  const exists = schedules.some(s => s.id === id);
  if (!exists) return res.status(404).json({ error: 'Schedule not found' });
  schedules = schedules.filter(s => s.id !== id);
  dataManager.saveSchedules(schedules);
  res.json({ success: true, message: `Schedule ${id} deleted.` });
});

// 9. Fare Management API
app.get('/api/fares', (req, res) => {
  res.json(dataManager.getFares());
});

app.put('/api/fares', (req, res) => {
  const current = dataManager.getFares();
  const updated = {
    ...current,
    ...req.body,
    lastUpdated: new Date().toISOString()
  };
  dataManager.saveFares(updated);
  res.json({ success: true, message: 'Fare configuration updated.', fares: updated });
});

// 10. Service Alerts & Delays API
app.get('/api/alerts', (req, res) => {
  res.json(dataManager.getAlerts());
});

app.post('/api/alerts', (req, res) => {
  const alerts = dataManager.getAlerts();
  const newAlert = {
    id: Date.now(),
    line: req.body.line || 'All Lines',
    type: req.body.type || 'GENERAL',
    severity: req.body.severity || 'INFO',
    title: req.body.title || 'Transit Notice',
    description: req.body.description || '',
    timestamp: new Date().toISOString(),
    status: req.body.status || 'ACTIVE'
  };
  alerts.unshift(newAlert);
  dataManager.saveAlerts(alerts);
  res.status(201).json({ success: true, alert: newAlert });
});

app.put('/api/alerts/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const alerts = dataManager.getAlerts();
  const idx = alerts.findIndex(a => a.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Alert not found' });
  alerts[idx] = { ...alerts[idx], ...req.body, id };
  dataManager.saveAlerts(alerts);
  res.json({ success: true, alert: alerts[idx] });
});

app.delete('/api/alerts/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  let alerts = dataManager.getAlerts();
  alerts = alerts.filter(a => a.id !== id);
  dataManager.saveAlerts(alerts);
  res.json({ success: true, message: `Alert ${id} removed.` });
});

// 11. Facilities & Station Details API
app.get('/api/facilities', (req, res) => {
  res.json(dataManager.getFacilities());
});

app.put('/api/facilities', (req, res) => {
  dataManager.saveFacilities(req.body);
  res.json({ success: true, message: 'Facilities catalogue updated.' });
});

// 12. Profile & Preferences API
app.get('/api/profile', (req, res) => {
  res.json(dataManager.getProfile());
});

app.put('/api/profile', (req, res) => {
  const profile = dataManager.getProfile();
  const updated = { ...profile, ...req.body };
  dataManager.saveProfile(updated);
  res.json({ success: true, message: 'Profile saved.', profile: updated });
});

// 13. Revenue & Analytics API
app.get('/api/analytics', async (req, res) => {
  const [tkRes, trRes, stRes, psRes] = await Promise.all([
    forwardToCpp('/api/tickets'),
    forwardToCpp('/api/trains'),
    forwardToCpp('/api/stations'),
    forwardToCpp('/api/passengers')
  ]);

  const tickets = Array.isArray(tkRes.data) ? tkRes.data : [];
  const trains = Array.isArray(trRes.data) ? trRes.data : [];
  const stations = Array.isArray(stRes.data) ? stRes.data : [];
  const passengers = Array.isArray(psRes.data) ? psRes.data : [];

  const confirmedTickets = tickets.filter(t => t.bookingStatus === 'CONFIRMED');
  const cancelledTickets = tickets.filter(t => t.bookingStatus === 'CANCELLED');
  const totalRevenue = confirmedTickets.reduce((acc, t) => acc + (t.finalFare || 0), 0);
  const totalRefunded = cancelledTickets.reduce((acc, t) => acc + (t.finalFare || 0), 0);

  // Payment Breakdown
  const paymentMethods = { UPI: 0, Card: 0, Cash: 0 };
  for (const t of tickets) {
    if (t.paymentMethod && paymentMethods[t.paymentMethod] !== undefined) {
      paymentMethods[t.paymentMethod]++;
    }
  }

  // Passenger Type Breakdown
  const passengerTypes = { Regular: 0, Student: 0, 'Senior Citizen': 0 };
  for (const p of passengers) {
    if (p.type && passengerTypes[p.type] !== undefined) {
      passengerTypes[p.type]++;
    }
  }

  // Popular routes
  const routeFreq = {};
  for (const t of tickets) {
    const key = `${t.sourceStationName || t.sourceStationId} ➔ ${t.destinationStationName || t.destinationStationId}`;
    routeFreq[key] = (routeFreq[key] || 0) + 1;
  }
  const topRoutes = Object.entries(routeFreq)
    .map(([route, count]) => ({ route, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  res.json({
    totalRevenue: parseFloat(totalRevenue.toFixed(2)),
    totalRefunded: parseFloat(totalRefunded.toFixed(2)),
    netRevenue: parseFloat((totalRevenue - totalRefunded).toFixed(2)),
    totalTicketsIssued: tickets.length,
    confirmedCount: confirmedTickets.length,
    cancelledCount: cancelledTickets.length,
    cancellationRate: tickets.length > 0 ? ((cancelledTickets.length / tickets.length) * 100).toFixed(1) : 0,
    paymentMethods,
    passengerTypes,
    topRoutes,
    fleetSize: trains.length,
    stationNetworkSize: stations.length,
    passengerBase: passengers.length
  });
});

// 14. Persistence & Stats API
app.post('/api/system/save', async (req, res) => {
  const response = await forwardToCpp('/api/system/save', { method: 'POST' });
  res.status(response.status).json(response.data);
});

app.post('/api/system/load', async (req, res) => {
  const response = await forwardToCpp('/api/system/load', { method: 'POST' });
  res.status(response.status).json(response.data);
});

app.get('/api/system/stats', async (req, res) => {
  const response = await forwardToCpp('/api/system/stats');
  res.status(response.status).json(response.data);
});

app.listen(PORT, () => {
  console.log(`========================================================`);
  console.log(`🚀 MetroX Express Gateway active on http://localhost:${PORT}`);
  console.log(`🔗 Interfacing with C++ Core Engine at: ${CPP_ENGINE_URL}`);
  console.log(`📂 Persistence Mode: C++ File Handling (data/*.txt) + JSON Config`);
  console.log(`========================================================`);
});
