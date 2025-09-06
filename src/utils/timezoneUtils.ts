// Timezone utilities for airport-based time calculations

export interface AirportTimezone {
  code: string;
  timezone: string;
  utcOffset: number; // in hours
}

// Airport timezone mappings
export const airportTimezones: Record<string, AirportTimezone> = {
  // United States
  'JFK': { code: 'JFK', timezone: 'America/New_York', utcOffset: -5 },
  'LAX': { code: 'LAX', timezone: 'America/Los_Angeles', utcOffset: -8 },
  'MIA': { code: 'MIA', timezone: 'America/New_York', utcOffset: -5 },
  'ORD': { code: 'ORD', timezone: 'America/Chicago', utcOffset: -6 },
  'DFW': { code: 'DFW', timezone: 'America/Chicago', utcOffset: -6 },
  'SFO': { code: 'SFO', timezone: 'America/Los_Angeles', utcOffset: -8 },
  'LAS': { code: 'LAS', timezone: 'America/Los_Angeles', utcOffset: -8 },
  'SEA': { code: 'SEA', timezone: 'America/Los_Angeles', utcOffset: -8 },
  'BOS': { code: 'BOS', timezone: 'America/New_York', utcOffset: -5 },
  'ATL': { code: 'ATL', timezone: 'America/New_York', utcOffset: -5 },
  'PHX': { code: 'PHX', timezone: 'America/Phoenix', utcOffset: -7 },
  'DEN': { code: 'DEN', timezone: 'America/Denver', utcOffset: -7 },
  'IAH': { code: 'IAH', timezone: 'America/Chicago', utcOffset: -6 },
  'CLT': { code: 'CLT', timezone: 'America/New_York', utcOffset: -5 },
  'MSP': { code: 'MSP', timezone: 'America/Chicago', utcOffset: -6 },
  'DTW': { code: 'DTW', timezone: 'America/New_York', utcOffset: -5 },
  'LGA': { code: 'LGA', timezone: 'America/New_York', utcOffset: -5 },
  'EWR': { code: 'EWR', timezone: 'America/New_York', utcOffset: -5 },
  'MDW': { code: 'MDW', timezone: 'America/Chicago', utcOffset: -6 },
  'DCA': { code: 'DCA', timezone: 'America/New_York', utcOffset: -5 },
  'BWI': { code: 'BWI', timezone: 'America/New_York', utcOffset: -5 },
  'TPA': { code: 'TPA', timezone: 'America/New_York', utcOffset: -5 },
  'MCO': { code: 'MCO', timezone: 'America/New_York', utcOffset: -5 },
  'FLL': { code: 'FLL', timezone: 'America/New_York', utcOffset: -5 },
  'SAN': { code: 'SAN', timezone: 'America/Los_Angeles', utcOffset: -8 },
  'PDX': { code: 'PDX', timezone: 'America/Los_Angeles', utcOffset: -8 },
  'SLC': { code: 'SLC', timezone: 'America/Denver', utcOffset: -7 },
  'STL': { code: 'STL', timezone: 'America/Chicago', utcOffset: -6 },
  'PHL': { code: 'PHL', timezone: 'America/New_York', utcOffset: -5 },
  'BNA': { code: 'BNA', timezone: 'America/Chicago', utcOffset: -6 },

  // Private Jet Popular US Airports
  'VNY': { code: 'VNY', timezone: 'America/Los_Angeles', utcOffset: -8 },
  'HPN': { code: 'HPN', timezone: 'America/New_York', utcOffset: -5 },
  'BED': { code: 'BED', timezone: 'America/New_York', utcOffset: -5 },
  'LGB': { code: 'LGB', timezone: 'America/Los_Angeles', utcOffset: -8 },
  'SNA': { code: 'SNA', timezone: 'America/Los_Angeles', utcOffset: -8 },
  'BUR': { code: 'BUR', timezone: 'America/Los_Angeles', utcOffset: -8 },
  'TEB': { code: 'TEB', timezone: 'America/New_York', utcOffset: -5 },
  'ASE': { code: 'ASE', timezone: 'America/Denver', utcOffset: -7 },

  // Canada
  'YYZ': { code: 'YYZ', timezone: 'America/Toronto', utcOffset: -5 },
  'YVR': { code: 'YVR', timezone: 'America/Vancouver', utcOffset: -8 },
  'YUL': { code: 'YUL', timezone: 'America/Montreal', utcOffset: -5 },
  'YYC': { code: 'YYC', timezone: 'America/Edmonton', utcOffset: -7 },
  'YEG': { code: 'YEG', timezone: 'America/Edmonton', utcOffset: -7 },
  'YOW': { code: 'YOW', timezone: 'America/Toronto', utcOffset: -5 },

  // United Kingdom
  'LHR': { code: 'LHR', timezone: 'Europe/London', utcOffset: 0 },
  'LGW': { code: 'LGW', timezone: 'Europe/London', utcOffset: 0 },
  'STN': { code: 'STN', timezone: 'Europe/London', utcOffset: 0 },
  'MAN': { code: 'MAN', timezone: 'Europe/London', utcOffset: 0 },
  'EDI': { code: 'EDI', timezone: 'Europe/London', utcOffset: 0 },

  // France
  'CDG': { code: 'CDG', timezone: 'Europe/Paris', utcOffset: 1 },
  'ORY': { code: 'ORY', timezone: 'Europe/Paris', utcOffset: 1 },
  'NCE': { code: 'NCE', timezone: 'Europe/Paris', utcOffset: 1 },
  'LYS': { code: 'LYS', timezone: 'Europe/Paris', utcOffset: 1 },

  // Germany
  'FRA': { code: 'FRA', timezone: 'Europe/Berlin', utcOffset: 1 },
  'MUC': { code: 'MUC', timezone: 'Europe/Berlin', utcOffset: 1 },
  'DUS': { code: 'DUS', timezone: 'Europe/Berlin', utcOffset: 1 },
  'BER': { code: 'BER', timezone: 'Europe/Berlin', utcOffset: 1 },

  // Netherlands
  'AMS': { code: 'AMS', timezone: 'Europe/Amsterdam', utcOffset: 1 },

  // Spain
  'MAD': { code: 'MAD', timezone: 'Europe/Madrid', utcOffset: 1 },
  'BCN': { code: 'BCN', timezone: 'Europe/Madrid', utcOffset: 1 },

  // Italy
  'FCO': { code: 'FCO', timezone: 'Europe/Rome', utcOffset: 1 },
  'MXP': { code: 'MXP', timezone: 'Europe/Rome', utcOffset: 1 },

  // Switzerland
  'ZUR': { code: 'ZUR', timezone: 'Europe/Zurich', utcOffset: 1 },
  'GVA': { code: 'GVA', timezone: 'Europe/Zurich', utcOffset: 1 },

  // Austria
  'VIE': { code: 'VIE', timezone: 'Europe/Vienna', utcOffset: 1 },

  // Denmark
  'CPH': { code: 'CPH', timezone: 'Europe/Copenhagen', utcOffset: 1 },

  // Sweden
  'ARN': { code: 'ARN', timezone: 'Europe/Stockholm', utcOffset: 1 },

  // Norway
  'OSL': { code: 'OSL', timezone: 'Europe/Oslo', utcOffset: 1 },

  // Finland
  'HEL': { code: 'HEL', timezone: 'Europe/Helsinki', utcOffset: 2 },

  // Belgium
  'BRU': { code: 'BRU', timezone: 'Europe/Brussels', utcOffset: 1 },

  // Portugal
  'LIS': { code: 'LIS', timezone: 'Europe/Lisbon', utcOffset: 0 },

  // Poland
  'WAW': { code: 'WAW', timezone: 'Europe/Warsaw', utcOffset: 1 },

  // Czech Republic
  'PRG': { code: 'PRG', timezone: 'Europe/Prague', utcOffset: 1 },

  // Hungary
  'BUD': { code: 'BUD', timezone: 'Europe/Budapest', utcOffset: 1 },

  // Turkey
  'IST': { code: 'IST', timezone: 'Europe/Istanbul', utcOffset: 3 },
  'SAW': { code: 'SAW', timezone: 'Europe/Istanbul', utcOffset: 3 },
  'ESB': { code: 'ESB', timezone: 'Europe/Istanbul', utcOffset: 3 },
  'ADB': { code: 'ADB', timezone: 'Europe/Istanbul', utcOffset: 3 },
  'AYT': { code: 'AYT', timezone: 'Europe/Istanbul', utcOffset: 3 },
  'BJV': { code: 'BJV', timezone: 'Europe/Istanbul', utcOffset: 3 },
  'DLM': { code: 'DLM', timezone: 'Europe/Istanbul', utcOffset: 3 },

  // Middle East
  'DXB': { code: 'DXB', timezone: 'Asia/Dubai', utcOffset: 4 },
  'AUH': { code: 'AUH', timezone: 'Asia/Dubai', utcOffset: 4 },
  'DOH': { code: 'DOH', timezone: 'Asia/Qatar', utcOffset: 3 },
  'KWI': { code: 'KWI', timezone: 'Asia/Kuwait', utcOffset: 3 },
  'BAH': { code: 'BAH', timezone: 'Asia/Bahrain', utcOffset: 3 },
  'RUH': { code: 'RUH', timezone: 'Asia/Riyadh', utcOffset: 3 },
  'JED': { code: 'JED', timezone: 'Asia/Riyadh', utcOffset: 3 },
  'CAI': { code: 'CAI', timezone: 'Africa/Cairo', utcOffset: 2 },
  'TLV': { code: 'TLV', timezone: 'Asia/Jerusalem', utcOffset: 2 },
  'AMM': { code: 'AMM', timezone: 'Asia/Amman', utcOffset: 2 },

  // Asia
  'NRT': { code: 'NRT', timezone: 'Asia/Tokyo', utcOffset: 9 },
  'HND': { code: 'HND', timezone: 'Asia/Tokyo', utcOffset: 9 },
  'KIX': { code: 'KIX', timezone: 'Asia/Tokyo', utcOffset: 9 },
  'ICN': { code: 'ICN', timezone: 'Asia/Seoul', utcOffset: 9 },
  'SIN': { code: 'SIN', timezone: 'Asia/Singapore', utcOffset: 8 },
  'HKG': { code: 'HKG', timezone: 'Asia/Hong_Kong', utcOffset: 8 },
  'PEK': { code: 'PEK', timezone: 'Asia/Shanghai', utcOffset: 8 },
  'PVG': { code: 'PVG', timezone: 'Asia/Shanghai', utcOffset: 8 },
  'CAN': { code: 'CAN', timezone: 'Asia/Shanghai', utcOffset: 8 },
  'BOM': { code: 'BOM', timezone: 'Asia/Kolkata', utcOffset: 5.5 },
  'DEL': { code: 'DEL', timezone: 'Asia/Kolkata', utcOffset: 5.5 },
  'BLR': { code: 'BLR', timezone: 'Asia/Kolkata', utcOffset: 5.5 },
  'BKK': { code: 'BKK', timezone: 'Asia/Bangkok', utcOffset: 7 },
  'KUL': { code: 'KUL', timezone: 'Asia/Kuala_Lumpur', utcOffset: 8 },
  'CGK': { code: 'CGK', timezone: 'Asia/Jakarta', utcOffset: 7 },
  'MNL': { code: 'MNL', timezone: 'Asia/Manila', utcOffset: 8 },

  // Africa
  'JNB': { code: 'JNB', timezone: 'Africa/Johannesburg', utcOffset: 2 },
  'CPT': { code: 'CPT', timezone: 'Africa/Cape_Town', utcOffset: 2 },
  'LOS': { code: 'LOS', timezone: 'Africa/Lagos', utcOffset: 1 },
  'ABV': { code: 'ABV', timezone: 'Africa/Lagos', utcOffset: 1 },
  'ADD': { code: 'ADD', timezone: 'Africa/Addis_Ababa', utcOffset: 3 },
  'NBO': { code: 'NBO', timezone: 'Africa/Nairobi', utcOffset: 3 },
  'CMN': { code: 'CMN', timezone: 'Africa/Casablanca', utcOffset: 1 },
  'TUN': { code: 'TUN', timezone: 'Africa/Tunis', utcOffset: 1 },
  'ALG': { code: 'ALG', timezone: 'Africa/Algiers', utcOffset: 1 },

  // South America
  'GRU': { code: 'GRU', timezone: 'America/Sao_Paulo', utcOffset: -3 },
  'GIG': { code: 'GIG', timezone: 'America/Sao_Paulo', utcOffset: -3 },
  'BSB': { code: 'BSB', timezone: 'America/Sao_Paulo', utcOffset: -3 },
  'EZE': { code: 'EZE', timezone: 'America/Argentina/Buenos_Aires', utcOffset: -3 },
  'SCL': { code: 'SCL', timezone: 'America/Santiago', utcOffset: -4 },
  'LIM': { code: 'LIM', timezone: 'America/Lima', utcOffset: -5 },
  'BOG': { code: 'BOG', timezone: 'America/Bogota', utcOffset: -5 },

  // Oceania
  'SYD': { code: 'SYD', timezone: 'Australia/Sydney', utcOffset: 10 },
  'MEL': { code: 'MEL', timezone: 'Australia/Melbourne', utcOffset: 10 },
  'BNE': { code: 'BNE', timezone: 'Australia/Brisbane', utcOffset: 10 },
  'PER': { code: 'PER', timezone: 'Australia/Perth', utcOffset: 8 },
  'AKL': { code: 'AKL', timezone: 'Pacific/Auckland', utcOffset: 12 },
  'CHC': { code: 'CHC', timezone: 'Pacific/Auckland', utcOffset: 12 }
};

// Get airport timezone from city name or airport code
export const getAirportTimezone = (location: string): AirportTimezone | null => {
  // First try to find by airport code
  const airportCode = Object.keys(airportTimezones).find(code => 
    code.toLowerCase() === location.toLowerCase()
  );
  
  if (airportCode) {
    return airportTimezones[airportCode];
  }
  
  // Try to find by city name in airports data
  const cityMappings: Record<string, string> = {
    'new york': 'JFK',
    'los angeles': 'LAX',
    'miami': 'MIA',
    'chicago': 'ORD',
    'dallas': 'DFW',
    'san francisco': 'SFO',
    'las vegas': 'LAS',
    'seattle': 'SEA',
    'boston': 'BOS',
    'atlanta': 'ATL',
    'phoenix': 'PHX',
    'denver': 'DEN',
    'houston': 'IAH',
    'charlotte': 'CLT',
    'minneapolis': 'MSP',
    'detroit': 'DTW',
    'newark': 'EWR',
    'washington': 'DCA',
    'baltimore': 'BWI',
    'tampa': 'TPA',
    'orlando': 'MCO',
    'fort lauderdale': 'FLL',
    'san diego': 'SAN',
    'portland': 'PDX',
    'salt lake city': 'SLC',
    'st. louis': 'STL',
    'philadelphia': 'PHL',
    'nashville': 'BNA',
    'van nuys': 'VNY',
    'white plains': 'HPN',
    'bedford': 'BED',
    'long beach': 'LGB',
    'orange county': 'SNA',
    'burbank': 'BUR',
    'teterboro': 'TEB',
    'aspen': 'ASE',
    'toronto': 'YYZ',
    'vancouver': 'YVR',
    'montreal': 'YUL',
    'calgary': 'YYC',
    'edmonton': 'YEG',
    'ottawa': 'YOW',
    'london': 'LHR',
    'manchester': 'MAN',
    'edinburgh': 'EDI',
    'paris': 'CDG',
    'nice': 'NCE',
    'lyon': 'LYS',
    'frankfurt': 'FRA',
    'munich': 'MUC',
    'düsseldorf': 'DUS',
    'berlin': 'BER',
    'amsterdam': 'AMS',
    'madrid': 'MAD',
    'barcelona': 'BCN',
    'rome': 'FCO',
    'milan': 'MXP',
    'zurich': 'ZUR',
    'geneva': 'GVA',
    'vienna': 'VIE',
    'copenhagen': 'CPH',
    'stockholm': 'ARN',
    'oslo': 'OSL',
    'helsinki': 'HEL',
    'brussels': 'BRU',
    'lisbon': 'LIS',
    'warsaw': 'WAW',
    'prague': 'PRG',
    'budapest': 'BUD',
    'istanbul': 'IST',
    'ankara': 'ESB',
    'izmir': 'ADB',
    'antalya': 'AYT',
    'bodrum': 'BJV',
    'dalaman': 'DLM',
    'dubai': 'DXB',
    'abu dhabi': 'AUH',
    'doha': 'DOH',
    'kuwait city': 'KWI',
    'manama': 'BAH',
    'riyadh': 'RUH',
    'jeddah': 'JED',
    'cairo': 'CAI',
    'tel aviv': 'TLV',
    'amman': 'AMM',
    'tokyo': 'NRT',
    'osaka': 'KIX',
    'seoul': 'ICN',
    'singapore': 'SIN',
    'hong kong': 'HKG',
    'beijing': 'PEK',
    'shanghai': 'PVG',
    'guangzhou': 'CAN',
    'mumbai': 'BOM',
    'new delhi': 'DEL',
    'bangalore': 'BLR',
    'bangkok': 'BKK',
    'kuala lumpur': 'KUL',
    'jakarta': 'CGK',
    'manila': 'MNL',
    'johannesburg': 'JNB',
    'cape town': 'CPT',
    'lagos': 'LOS',
    'abuja': 'ABV',
    'addis ababa': 'ADD',
    'nairobi': 'NBO',
    'casablanca': 'CMN',
    'tunis': 'TUN',
    'algiers': 'ALG',
    'são paulo': 'GRU',
    'rio de janeiro': 'GIG',
    'brasília': 'BSB',
    'buenos aires': 'EZE',
    'santiago': 'SCL',
    'lima': 'LIM',
    'bogotá': 'BOG',
    'sydney': 'SYD',
    'melbourne': 'MEL',
    'brisbane': 'BNE',
    'perth': 'PER',
    'auckland': 'AKL',
    'christchurch': 'CHC'
  };
  
  const cityCode = cityMappings[location.toLowerCase()];
  if (cityCode && airportTimezones[cityCode]) {
    return airportTimezones[cityCode];
  }
  
  // Default to UTC if not found
  return {
    code: 'UTC',
    timezone: 'UTC',
    utcOffset: 0
  };
};

// Get current time in airport timezone
export const getCurrentTimeInAirportTimezone = (location: string): Date => {
  const airportTz = getAirportTimezone(location);
  if (!airportTz) {
    return new Date();
  }
  
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const airportTime = new Date(utc + (airportTz.utcOffset * 3600000));
  
  return airportTime;
};

// Get minimum booking time (current airport time + 3 hours)
export const getMinimumBookingTime = (departureLocation: string): string => {
  const airportTime = getCurrentTimeInAirportTimezone(departureLocation);
  airportTime.setHours(airportTime.getHours() + 3);
  
  return airportTime.toISOString().slice(0, 16);
};

// Format time for display with timezone info
export const formatTimeWithTimezone = (dateTime: string, location: string): string => {
  const airportTz = getAirportTimezone(location);
  if (!airportTz) {
    return new Date(dateTime).toLocaleString();
  }
  
  const date = new Date(dateTime);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: airportTz.timezone
  };
  
  return date.toLocaleString('en-US', options) + ` (${airportTz.code} Time)`;
};

// Convert user's local time to airport timezone
export const convertToAirportTime = (localDateTime: string, location: string): Date => {
  const airportTz = getAirportTimezone(location);
  if (!airportTz) {
    return new Date(localDateTime);
  }
  
  // Parse the local datetime
  const localDate = new Date(localDateTime);
  
  // Get user's timezone offset
  const userOffset = localDate.getTimezoneOffset() / 60;
  
  // Calculate the difference between user timezone and airport timezone
  const offsetDiff = airportTz.utcOffset + userOffset;
  
  // Adjust the time
  const airportTime = new Date(localDate.getTime() + (offsetDiff * 3600000));
  
  return airportTime;
};

// Get timezone display name
export const getTimezoneDisplayName = (location: string): string => {
  const airportTz = getAirportTimezone(location);
  if (!airportTz) {
    return 'Local Time';
  }
  
  const offsetHours = Math.abs(airportTz.utcOffset);
  const offsetMinutes = (Math.abs(airportTz.utcOffset) % 1) * 60;
  const sign = airportTz.utcOffset >= 0 ? '+' : '-';
  
  return `GMT${sign}${offsetHours.toString().padStart(2, '0')}:${offsetMinutes.toString().padStart(2, '0')}`;
};

// Validate if selected time meets 3-hour minimum in airport timezone
export const validateMinimumBookingTime = (selectedDateTime: string, departureLocation: string): {
  isValid: boolean;
  minimumTime: string;
  airportCurrentTime: string;
  message: string;
} => {
  const airportTz = getAirportTimezone(departureLocation);
  const airportCurrentTime = getCurrentTimeInAirportTimezone(departureLocation);
  const minimumTime = new Date(airportCurrentTime.getTime() + (3 * 60 * 60 * 1000));
  const selectedTime = new Date(selectedDateTime);
  
  const isValid = selectedTime >= minimumTime;
  
  return {
    isValid,
    minimumTime: minimumTime.toISOString().slice(0, 16),
    airportCurrentTime: airportCurrentTime.toISOString().slice(0, 16),
    message: isValid 
      ? 'Valid booking time'
      : `Minimum booking time is ${minimumTime.toLocaleString()} (${airportTz?.code || 'Local'} Time)`
  };
};