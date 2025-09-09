import React, { useState, useRef, useEffect } from 'react';
import { Clock, ChevronDown, Calendar } from 'lucide-react';

interface DateTimePickerProps {
  value: string; // Format: "YYYY-MM-DDTHH:MM"
  onChange: (datetime: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  minDateTime?: string; // Format: "YYYY-MM-DDTHH:MM"
  timezoneInfo?: string;
  fromLocation?: string;
  toLocation?: string;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  onChange,
  placeholder = "Select date & time",
  required = false,
  className = '',
  minDateTime,
  timezoneInfo,
  fromLocation,
  toLocation
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedHour, setSelectedHour] = useState('');
  const [selectedMinute, setSelectedMinute] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check if From and To are selected
  const isFromToSelected = fromLocation && toLocation && fromLocation.trim() !== '' && toLocation.trim() !== '';
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

  // Update internal state when value changes
  useEffect(() => {
    if (value) {
      const [date, time] = value.split('T');
      setSelectedDate(date || '');
      if (time) {
        const [hour, minute] = time.split(':');
        setSelectedHour(hour || '');
        setSelectedMinute(minute || '');
      }
    } else {
      setSelectedDate('');
      setSelectedHour('');
      setSelectedMinute('');
    }
  }, [value]);

  const handleDateTimeSelect = () => {
    if (selectedDate && selectedHour && selectedMinute) {
      const dateTimeString = `${selectedDate}T${selectedHour}:${selectedMinute}`;
      
      console.log('🕐 İSTANBUL DateTime Selection Debug:', {
        selectedDate,
        selectedHour,
        selectedMinute,
        dateTimeString,
        minDateTime,
        timezoneInfo,
        isValidTime: !minDateTime || dateTimeString >= minDateTime
      });
      
      // Minimum time kontrolü
      if (minDateTime && dateTimeString < minDateTime) {
        alert(`Minimum booking time: ${new Date(minDateTime).toLocaleString()} (İstanbul Time)`);
        return;
      }
      
      onChange(dateTimeString);
      setIsOpen(false);
    }
  };

  const formatDisplayDateTime = () => {
    if (selectedDate && selectedHour && selectedMinute) {
      // Parse date correctly
      const dateObj = new Date(selectedDate + 'T00:00:00');
      const day = dateObj.getDate().toString().padStart(2, '0');
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
      const year = dateObj.getFullYear();
      
      return `${day}/${month}/${year} at ${selectedHour}:${selectedMinute}`;
    }
    return '';
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDate = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  // Get today's date in YYYY-MM-DD format
  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayString = getTodayString();

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <button
          type="button"
          onClick={() => {
            if (!isFromToSelected) {
              alert('Please select departure and destination airports first');
              return;
            }
            setIsOpen(!isOpen);
          }}
          className="w-full pl-10 pr-10 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-left text-sm"
        >
          <span className={formatDisplayDateTime() ? 'text-gray-900 text-sm' : 'text-gray-500 text-sm'}>
            {!isFromToSelected 
              ? placeholder 
              : formatDisplayDateTime() || placeholder
            }
          </span>
        </button>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
      </div>


      {/* DateTime Picker Dropdown */}
      {isOpen && isFromToSelected && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-96">
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Left Side - Calendar */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Date</h4>
                
                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-3">
                  <button
                    type="button"
                    onClick={() => {
                      const newMonth = new Date(currentMonth);
                      newMonth.setMonth(newMonth.getMonth() - 1);
                      setCurrentMonth(newMonth);
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    ←
                  </button>
                  <span className="text-sm font-medium">
                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const newMonth = new Date(currentMonth);
                      newMonth.setMonth(newMonth.getMonth() + 1);
                      setCurrentMonth(newMonth);
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    →
                  </button>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                    <div key={day} className="p-2 text-center text-xs font-medium text-gray-500">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => {
                    const year = day.getFullYear();
                    const month = (day.getMonth() + 1).toString().padStart(2, '0');
                    const dayNum = day.getDate().toString().padStart(2, '0');
                    const dayStr = `${year}-${month}-${dayNum}`;
                    
                    const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
                    const isSelected = selectedDate === dayStr;
                    const isToday = dayStr === todayString;
                    
                    // BASIT MANTIK: Sadece bugünden önceki günler disabled
                    const isDisabled = dayStr < todayString;
                    
                    console.log('📅 Calendar day:', {
                      dayNum: day.getDate(),
                      dayStr,
                      todayString,
                      isDisabled,
                      isSelected,
                      isToday
                    });
                    
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          if (!isDisabled) {
                            console.log('🗓️ Clicking date:', dayStr, 'Day number:', day.getDate());
                            setSelectedDate(dayStr);
                          }
                        }}
                        disabled={isDisabled}
                        className={`p-2 text-center rounded text-xs transition-colors ${
                          isSelected 
                            ? 'bg-blue-600 text-white' 
                            : isToday 
                            ? 'bg-gray-100 text-gray-900 font-medium border border-blue-300'
                            : isCurrentMonth 
                            ? 'hover:bg-gray-100 text-gray-900' 
                            : 'text-gray-400'
                        } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {day.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Side - Time */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Time</h4>
                
                {/* Hour and Minute Selection - Side by Side */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Hour Selection */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-2">Hour</label>
                    <div className="h-32 overflow-y-auto border border-gray-200 rounded bg-gray-50">
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, '0');
                        
                        // Check if this hour is valid based on minimum datetime
                        let isHourDisabled = false;
                        if (selectedDate && minDateTime) {
                          const selectedDateTime = `${selectedDate}T${hour}:00`;
                          isHourDisabled = selectedDateTime < minDateTime;
                        }
                        return (
                          <button
                            key={hour}
                            type="button"
                            onClick={() => {
                              if (!isHourDisabled) {
                                setSelectedHour(hour);
                              }
                            }}
                            disabled={isHourDisabled}
                            className={`w-full px-2 py-1 text-center transition-colors text-sm ${
                              isHourDisabled 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50' 
                                : selectedHour === hour 
                                ? 'bg-blue-100 text-blue-600 font-medium' 
                                : 'text-gray-700 hover:bg-blue-50'
                            }`}
                          >
                            {hour}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Minute Selection */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-2">Minute</label>
                    <div className="h-32 overflow-y-auto border border-gray-200 rounded bg-gray-50">
                      {['00', '15', '30', '45'].map((minute) => {
                        // Check if this minute is valid based on minimum datetime
                        let isMinuteDisabled = false;
                        if (selectedDate && selectedHour && minDateTime) {
                          const selectedDateTime = `${selectedDate}T${selectedHour}:${minute}`;
                          isMinuteDisabled = selectedDateTime < minDateTime;
                        }
                        
                        return (
                          <button
                            key={minute}
                            type="button"
                            onClick={() => {
                              if (!isMinuteDisabled) {
                                setSelectedMinute(minute);
                              }
                            }}
                            disabled={isMinuteDisabled}
                            className={`w-full px-2 py-1 text-center transition-colors text-sm ${
                              isMinuteDisabled
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                                : selectedMinute === minute 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}
                          >
                            :{minute}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Selected DateTime Display & Confirm - Always Visible */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-center mb-3">
                <p className="text-sm text-gray-600">Selected:</p>
                <p className="font-medium text-gray-900">
                  {selectedDate && selectedHour && selectedMinute ? 
                    formatDisplayDateTime() : 
                    'No date selected'
                  }
                </p>
              </div>
              
              <button
                type="button"
                onClick={handleDateTimeSelect}
                disabled={!selectedDate || !selectedHour || !selectedMinute}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedDate && selectedHour && selectedMinute
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Confirm Selection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateTimePicker;
