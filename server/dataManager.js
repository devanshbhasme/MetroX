const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const CPP_DATA_DIR = path.join(__dirname, '..', 'MetroX Project', 'metrox', 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJsonFile(filename, defaultData) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
      return defaultData;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error(`Error reading ${filename}:`, err);
    return defaultData;
  }
}

function writeJsonFile(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`Error writing ${filename}:`, err);
    return false;
  }
}

// ----------------- SCHEDULES -----------------
const defaultSchedules = [
  {
    id: 1,
    line: 'Orange Line',
    origin: 'Automotive Square',
    destination: 'Khapri',
    firstTrain: '06:00',
    lastTrain: '22:30',
    frequencyPeak: '6 mins',
    frequencyOffPeak: '12 mins',
    activeTrains: ['101', '103'],
    operatingDays: 'Monday - Sunday',
    stopsCount: 18,
    averageTravelTime: '38 mins'
  },
  {
    id: 2,
    line: 'Aqua Line',
    origin: 'Prajapati Nagar',
    destination: 'Lokmanya Nagar',
    firstTrain: '06:15',
    lastTrain: '22:15',
    frequencyPeak: '7 mins',
    frequencyOffPeak: '14 mins',
    activeTrains: ['102', '104'],
    operatingDays: 'Monday - Sunday',
    stopsCount: 19,
    averageTravelTime: '42 mins'
  },
  {
    id: 3,
    line: 'Orange Express Shuttle',
    origin: 'Sitabuldi Interchange',
    destination: 'Airport / MIHAN',
    firstTrain: '07:00',
    lastTrain: '21:30',
    frequencyPeak: '10 mins',
    frequencyOffPeak: '20 mins',
    activeTrains: ['101'],
    operatingDays: 'Daily',
    stopsCount: 9,
    averageTravelTime: '18 mins'
  }
];

// ----------------- FARES CONFIG -----------------
const defaultFares = {
  baseFare: 10.0,
  ratePerKm: 3.5,
  minFare: 5.0,
  discounts: {
    student: 0.20,
    senior: 0.30,
    weekendPromo: 0.10,
    smartCardBonus: 0.05
  },
  fareSlabs: [
    { maxKm: 3, fare: 10 },
    { maxKm: 6, fare: 15 },
    { maxKm: 12, fare: 25 },
    { maxKm: 18, fare: 35 },
    { maxKm: 25, fare: 45 },
    { maxKm: 50, fare: 55 }
  ],
  currency: 'INR (₹)',
  lastUpdated: new Date().toISOString()
};

// ----------------- SERVICE ALERTS -----------------
const defaultAlerts = [
  {
    id: 1,
    line: 'Aqua Line',
    type: 'DELAY',
    severity: 'WARNING',
    title: '3-5 Min Signaling Delay at Sitabuldi',
    description: 'Minor software sync at Sitabuldi Junction platform 2. Service running smoothly with slight pacing.',
    timestamp: new Date().toISOString(),
    status: 'ACTIVE'
  },
  {
    id: 2,
    line: 'Orange Line',
    type: 'MAINTENANCE',
    severity: 'INFO',
    title: 'Escalator Overhaul at Automotive Square',
    description: 'North exit escalator under scheduled preventative servicing. Elevator accessible for passengers.',
    timestamp: new Date().toISOString(),
    status: 'ACTIVE'
  },
  {
    id: 3,
    line: 'All Lines',
    type: 'GENERAL',
    severity: 'SUCCESS',
    title: '100% On-Time Metro Service Today',
    description: 'Nagpur Metro operates at 99.4% punctuality across all 37 interconnected stations.',
    timestamp: new Date().toISOString(),
    status: 'ACTIVE'
  }
];

// ----------------- FACILITIES -----------------
const defaultFacilities = {
  defaultFacilitiesList: [
    'Elevator / Lift',
    'Wheelchair Accessible Ramp',
    'Tactile Path for Visually Impaired',
    'Restrooms & Baby Care',
    'Automatic Ticket Vending Machines (TVM)',
    'Free High-Speed Wi-Fi',
    'EV Feeder Bus Connectivity',
    '24/7 CCTV & Security Desk',
    'Two-Wheeler & Car Parking',
    'First Aid Post'
  ]
};

// ----------------- USER PROFILE -----------------
const defaultProfile = {
  id: 1,
  name: 'Alex Morgan',
  email: 'alex.morgan@email.com',
  phone: '+91 98765 43210',
  type: 'Regular',
  smartCardNumber: 'METRO-NGP-77492',
  cardBalance: 340.50,
  homeStationId: 1,
  homeStationName: 'Automotive Square',
  workStationId: 8,
  workStationName: 'Sitabuldi',
  preferredLine: 'Orange Line',
  notificationSettings: {
    delays: true,
    fareDiscounts: true,
    platformChanges: true,
    smsReceipts: false
  }
};

// ----------------- C++ TXT FILE HELPERS -----------------

function getStationsFilePath() {
  return path.join(CPP_DATA_DIR, 'stations.txt');
}

function getTrainsFilePath() {
  return path.join(CPP_DATA_DIR, 'trains.txt');
}

function parseStationsFile() {
  const filePath = getStationsFilePath();
  if (!fs.existsSync(filePath)) return [];
  const lines = fs.readFileSync(filePath, 'utf-8').split('\n');
  const stations = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const parts = trimmed.split('|');
    if (parts.length >= 3) {
      const id = parseInt(parts[0], 10);
      const name = parts[1];
      const location = parts[2];
      const conns = [];
      if (parts[3]) {
        const pairs = parts[3].split(',');
        for (const p of pairs) {
          const [tId, d] = p.split(':');
          if (tId && d) {
            conns.push({ targetId: parseInt(tId, 10), distance: parseFloat(d) });
          }
        }
      }
      stations.push({ id, name, location, connections: conns });
    }
  }
  return stations;
}

function writeStationsFile(stations) {
  const filePath = getStationsFilePath();
  let content = '';
  for (const st of stations) {
    const connStr = (st.connections || [])
      .map(c => `${c.targetId}:${c.distance}`)
      .join(',');
    content += `${st.id}|${st.name}|${st.location}|${connStr}\n`;
  }
  fs.writeFileSync(filePath, content, 'utf-8');
}

function updateStationInFile(id, newName, newLocation) {
  const stations = parseStationsFile();
  const st = stations.find(s => s.id === id);
  if (!st) return false;
  if (newName) st.name = newName;
  if (newLocation) st.location = newLocation;
  writeStationsFile(stations);
  return true;
}

function removeStationFromFile(id) {
  let stations = parseStationsFile();
  const exists = stations.some(s => s.id === id);
  if (!exists) return false;
  stations = stations.filter(s => s.id !== id);
  for (const s of stations) {
    s.connections = s.connections.filter(c => c.targetId !== id);
  }
  writeStationsFile(stations);
  return true;
}

function updateTrackDistanceInFile(id1, id2, newDistance) {
  const stations = parseStationsFile();
  const s1 = stations.find(s => s.id === id1);
  const s2 = stations.find(s => s.id === id2);
  if (!s1 || !s2) return false;

  const updateConn = (st, targetId, dist) => {
    const conn = st.connections.find(c => c.targetId === targetId);
    if (conn) {
      conn.distance = dist;
    } else {
      st.connections.push({ targetId, distance: dist });
    }
  };

  updateConn(s1, id2, newDistance);
  updateConn(s2, id1, newDistance);
  writeStationsFile(stations);
  return true;
}

function removeTrackFromFile(id1, id2) {
  const stations = parseStationsFile();
  const s1 = stations.find(s => s.id === id1);
  const s2 = stations.find(s => s.id === id2);
  if (!s1 || !s2) return false;

  s1.connections = s1.connections.filter(c => c.targetId !== id2);
  s2.connections = s2.connections.filter(c => c.targetId !== id1);
  writeStationsFile(stations);
  return true;
}

function parseTrainsFile() {
  const filePath = getTrainsFilePath();
  if (!fs.existsSync(filePath)) return [];
  const lines = fs.readFileSync(filePath, 'utf-8').split('\n');
  const trains = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const parts = trimmed.split('|');
    if (parts.length >= 5) {
      trains.push({
        id: parseInt(parts[0], 10),
        name: parts[1],
        capacity: parseInt(parts[2], 10),
        currentPassengers: parseInt(parts[3], 10),
        status: parts[4]
      });
    }
  }
  return trains;
}

function writeTrainsFile(trains) {
  const filePath = getTrainsFilePath();
  let content = '';
  for (const tr of trains) {
    content += `${tr.id}|${tr.name}|${tr.capacity}|${tr.currentPassengers}|${tr.status}\n`;
  }
  fs.writeFileSync(filePath, content, 'utf-8');
}

function updateTrainInFile(id, newName, newCapacity, newStatus) {
  const trains = parseTrainsFile();
  const tr = trains.find(t => t.id === id);
  if (!tr) return false;
  if (newName) tr.name = newName;
  if (newCapacity !== undefined && newCapacity > 0) tr.capacity = newCapacity;
  if (newStatus) tr.status = newStatus;
  writeTrainsFile(trains);
  return true;
}

function removeTrainFromFile(id) {
  let trains = parseTrainsFile();
  const exists = trains.some(t => t.id === id);
  if (!exists) return false;
  trains = trains.filter(t => t.id !== id);
  writeTrainsFile(trains);
  return true;
}

module.exports = {
  getSchedules: () => readJsonFile('schedules.json', defaultSchedules),
  saveSchedules: (schedules) => writeJsonFile('schedules.json', schedules),
  getFares: () => readJsonFile('fares.json', defaultFares),
  saveFares: (fares) => writeJsonFile('fares.json', fares),
  getAlerts: () => readJsonFile('alerts.json', defaultAlerts),
  saveAlerts: (alerts) => writeJsonFile('alerts.json', alerts),
  getFacilities: () => readJsonFile('facilities.json', defaultFacilities),
  saveFacilities: (facilities) => writeJsonFile('facilities.json', facilities),
  getProfile: () => readJsonFile('profile.json', defaultProfile),
  saveProfile: (profile) => writeJsonFile('profile.json', profile),
  updateStationInFile,
  removeStationFromFile,
  updateTrackDistanceInFile,
  removeTrackFromFile,
  updateTrainInFile,
  removeTrainFromFile
};
