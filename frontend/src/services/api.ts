import {
  Station,
  Train,
  Passenger,
  Ticket,
  RouteFindingResponse,
  FareCalculationResponse,
  BookingResponse,
  SystemStats,
  Schedule,
  FareConfig,
  TransitAlert,
  UserProfile,
  AnalyticsData,
  FleetAvailability
} from '../types/metro';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {})
    },
    ...options
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export const api = {
  // System Health & Stats
  getHealth: () => fetchJson<{ status: string; gateway: string; cppEngineStatus: string }>('/health'),
  getStats: () => fetchJson<SystemStats>('/system/stats'),
  saveSystemData: () => fetchJson<{ success: boolean; message: string }>('/system/save', { method: 'POST' }),
  loadSystemData: () => fetchJson<{ success: boolean; message: string }>('/system/load', { method: 'POST' }),

  // Stations
  getStations: () => fetchJson<Station[]>('/stations'),
  addStation: (name: string, location: string) => 
    fetchJson<{ success: boolean; id: number; name: string }>('/stations', {
      method: 'POST',
      body: JSON.stringify({ name, location })
    }),
  updateStation: (id: number, name: string, location: string) =>
    fetchJson<{ success: boolean; message: string }>(`/stations/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name, location })
    }),
  deleteStation: (id: number) =>
    fetchJson<{ success: boolean; message: string }>(`/stations/${id}`, {
      method: 'DELETE'
    }),
  connectStations: (sourceId: number, destinationId: number, distance: number) =>
    fetchJson<{ success: boolean }>('/stations/connect', {
      method: 'POST',
      body: JSON.stringify({ sourceId, destinationId, distance })
    }),
  updateTrackDistance: (sourceId: number, destinationId: number, distance: number) =>
    fetchJson<{ success: boolean; message: string }>('/stations/connect', {
      method: 'PUT',
      body: JSON.stringify({ sourceId, destinationId, distance })
    }),
  deleteTrack: (sourceId: number, destinationId: number) =>
    fetchJson<{ success: boolean; message: string }>('/stations/connect', {
      method: 'DELETE',
      body: JSON.stringify({ sourceId, destinationId })
    }),

  // Trains
  getTrains: () => fetchJson<Train[]>('/trains'),
  addTrain: (name: string, capacity: number, status: string = 'IN_SERVICE') =>
    fetchJson<{ success: boolean; id: number }>('/trains', {
      method: 'POST',
      body: JSON.stringify({ name, capacity, status })
    }),
  updateTrain: (id: number, data: { name?: string; capacity?: number; status?: string }) =>
    fetchJson<{ success: boolean; message: string }>(`/trains/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  deleteTrain: (id: number) =>
    fetchJson<{ success: boolean; message: string }>(`/trains/${id}`, {
      method: 'DELETE'
    }),
  getTrainAvailability: () => fetchJson<FleetAvailability>('/trains/availability'),

  // Passengers
  getPassengers: () => fetchJson<Passenger[]>('/passengers'),
  registerPassenger: (data: {
    type: 'REGULAR' | 'STUDENT' | 'SENIOR';
    name: string;
    email: string;
    collegeName?: string;
    studentCardId?: string;
    age?: number;
    seniorCardId?: string;
  }) => fetchJson<{ success: boolean; id: number }>('/passengers', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  // Routes & Fare
  findRoute: (source: number, destination: number, mode: 'dijkstra' | 'bfs' = 'dijkstra') =>
    fetchJson<RouteFindingResponse>(`/routes/find?source=${source}&destination=${destination}&mode=${mode}`),
  calculateFare: (distance: number, passengerId: number) =>
    fetchJson<FareCalculationResponse>('/fare/calculate', {
      method: 'POST',
      body: JSON.stringify({ distance, passengerId })
    }),

  // Tickets
  getTickets: () => fetchJson<Ticket[]>('/tickets'),
  bookTicket: (bookingData: {
    passengerId: number;
    sourceStationId: number;
    destinationStationId: number;
    trainId: number;
    paymentMethod: 'UPI' | 'Card' | 'Cash';
    upiId?: string;
    cardNumber?: string;
    cardHolder?: string;
    cardExp?: string;
    cardCvv?: string;
    cashTendered?: number;
  }) => fetchJson<BookingResponse>('/tickets/book', {
    method: 'POST',
    body: JSON.stringify(bookingData)
  }),
  cancelTicket: (ticketId: number) =>
    fetchJson<{ success: boolean; message: string; refundAmount: number; releasedTrainId: number }>('/tickets/cancel', {
      method: 'POST',
      body: JSON.stringify({ ticketId })
    }),

  // Schedules
  getSchedules: () => fetchJson<Schedule[]>('/schedules'),
  addSchedule: (data: Partial<Schedule>) =>
    fetchJson<{ success: boolean; schedule: Schedule }>('/schedules', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  updateSchedule: (id: number, data: Partial<Schedule>) =>
    fetchJson<{ success: boolean; schedule: Schedule }>(`/schedules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  deleteSchedule: (id: number) =>
    fetchJson<{ success: boolean; message: string }>(`/schedules/${id}`, {
      method: 'DELETE'
    }),

  // Fares Management
  getFares: () => fetchJson<FareConfig>('/fares'),
  updateFares: (data: Partial<FareConfig>) =>
    fetchJson<{ success: boolean; message: string; fares: FareConfig }>('/fares', {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  // Service Alerts & Delays
  getAlerts: () => fetchJson<TransitAlert[]>('/alerts'),
  addAlert: (data: Partial<TransitAlert>) =>
    fetchJson<{ success: boolean; alert: TransitAlert }>('/alerts', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  updateAlert: (id: number, data: Partial<TransitAlert>) =>
    fetchJson<{ success: boolean; alert: TransitAlert }>(`/alerts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  deleteAlert: (id: number) =>
    fetchJson<{ success: boolean; message: string }>(`/alerts/${id}`, {
      method: 'DELETE'
    }),

  // Facilities
  getFacilities: () => fetchJson<{ defaultFacilitiesList: string[] }>('/facilities'),
  updateFacilities: (data: { defaultFacilitiesList: string[] }) =>
    fetchJson<{ success: boolean; message: string }>('/facilities', {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  // Profile & Preferences
  getProfile: () => fetchJson<UserProfile>('/profile'),
  updateProfile: (data: Partial<UserProfile>) =>
    fetchJson<{ success: boolean; message: string; profile: UserProfile }>('/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  // Analytics
  getAnalytics: () => fetchJson<AnalyticsData>('/analytics')
};
