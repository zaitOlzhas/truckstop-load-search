import { Country, EquipmentType, LoadType, SortBy } from './enums';

// Configuration (credentials)
export interface TruckStopConfig {
  integrationId: string;
  userName: string;
  password: string;
}

// Search criteria
export interface SearchCriteria {
  originCity?: string;
  originState?: string | string[]; // Supports multiple states (max 15)
  originCountry?: Country | string;
  originRange?: number;
  destinationCity?: string;
  destinationState?: string | string[]; // Supports multiple states (max 15)
  destinationCountry?: Country | string;
  destinationRange?: number;
  equipmentType?: EquipmentType | string | string[];
  loadType?: LoadType | string;
  hoursOld?: number;
  pickupDates?: Date[]; // Multiple pickup dates
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortBy | string;
  sortDescending?: boolean;
}

// Load search request
export interface LoadSearchRequest {
  integrationId: string;
  userName: string;
  password: string;
  criteria: SearchCriteria;
}

// Equipment type details from API
export interface EquipmentTypeDetails {
  category: string;
  categoryId: number;
  code: string;
  description: string;
  fullLoad: string | null;
  id: number;
  isCategorizable: boolean;
  isCombo: boolean;
  isTruckPost: boolean;
  mapToId: number;
  requiredOption: string;
  webserviceOnly: boolean;
}

// Load data from API
export interface Load {
  id: string;
  age: string;
  bond: number;
  bondTypeID: string;
  credit: string;
  dotNumber: string;
  deletedId: number;
  deliveryDate: string;
  deliveryTime: string;
  destinationCity: string;
  destinationCountry: string;
  destinationDistance: number;
  destinationState: string;
  destinationZip: string;
  distance: number;
  entered: string; // ISO date string
  equipment: string;
  equipmentOptions: string[];
  equipmentTypes: EquipmentTypeDetails;
  experienceFactor: string;
  fuelCost: number | null;
  handleName: string;
  hasBonding: boolean;
  isDeleted: boolean;
  isFriend: boolean;
  length: number | null;
  loadType: string;
  mcNumber: string;
  mileage: number;
  originCity: string;
  originCountry: string;
  originDistance: number;
  originState: string;
  originZip: string;
  paymentAmount: number;
  pickupDate: string;
  pickupTime: string;
  pointOfContact: string;
  pointOfContactPhone: string;
  pricePerGallon: number;
  quantity: number;
  specInfo: string;
  stops: number;
  tmcNumber: string;
  truckCompanyCity: string;
  truckCompanyEmail: string;
  truckCompanyFax: string;
  truckCompanyId: number;
  truckCompanyName: string;
  truckCompanyPhone: string;
  truckCompanyState: string;
  weight: number;
  width: number;
}

// API response
export interface LoadSearchResponse {
  loads: Load[];
  errorMessage: string | null;
  hasError: boolean;
  totalResults: number;
}
