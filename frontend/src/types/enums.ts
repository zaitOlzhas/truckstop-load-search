// Country codes based on TruckStop API
export enum Country {
  USA = 'USA',
  CANADA = 'CAN',
  MEXICO = 'MEX',
}

// US State codes with full names
export const USStateNames: Record<string, string> = {
  'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas',
  'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware',
  'DC': 'District of Columbia', 'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii',
  'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
  'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine',
  'MD': 'Maryland', 'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota',
  'MS': 'Mississippi', 'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska',
  'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico',
  'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
  'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island',
  'SC': 'South Carolina', 'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas',
  'UT': 'Utah', 'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington',
  'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming',
};

// Canadian Province codes with full names
export const CanadianProvinceNames: Record<string, string> = {
  'AB': 'Alberta', 'BC': 'British Columbia', 'MB': 'Manitoba',
  'NB': 'New Brunswick', 'NL': 'Newfoundland and Labrador', 'NS': 'Nova Scotia',
  'NT': 'Northwest Territories', 'ON': 'Ontario', 'PE': 'Prince Edward Island',
  'QC': 'Quebec', 'SK': 'Saskatchewan', 'YT': 'Yukon',
};

// Mexican State codes with full names
export const MexicanStateNames: Record<string, string> = {
  'AG': 'Aguascalientes', 'BC': 'Baja California', 'BS': 'Baja California Sur',
  'CH': 'Chihuahua', 'CL': 'Colima', 'CM': 'Campeche', 'CO': 'Coahuila',
  'CS': 'Chiapas', 'DF': 'Ciudad de México', 'DG': 'Durango',
  'GR': 'Guerrero', 'GT': 'Guanajuato', 'HG': 'Hidalgo', 'JA': 'Jalisco',
  'MI': 'Michoacán', 'MO': 'Morelos', 'MX': 'México', 'NA': 'Nayarit',
  'NL': 'Nuevo León', 'OA': 'Oaxaca', 'PU': 'Puebla', 'QR': 'Quintana Roo',
  'QT': 'Querétaro', 'SI': 'Sinaloa', 'SL': 'San Luis Potosí', 'SO': 'Sonora',
  'TB': 'Tabasco', 'TL': 'Tlaxcala', 'TM': 'Tamaulipas', 'VE': 'Veracruz',
  'YU': 'Yucatán', 'ZT': 'Zacatecas',
};

// US State codes
export enum USState {
  AL = 'AL', AK = 'AK', AZ = 'AZ', AR = 'AR', CA = 'CA',
  CO = 'CO', CT = 'CT', DE = 'DE', DC = 'DC', FL = 'FL',
  GA = 'GA', HI = 'HI', ID = 'ID', IL = 'IL', IN = 'IN',
  IA = 'IA', KS = 'KS', KY = 'KY', LA = 'LA', ME = 'ME',
  MD = 'MD', MA = 'MA', MI = 'MI', MN = 'MN', MS = 'MS',
  MO = 'MO', MT = 'MT', NE = 'NE', NV = 'NV', NH = 'NH',
  NJ = 'NJ', NM = 'NM', NY = 'NY', NC = 'NC', ND = 'ND',
  OH = 'OH', OK = 'OK', OR = 'OR', PA = 'PA', RI = 'RI',
  SC = 'SC', SD = 'SD', TN = 'TN', TX = 'TX', UT = 'UT',
  VT = 'VT', VA = 'VA', WA = 'WA', WV = 'WV', WI = 'WI',
  WY = 'WY',
}

// Canadian Province codes
export enum CanadianProvince {
  AB = 'AB', BC = 'BC', MB = 'MB', NB = 'NB', NL = 'NL',
  NS = 'NS', NT = 'NT', ON = 'ON', PE = 'PE', QC = 'QC',
  SK = 'SK', YT = 'YT',
}

// Mexican State codes
export enum MexicanState {
  AG = 'AG', BC = 'BC', BS = 'BS', CH = 'CH', CL = 'CL',
  CM = 'CM', CO = 'CO', CS = 'CS', DF = 'DF', DG = 'DG',
  GR = 'GR', GT = 'GT', HG = 'HG', JA = 'JA', MI = 'MI',
  MO = 'MO', MX = 'MX', NA = 'NA', NL = 'NL', OA = 'OA',
  PU = 'PU', QR = 'QR', QT = 'QT', SI = 'SI', SL = 'SL',
  SO = 'SO', TB = 'TB', TL = 'TL', TM = 'TM', VE = 'VE',
  YU = 'YU', ZT = 'ZT',
}

// Equipment types based on TruckStop API
export enum EquipmentType {
  TWO_FLATBED = '2F',
  ANIMAL = 'ANIM',
  ANY = 'ANY',
  AUTO = 'AUTO',
  B_TRAIN = 'B-TR',
  BELLY_DUMP = 'BDMP',
  BEAM = 'BEAM',
  BELT = 'BELT',
  BOAT = 'BOAT',
  CHAIN = 'CH',
  CONESTOGA = 'CONG',
  CONTAINER = 'CONT',
  CURTAIN_VAN = 'CV',
  DOUBLE_DROP_AIR = 'DA',
  DOUBLE_DROP = 'DD',
  DOUBLE_DROP_EXTENDABLE = 'DDE',
  DUMP = 'DUMP',
  END_DUMP = 'ENDP',
  FLATBED = 'F',
  FLATBED_AIR = 'FA',
  FLATBED_EXTENDABLE = 'FEXT',
  FLATBED_INTERMODAL = 'FINT',
  FLATBED_OVER = 'FO',
  FLATBED_REMOVABLE = 'FRV',
  FLATBED_STEP_DECK = 'FSD',
  FLATBED_STEP_DECK_VAN = 'FSDV',
  FLATBED_VAN = 'FV',
  FLATBED_VAN_REEFER = 'FVR',
  FLATBED_VAN_VENTED = 'FVV',
  FLATBED_VAN_VENTED_REEFER = 'FVVR',
  FLATBED_WITH_SIDES = 'FWS',
  HOPPER = 'HOPP',
  HOTSHOT = 'HS',
  HAUL_TRUCK = 'HTU',
  LANDALL_FLATBED = 'LAF',
  LOWBOY = 'LB',
  LOWBOY_OVER = 'LBO',
  LOWBOY_DOUBLE_DROP = 'LDOT',
  MAXI_FLATBED = 'MAXI',
  MOVING_VAN = 'MBHM',
  PNEUMATIC = 'PNEU',
  POWER_ONLY = 'PO',
  REEFER = 'R',
  REEFER_FLATBED_VAN = 'RFV',
  REMOVABLE_GOOSENECK = 'RGN',
  REEFER_INTERMODAL = 'RINT',
  ROLL_OFF = 'ROLL',
  REEFER_PALLET = 'RPD',
  REEFER_VAN = 'RV',
  REEFER_VAN_FLATBED = 'RVF',
  STEP_DECK = 'SD',
  STEP_DECK_LOGISTIC = 'SDL',
  STEP_DECK_OVER = 'SDO',
  STEP_DECK_REMOVABLE_GOOSENECK = 'SDRG',
  SPECIALIZED = 'SPEC',
  STRAIGHT_VAN = 'SV',
  TANKER = 'TANK',
  VAN = 'V',
  VAN_OTHER = 'V-OT',
  VAN_AIR = 'VA',
  VAN_BLANKET = 'VB',
  VAN_CARRIER = 'VCAR',
  VAN_FLATBED = 'VF',
  VAN_FLATBED_REEFER = 'VFR',
  VAN_INTERMODAL = 'VINT',
  VAN_INSULATED = 'IX',
  VAN_INSULATED_VAN_REEFER = 'VIVR',
  VAN_LOGISTICS = 'VLG',
  VAN_MOVING = 'VM',
  VAN_REEFER = 'VR',
  VAN_REEFER_DOUBLE_DROP = 'VRDD',
  VAN_REEFER_FLATBED = 'VRF',
  VAN_OPEN_TOP = 'X',
  VAN_VAN_REEFER = 'VVR',
  WALKING_FLOOR = 'WALK',
}

// Load types
export enum LoadType {
  NOTHING = 'Nothing',
  ALL = 'All',
  FULL = 'Full',
  PARTIAL = 'Partial',
}

// Sort options
export enum SortBy {
  AGE = 'Age',
  ORIGIN_CITY = 'OriginCity',
  ORIGIN_STATE = 'OriginState',
  DESTINATION_CITY = 'DestinationCity',
  DESTINATION_STATE = 'DestinationState',
  PICKUP_DATE = 'PickupDate',
  EQUIPMENT = 'Equipment',
  RATE = 'Rate',
  COMPANY = 'Company',
}

// Helper function to get state/province options based on country
export function getStateProvinceOptions(country: string | undefined): Array<{ code: string; name: string }> {
  if (!country) return [];

  switch (country) {
    case Country.USA:
      return Object.entries(USStateNames).map(([code, name]) => ({ code, name: `${code} - ${name}` }));
    case Country.CANADA:
      return Object.entries(CanadianProvinceNames).map(([code, name]) => ({ code, name: `${code} - ${name}` }));
    case Country.MEXICO:
      return Object.entries(MexicanStateNames).map(([code, name]) => ({ code, name: `${code} - ${name}` }));
    default:
      return [];
  }
}

// Helper functions to get display names
export const getEquipmentTypeName = (code: string): string => {
  const entry = Object.entries(EquipmentType).find(([_, value]) => value === code);
  return entry ? entry[0].replace(/_/g, ' ') : code;
};
