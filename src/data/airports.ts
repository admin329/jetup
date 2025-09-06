export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  region: string;
  latitude: number;
  longitude: number;
}

export const airports: Airport[] = [
  // United States
  { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'United States', region: 'North America', latitude: 40.6413, longitude: -73.7781 },
  { code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'United States', region: 'North America', latitude: 33.9425, longitude: -118.4081 },
  { code: 'MIA', name: 'Miami International Airport', city: 'Miami', country: 'United States', region: 'North America', latitude: 25.7959, longitude: -80.2870 },
  { code: 'ORD', name: 'Chicago O\'Hare International Airport', city: 'Chicago', country: 'United States', region: 'North America', latitude: 41.9742, longitude: -87.9073 },
  { code: 'DFW', name: 'Dallas/Fort Worth International Airport', city: 'Dallas', country: 'United States', region: 'North America', latitude: 32.8998, longitude: -97.0403 },
  { code: 'SFO', name: 'San Francisco International Airport', city: 'San Francisco', country: 'United States', region: 'North America', latitude: 37.6213, longitude: -122.3790 },
  { code: 'LAS', name: 'McCarran International Airport', city: 'Las Vegas', country: 'United States', region: 'North America', latitude: 36.0840, longitude: -115.1537 },
  { code: 'SEA', name: 'Seattle-Tacoma International Airport', city: 'Seattle', country: 'United States', region: 'North America', latitude: 47.4502, longitude: -122.3088 },
  { code: 'BOS', name: 'Logan International Airport', city: 'Boston', country: 'United States', region: 'North America', latitude: 42.3656, longitude: -71.0096 },
  { code: 'ATL', name: 'Hartsfield-Jackson Atlanta International Airport', city: 'Atlanta', country: 'United States', region: 'North America', latitude: 33.6407, longitude: -84.4277 },
  { code: 'PHX', name: 'Phoenix Sky Harbor International Airport', city: 'Phoenix', country: 'United States', region: 'North America', latitude: 33.4342, longitude: -112.0080 },
  { code: 'DEN', name: 'Denver International Airport', city: 'Denver', country: 'United States', region: 'North America', latitude: 39.8561, longitude: -104.6737 },
  { code: 'IAH', name: 'George Bush Intercontinental Airport', city: 'Houston', country: 'United States', region: 'North America', latitude: 29.9902, longitude: -95.3368 },
  { code: 'CLT', name: 'Charlotte Douglas International Airport', city: 'Charlotte', country: 'United States', region: 'North America', latitude: 35.2144, longitude: -80.9473 },
  { code: 'MSP', name: 'Minneapolis-Saint Paul International Airport', city: 'Minneapolis', country: 'United States', region: 'North America', latitude: 44.8848, longitude: -93.2223 },
  { code: 'DTW', name: 'Detroit Metropolitan Wayne County Airport', city: 'Detroit', country: 'United States', region: 'North America', latitude: 42.2162, longitude: -83.3554 },
  { code: 'LGA', name: 'LaGuardia Airport', city: 'New York', country: 'United States', region: 'North America', latitude: 40.7769, longitude: -73.8740 },
  { code: 'EWR', name: 'Newark Liberty International Airport', city: 'Newark', country: 'United States', region: 'North America', latitude: 40.6895, longitude: -74.1745 },
  { code: 'MDW', name: 'Chicago Midway International Airport', city: 'Chicago', country: 'United States', region: 'North America', latitude: 41.7868, longitude: -87.7522 },
  { code: 'DCA', name: 'Ronald Reagan Washington National Airport', city: 'Washington', country: 'United States', region: 'North America', latitude: 38.8512, longitude: -77.0402 },
  { code: 'BWI', name: 'Baltimore/Washington International Airport', city: 'Baltimore', country: 'United States', region: 'North America', latitude: 39.1774, longitude: -76.6684 },
  { code: 'TPA', name: 'Tampa International Airport', city: 'Tampa', country: 'United States', region: 'North America', latitude: 27.9755, longitude: -82.5332 },
  { code: 'MCO', name: 'Orlando International Airport', city: 'Orlando', country: 'United States', region: 'North America', latitude: 28.4312, longitude: -81.3081 },
  { code: 'FLL', name: 'Fort Lauderdale-Hollywood International Airport', city: 'Fort Lauderdale', country: 'United States', region: 'North America', latitude: 26.0742, longitude: -80.1506 },
  { code: 'SAN', name: 'San Diego International Airport', city: 'San Diego', country: 'United States', region: 'North America', latitude: 32.7336, longitude: -117.1897 },
  { code: 'PDX', name: 'Portland International Airport', city: 'Portland', country: 'United States', region: 'North America', latitude: 45.5898, longitude: -122.5951 },
  { code: 'SLC', name: 'Salt Lake City International Airport', city: 'Salt Lake City', country: 'United States', region: 'North America', latitude: 40.7899, longitude: -111.9791 },
  { code: 'STL', name: 'Lambert-St. Louis International Airport', city: 'St. Louis', country: 'United States', region: 'North America', latitude: 38.7487, longitude: -90.3700 },
  { code: 'PHL', name: 'Philadelphia International Airport', city: 'Philadelphia', country: 'United States', region: 'North America', latitude: 39.8744, longitude: -75.2424 },
  { code: 'BNA', name: 'Nashville International Airport', city: 'Nashville', country: 'United States', region: 'North America', latitude: 36.1245, longitude: -86.6782 },

  // Private Jet Popular US Airports
  { code: 'VNY', name: 'Van Nuys Airport', city: 'Van Nuys', country: 'United States', region: 'North America', latitude: 34.2098, longitude: -118.4898 },
  { code: 'HPN', name: 'Westchester County Airport', city: 'White Plains', country: 'United States', region: 'North America', latitude: 41.0670, longitude: -73.7076 },
  { code: 'BED', name: 'Laurence G. Hanscom Field', city: 'Bedford', country: 'United States', region: 'North America', latitude: 42.4699, longitude: -71.2890 },
  { code: 'LGB', name: 'Long Beach Airport', city: 'Long Beach', country: 'United States', region: 'North America', latitude: 33.8177, longitude: -118.1516 },
  { code: 'SNA', name: 'John Wayne Airport', city: 'Orange County', country: 'United States', region: 'North America', latitude: 33.6757, longitude: -117.8677 },
  { code: 'BUR', name: 'Hollywood Burbank Airport', city: 'Burbank', country: 'United States', region: 'North America', latitude: 34.2007, longitude: -118.3585 },
  { code: 'TEB', name: 'Teterboro Airport', city: 'Teterboro', country: 'United States', region: 'North America', latitude: 40.8501, longitude: -74.0606 },
  { code: 'ASE', name: 'Aspen/Pitkin County Airport', city: 'Aspen', country: 'United States', region: 'North America', latitude: 39.2232, longitude: -106.8687 },

  // Canada
  { code: 'YYZ', name: 'Toronto Pearson International Airport', city: 'Toronto', country: 'Canada', region: 'North America', latitude: 43.6777, longitude: -79.6248 },
  { code: 'YVR', name: 'Vancouver International Airport', city: 'Vancouver', country: 'Canada', region: 'North America', latitude: 49.1967, longitude: -123.1815 },
  { code: 'YUL', name: 'Montréal-Pierre Elliott Trudeau International Airport', city: 'Montreal', country: 'Canada', region: 'North America', latitude: 45.4706, longitude: -73.7408 },
  { code: 'YYC', name: 'Calgary International Airport', city: 'Calgary', country: 'Canada', region: 'North America', latitude: 51.1315, longitude: -114.0106 },
  { code: 'YEG', name: 'Edmonton International Airport', city: 'Edmonton', country: 'Canada', region: 'North America', latitude: 53.3097, longitude: -113.5801 },
  { code: 'YOW', name: 'Ottawa Macdonald-Cartier International Airport', city: 'Ottawa', country: 'Canada', region: 'North America', latitude: 45.3192, longitude: -75.6692 },

  // Major European Airports
  { code: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'United Kingdom', region: 'Europe', latitude: 51.4700, longitude: -0.4543 },
  { code: 'LGW', name: 'Gatwick Airport', city: 'London', country: 'United Kingdom', region: 'Europe', latitude: 51.1481, longitude: -0.1903 },
  { code: 'STN', name: 'Stansted Airport', city: 'London', country: 'United Kingdom', region: 'Europe', latitude: 51.8860, longitude: 0.2389 },
  { code: 'MAN', name: 'Manchester Airport', city: 'Manchester', country: 'United Kingdom', region: 'Europe', latitude: 53.3537, longitude: -2.2750 },
  { code: 'EDI', name: 'Edinburgh Airport', city: 'Edinburgh', country: 'United Kingdom', region: 'Europe', latitude: 55.9500, longitude: -3.3725 },
  { code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France', region: 'Europe', latitude: 48.7128, longitude: 2.3500 },
  { code: 'ORY', name: 'Orly Airport', city: 'Paris', country: 'France', region: 'Europe', latitude: 48.7262, longitude: 2.3656 },
  { code: 'NCE', name: 'Nice Côte d\'Azur Airport', city: 'Nice', country: 'France', region: 'Europe', latitude: 43.6584, longitude: 7.2159 },
  { code: 'LYS', name: 'Lyon-Saint Exupéry Airport', city: 'Lyon', country: 'France', region: 'Europe', latitude: 45.7256, longitude: 5.0811 },
  { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', region: 'Europe', latitude: 50.0379, longitude: 8.5622 },
  { code: 'MUC', name: 'Munich Airport', city: 'Munich', country: 'Germany', region: 'Europe', latitude: 48.3538, longitude: 11.7861 },
  { code: 'DUS', name: 'Düsseldorf Airport', city: 'Düsseldorf', country: 'Germany', region: 'Europe', latitude: 51.2895, longitude: 6.7668 },
  { code: 'BER', name: 'Berlin Brandenburg Airport', city: 'Berlin', country: 'Germany', region: 'Europe', latitude: 52.3667, longitude: 13.5033 },
  { code: 'AMS', name: 'Amsterdam Airport Schiphol', city: 'Amsterdam', country: 'Netherlands', region: 'Europe', latitude: 52.3105, longitude: 4.7683 },
  { code: 'MAD', name: 'Madrid-Barajas Airport', city: 'Madrid', country: 'Spain', region: 'Europe', latitude: 40.4839, longitude: -3.5680 },
  { code: 'BCN', name: 'Barcelona-El Prat Airport', city: 'Barcelona', country: 'Spain', region: 'Europe', latitude: 41.2974, longitude: 2.0833 },
  { code: 'FCO', name: 'Leonardo da Vinci International Airport', city: 'Rome', country: 'Italy', region: 'Europe', latitude: 41.8003, longitude: 12.2389 },
  { code: 'MXP', name: 'Milan Malpensa Airport', city: 'Milan', country: 'Italy', region: 'Europe', latitude: 45.6306, longitude: 8.7231 },
  { code: 'ZUR', name: 'Zurich Airport', city: 'Zurich', country: 'Switzerland', region: 'Europe', latitude: 47.4647, longitude: 8.5492 },
  { code: 'GVA', name: 'Geneva Airport', city: 'Geneva', country: 'Switzerland', region: 'Europe', latitude: 46.2381, longitude: 6.1090 },
  { code: 'VIE', name: 'Vienna International Airport', city: 'Vienna', country: 'Austria', region: 'Europe', latitude: 48.1103, longitude: 16.5697 },
  { code: 'CPH', name: 'Copenhagen Airport', city: 'Copenhagen', country: 'Denmark', region: 'Europe', latitude: 55.6181, longitude: 12.6561 },
  { code: 'ARN', name: 'Stockholm Arlanda Airport', city: 'Stockholm', country: 'Sweden', region: 'Europe', latitude: 59.6519, longitude: 17.9186 },
  { code: 'OSL', name: 'Oslo Airport', city: 'Oslo', country: 'Norway', region: 'Europe', latitude: 60.1939, longitude: 11.1004 },
  { code: 'HEL', name: 'Helsinki Airport', city: 'Helsinki', country: 'Finland', region: 'Europe', latitude: 60.3172, longitude: 24.9633 },
  { code: 'BRU', name: 'Brussels Airport', city: 'Brussels', country: 'Belgium', region: 'Europe', latitude: 50.9010, longitude: 4.4856 },
  { code: 'LIS', name: 'Lisbon Airport', city: 'Lisbon', country: 'Portugal', region: 'Europe', latitude: 38.7813, longitude: -9.1363 },
  { code: 'WAW', name: 'Warsaw Chopin Airport', city: 'Warsaw', country: 'Poland', region: 'Europe', latitude: 52.1657, longitude: 20.9671 },
  { code: 'PRG', name: 'Václav Havel Airport Prague', city: 'Prague', country: 'Czech Republic', region: 'Europe', latitude: 50.1008, longitude: 14.2632 },
  { code: 'BUD', name: 'Budapest Ferenc Liszt International Airport', city: 'Budapest', country: 'Hungary', region: 'Europe', latitude: 47.4394, longitude: 19.2556 },

  // Turkey
  { code: 'IST', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey', region: 'Europe', latitude: 41.2753, longitude: 28.7519 },
  { code: 'SAW', name: 'Sabiha Gökçen International Airport', city: 'Istanbul', country: 'Turkey', region: 'Europe', latitude: 40.8986, longitude: 29.3092 },
  { code: 'ESB', name: 'Esenboğa Airport', city: 'Ankara', country: 'Turkey', region: 'Europe', latitude: 40.1281, longitude: 32.9951 },
  { code: 'ADB', name: 'Adnan Menderes Airport', city: 'Izmir', country: 'Turkey', region: 'Europe', latitude: 38.2924, longitude: 27.1569 },
  { code: 'AYT', name: 'Antalya Airport', city: 'Antalya', country: 'Turkey', region: 'Europe', latitude: 36.8987, longitude: 30.8005 },
  { code: 'BJV', name: 'Bodrum-Milas Airport', city: 'Bodrum', country: 'Turkey', region: 'Europe', latitude: 37.2506, longitude: 27.6643 },
  { code: 'DLM', name: 'Dalaman Airport', city: 'Dalaman', country: 'Turkey', region: 'Europe', latitude: 36.7131, longitude: 28.7925 },

  // Middle East
  { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'United Arab Emirates', region: 'Middle East', latitude: 25.2532, longitude: 55.3657 },
  { code: 'AUH', name: 'Abu Dhabi International Airport', city: 'Abu Dhabi', country: 'United Arab Emirates', region: 'Middle East', latitude: 24.4330, longitude: 54.6511 },
  { code: 'DOH', name: 'Hamad International Airport', city: 'Doha', country: 'Qatar', region: 'Middle East', latitude: 25.2731, longitude: 51.6080 },
  { code: 'KWI', name: 'Kuwait International Airport', city: 'Kuwait City', country: 'Kuwait', region: 'Middle East', latitude: 29.2267, longitude: 47.9689 },
  { code: 'BAH', name: 'Bahrain International Airport', city: 'Manama', country: 'Bahrain', region: 'Middle East', latitude: 26.2708, longitude: 50.6336 },
  { code: 'RUH', name: 'King Khalid International Airport', city: 'Riyadh', country: 'Saudi Arabia', region: 'Middle East', latitude: 24.9576, longitude: 46.6988 },
  { code: 'JED', name: 'King Abdulaziz International Airport', city: 'Jeddah', country: 'Saudi Arabia', region: 'Middle East', latitude: 21.6796, longitude: 39.1565 },
  { code: 'CAI', name: 'Cairo International Airport', city: 'Cairo', country: 'Egypt', region: 'Middle East', latitude: 30.1219, longitude: 31.4056 },
  { code: 'TLV', name: 'Ben Gurion Airport', city: 'Tel Aviv', country: 'Israel', region: 'Middle East', latitude: 32.0004, longitude: 34.8706 },
  { code: 'AMM', name: 'Queen Alia International Airport', city: 'Amman', country: 'Jordan', region: 'Middle East', latitude: 31.7226, longitude: 35.9932 },

  // Asia
  { code: 'NRT', name: 'Narita International Airport', city: 'Tokyo', country: 'Japan', region: 'Asia', latitude: 35.7720, longitude: 140.3929 },
  { code: 'HND', name: 'Haneda Airport', city: 'Tokyo', country: 'Japan', region: 'Asia', latitude: 35.5494, longitude: 139.7798 },
  { code: 'KIX', name: 'Kansai International Airport', city: 'Osaka', country: 'Japan', region: 'Asia', latitude: 34.4347, longitude: 135.2441 },
  { code: 'ICN', name: 'Incheon International Airport', city: 'Seoul', country: 'South Korea', region: 'Asia', latitude: 37.4602, longitude: 126.4407 },
  { code: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore', region: 'Asia', latitude: 1.3644, longitude: 103.9915 },
  { code: 'HKG', name: 'Hong Kong International Airport', city: 'Hong Kong', country: 'Hong Kong', region: 'Asia', latitude: 22.3080, longitude: 113.9185 },
  { code: 'PEK', name: 'Beijing Capital International Airport', city: 'Beijing', country: 'China', region: 'Asia', latitude: 40.0799, longitude: 116.6031 },
  { code: 'PVG', name: 'Shanghai Pudong International Airport', city: 'Shanghai', country: 'China', region: 'Asia', latitude: 31.1443, longitude: 121.8083 },
  { code: 'CAN', name: 'Guangzhou Baiyun International Airport', city: 'Guangzhou', country: 'China', region: 'Asia', latitude: 23.3924, longitude: 113.2988 },
  { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai', country: 'India', region: 'Asia', latitude: 19.0896, longitude: 72.8656 },
  { code: 'DEL', name: 'Indira Gandhi International Airport', city: 'New Delhi', country: 'India', region: 'Asia', latitude: 28.5562, longitude: 77.1000 },
  { code: 'BLR', name: 'Kempegowda International Airport', city: 'Bangalore', country: 'India', region: 'Asia', latitude: 13.1986, longitude: 77.7066 },
  { code: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand', region: 'Asia', latitude: 13.6900, longitude: 100.7501 },
  { code: 'KUL', name: 'Kuala Lumpur International Airport', city: 'Kuala Lumpur', country: 'Malaysia', region: 'Asia', latitude: 2.7456, longitude: 101.7072 },
  { code: 'CGK', name: 'Soekarno-Hatta International Airport', city: 'Jakarta', country: 'Indonesia', region: 'Asia', latitude: -6.1256, longitude: 106.6559 },
  { code: 'MNL', name: 'Ninoy Aquino International Airport', city: 'Manila', country: 'Philippines', region: 'Asia', latitude: 14.5086, longitude: 121.0194 },

  // Africa
  { code: 'JNB', name: 'O.R. Tambo International Airport', city: 'Johannesburg', country: 'South Africa', region: 'Africa', latitude: -26.1367, longitude: 28.2411 },
  { code: 'CPT', name: 'Cape Town International Airport', city: 'Cape Town', country: 'South Africa', region: 'Africa', latitude: -33.9715, longitude: 18.6021 },
  { code: 'LOS', name: 'Murtala Muhammed International Airport', city: 'Lagos', country: 'Nigeria', region: 'Africa', latitude: 6.5774, longitude: 3.3212 },
  { code: 'ABV', name: 'Nnamdi Azikiwe International Airport', city: 'Abuja', country: 'Nigeria', region: 'Africa', latitude: 9.0067, longitude: 7.2632 },
  { code: 'ADD', name: 'Addis Ababa Bole International Airport', city: 'Addis Ababa', country: 'Ethiopia', region: 'Africa', latitude: 8.9806, longitude: 38.7997 },
  { code: 'NBO', name: 'Jomo Kenyatta International Airport', city: 'Nairobi', country: 'Kenya', region: 'Africa', latitude: -1.3192, longitude: 36.9278 },
  { code: 'CMN', name: 'Mohammed V International Airport', city: 'Casablanca', country: 'Morocco', region: 'Africa', latitude: 33.3675, longitude: -7.5898 },
  { code: 'TUN', name: 'Tunis-Carthage International Airport', city: 'Tunis', country: 'Tunisia', region: 'Africa', latitude: 36.8510, longitude: 10.2272 },
  { code: 'ALG', name: 'Houari Boumediene Airport', city: 'Algiers', country: 'Algeria', region: 'Africa', latitude: 36.6910, longitude: 3.2154 },

  // South America
  { code: 'GRU', name: 'São Paulo/Guarulhos International Airport', city: 'São Paulo', country: 'Brazil', region: 'South America', latitude: -23.4356, longitude: -46.4731 },
  { code: 'GIG', name: 'Rio de Janeiro/Galeão International Airport', city: 'Rio de Janeiro', country: 'Brazil', region: 'South America', latitude: -22.8099, longitude: -43.2505 },
  { code: 'BSB', name: 'Brasília International Airport', city: 'Brasília', country: 'Brazil', region: 'South America', latitude: -15.8711, longitude: -47.9172 },
  { code: 'EZE', name: 'Ezeiza International Airport', city: 'Buenos Aires', country: 'Argentina', region: 'South America', latitude: -34.8222, longitude: -58.5358 },
  { code: 'SCL', name: 'Santiago International Airport', city: 'Santiago', country: 'Chile', region: 'South America', latitude: -33.3930, longitude: -70.7858 },
  { code: 'LIM', name: 'Jorge Chávez International Airport', city: 'Lima', country: 'Peru', region: 'South America', latitude: -12.0219, longitude: -77.1143 },
  { code: 'BOG', name: 'El Dorado International Airport', city: 'Bogotá', country: 'Colombia', region: 'South America', latitude: 4.7016, longitude: -74.1469 },

  // Oceania
  { code: 'SYD', name: 'Sydney Kingsford Smith Airport', city: 'Sydney', country: 'Australia', region: 'Oceania', latitude: -33.9399, longitude: 151.1753 },
  { code: 'MEL', name: 'Melbourne Airport', city: 'Melbourne', country: 'Australia', region: 'Oceania', latitude: -37.6690, longitude: 144.8410 },
  { code: 'BNE', name: 'Brisbane Airport', city: 'Brisbane', country: 'Australia', region: 'Oceania', latitude: -27.3942, longitude: 153.1218 },
  { code: 'PER', name: 'Perth Airport', city: 'Perth', country: 'Australia', region: 'Oceania', latitude: -31.9403, longitude: 115.9669 },
  { code: 'AKL', name: 'Auckland Airport', city: 'Auckland', country: 'New Zealand', region: 'Oceania', latitude: -37.0082, longitude: 174.7850 },
  { code: 'CHC', name: 'Christchurch Airport', city: 'Christchurch', country: 'New Zealand', region: 'Oceania', latitude: -43.4894, longitude: 172.5320 },
];

// Function to calculate distance between two coordinates using Haversine formula
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Function to get nearest airports based on user's location
export const getNearestAirports = (userLat: number, userLon: number, count: number = 4): Airport[] => {
  return airports
    .map(airport => ({
      ...airport,
      distance: calculateDistance(userLat, userLon, airport.latitude, airport.longitude)
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, count)
    .map(({ distance, ...airport }) => airport);
};