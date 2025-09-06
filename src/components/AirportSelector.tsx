import React, { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown, Navigation } from 'lucide-react';

interface AirportSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  name: string;
  required?: boolean;
  className?: string;
  excludeAirport?: string;
}

const AirportSelector: React.FC<AirportSelectorProps> = ({
  value,
  onChange,
  placeholder,
  name,
  required = false,
  className = '',
  excludeAirport = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mock airports data - you'll replace this with real data
  const airports = [
    { code: 'JFK', name: 'John F. Kennedy International', city: 'New York', country: 'United States' },
    { code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', country: 'United States' },
    { code: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'United Kingdom' },
    { code: 'DXB', name: 'Dubai International', city: 'Dubai', country: 'United Arab Emirates' },
    { code: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'France' },
    { code: 'NRT', name: 'Narita International', city: 'Tokyo', country: 'Japan' },
    { code: 'SIN', name: 'Singapore Changi', city: 'Singapore', country: 'Singapore' },
    { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany' }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredAirports = airports.filter(airport => (
    airport.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    airport.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    airport.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    airport.country.toLowerCase().includes(searchTerm.toLowerCase())
  ) && (!excludeAirport || airport.city.toLowerCase() !== excludeAirport.toLowerCase()));

  const handleAirportSelect = (airport: any) => {
    setSearchTerm(`${airport.code} / ${airport.name} / ${airport.country}`);
    onChange(airport.city);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    onChange(newValue);
    setIsOpen(true);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          name={name}
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          required={required}
          className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-sm placeholder-gray-500"
          autoComplete="off"
        />
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {filteredAirports.length > 0 ? (
            filteredAirports.map((airport) => (
              <button
                key={airport.code}
                type="button"
                onClick={() => handleAirportSelect(airport)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {airport.code} / {airport.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {airport.city}, {airport.country}
                    </p>
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="px-4 py-6 text-center">
              <p className="text-gray-500 text-sm mb-2">Airport not found</p>
              <p className="text-xs text-gray-400">
                You can type the airport name manually
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AirportSelector;
