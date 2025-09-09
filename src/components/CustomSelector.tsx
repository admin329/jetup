import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface CustomSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: string[];
  icon: React.ReactNode;
  required?: boolean;
  className?: string;
}

const CustomSelector: React.FC<CustomSelectorProps> = ({
  value,
  onChange,
  placeholder,
  options,
  icon,
  required = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleOptionSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {icon}
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full pl-10 pr-10 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-left text-sm"
        >
          <span className={value ? 'text-gray-900' : 'text-gray-500'}>
            {value || placeholder}
          </span>
        </button>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleOptionSelect(option)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
            >
              <p className="font-medium text-gray-900 text-sm">{option}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelector;
