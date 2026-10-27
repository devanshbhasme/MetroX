export interface StationConnection {
  targetId: number;
  targetName: string;
  distance: number;
}

export interface Station {
  id: number;
  name: string;
  location: string;
  connections: StationConnection[];
}

export interface Train {
  id: number;
  name: string;
  capacity: number;
  currentPassengers: number;
  availableCapacity: number;
  occupancyRate: number;
  status: 'IN_SERVICE' | 'STANDBY' | 'MAINTENANCE' | string;
}

export type PassengerType = 'Regular' | 'Student' | 'Senior Citizen';

export interface Passenger {
  id: number;
  name: string;
  email: string;
  type: PassengerType;
  discountPercent: number;
  collegeName?: string;
  studentCardId?: string;
  age?: number;
  seniorCardId?: string;
}

export interface RouteFindingResponse {
  success: boolean;
  algorithm: string;
  path: number[];
  pathStations: Array<{ id: number; name: string; location: string }>;
  distance: number;
  hops: number;
}

export interface FareCalculationResponse {
  distance: number;
  baseFare: number;
  discountPercent: number;
  discountAmount: number;
  finalFare: number;
  passengerType: string;
}

export interface Ticket {
  ticketId: number;
  passengerId: number;
  passengerName: string;
  passengerType: string;
  sourceStationId: number;
  sourceStationName: string;
  destinationStationId: number;
  destinationStationName: string;
  trainId: number;
  trainName: string;
  distance: number;
  baseFare: number;
  discountPercent: number;
  finalFare: number;
  bookingStatus: 'CONFIRMED' | 'CANCELLED';
  paymentStatus: 'PAID' | 'REFUNDED';
  paymentMethod: 'UPI' | 'Card' | 'Cash';
  bookingTime: string;
}

export interface BookingResponse {
  success: boolean;
  message: string;
  ticketId?: number;
  fare?: number;
  change?: number;
  passengerName?: string;
  passengerType?: string;
  sourceName?: string;
  destName?: string;
  trainName?: string;
  error?: string;
}

export interface SystemStats {
  stationCount: number;
  trainCount: number;
  passengerCount: number;
  ticketCount: number;
  activeTickets: number;
  totalRevenue: number;
  fleetCapacity: number;
  currentPassengers: number;
  averageOccupancyPercent: number;
}

export interface Schedule {
  id: number;
  line: string;
  origin: string;
  destination: string;
  firstTrain: string;
  lastTrain: string;
  frequencyPeak: string;
  frequencyOffPeak: string;
  activeTrains: string[];
  operatingDays: string;
  stopsCount: number;
  averageTravelTime: string;
}

export interface FareConfig {
  baseFare: number;
  ratePerKm: number;
  minFare: number;
  discounts: {
    student: number;
    senior: number;
    weekendPromo: number;
    smartCardBonus: number;
  };
  fareSlabs: Array<{ maxKm: number; fare: number }>;
  currency: string;
  lastUpdated: string;
}

export interface TransitAlert {
  id: number;
  line: string;
  type: 'DELAY' | 'MAINTENANCE' | 'GENERAL' | string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS' | string;
  title: string;
  description: string;
  timestamp: string;
  status: 'ACTIVE' | 'RESOLVED' | string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  type: string;
  smartCardNumber: string;
  cardBalance: number;
  homeStationId: number;
  homeStationName: string;
  workStationId: number;
  workStationName: string;
  preferredLine: string;
  notificationSettings: {
    delays: boolean;
    fareDiscounts: boolean;
    platformChanges: boolean;
    smsReceipts: boolean;
  };
}

export interface AnalyticsData {
  totalRevenue: number;
  totalRefunded: number;
  netRevenue: number;
  totalTicketsIssued: number;
  confirmedCount: number;
  cancelledCount: number;
  cancellationRate: string | number;
  paymentMethods: { UPI: number; Card: number; Cash: number };
  passengerTypes: { Regular: number; Student: number; 'Senior Citizen': number };
  topRoutes: Array<{ route: string; count: number }>;
  fleetSize: number;
  stationNetworkSize: number;
  passengerBase: number;
}

export interface FleetAvailability {
  totalTrains: number;
  inServiceCount: number;
  standbyCount: number;
  maintenanceCount: number;
  totalCapacity: number;
  currentPassengers: number;
  availableCapacity: number;
  occupancyPercent: string | number;
  trains: Train[];
}

