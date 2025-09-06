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
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  onChange,
  placeholder = "Select date & time",
  required = false,
  className = '',
  minDateTime,
  timezoneInfo
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value.split('T')[0] || '');
  const [selectedHour, setSelectedHour] = useState(value.split('T')[1]?.split(':')[0] || '');
  const [selectedMinute, setSelectedMinute] = useState(value.split('T')[1]?.split(':')[1] || '');
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (value.split('T')[0]) {
      const [year, month] = value.split('T')[0].split('-');
      return new Date(parseInt(year), parseInt(month) - 1, 1);
    }
    return new Date();
  });
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
    }
  }, [value]);

  const handleDateTimeSelect = () => {
    if (selectedDate && selectedHour && selectedMinute) {
      const dateTimeString = `${selectedDate}T${selectedHour}:${selectedMinute}`;
      onChange(dateTimeString);
      setIsOpen(false);
    }
  };

  const formatDisplayDateTime = () => {
    if (selectedDate && selectedHour && selectedMinute) {
      // Use proper date formatting to match selection
      const date = new Date(selectedDate + 'T12:00:00');
      const formattedDate = date.toLocaleDateString('en-US');
      return formattedDate + ' at ' + `${selectedHour}:${selectedMinute}`;
    }
    return '';
  };

  const isTimeDisabled = (hour: string, minute: string) => {
    if (!minDateTime || !selectedDate) return false;
    
    const [minDate, minTime] = minDateTime.split('T');
    if (selectedDate > minDate) return false;
    if (selectedDate < minDate) return true;
    
    // Same date, check time
    const [minHour, minMinute] = minTime.split(':');
    const selectedTime = parseInt(hour) * 60 + parseInt(minute);
    const minimumTime = parseInt(minHour) * 60 + parseInt(minMinute);
    
    return selectedTime < minimumTime;
  };

  const getMinDate = () => {
    return minDateTime ? minDateTime.split('T')[0] : '';
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

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full pl-10 pr-10 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-left text-sm"
        >
          <span className={formatDisplayDateTime() ? 'text-gray-900 text-sm' : 'text-gray-500 text-sm'}>
            {formatDisplayDateTime() || placeholder}
          </span>
        </button>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
      </div>

      {/* Timezone Info */}
      {timezoneInfo && (
        <p className="text-xs text-blue-600 mt-2">
          📍 {timezoneInfo}
        </p>
      )}

      {/* DateTime Picker Dropdown */}
      {isOpen && (
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
                    const dayStr = day.toISOString().split('T')[0];
                    const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
                    const isSelected = dayStr === selectedDate;
                    const today = new Date();
                    const todayStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
                    const isToday = dayStr === todayStr;
                    const minDate = getMinDate();
                    const isDisabled = minDate && dayStr < minDate;
                    
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          if (!isDisabled) {
                            setSelectedDate(dayStr);
                            console.log('Selected date:', dayStr);
                          }
                        }}
                        disabled={isDisabled}
                        className={`p-2 text-center rounded text-xs transition-colors ${
                          isSelected 
                            ? 'bg-blue-600 text-white' 
                            : isToday 
                            ? 'bg-blue-100 text-blue-600 font-medium'
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
                
                {/* Hour Selection */}
                <div className="mb-4">
                  <label className="block text-xs text-gray-600 mb-2">Hour</label>
                  <div className="h-32 overflow-y-auto border border-gray-200 rounded bg-gray-50">
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = i.toString().padStart(2, '0');
                      const isDisabled = isTimeDisabled(hour, selectedMinute || '00');
                      
                      return (
                        <button
                          key={hour}
                          type="button"
                          onClick={() => !isDisabled && setSelectedHour(hour)}
                          disabled={isDisabled}
                          className={`w-full px-3 py-1 text-left hover:bg-blue-50 transition-colors text-sm ${
                            selectedHour === hour ? 'bg-blue-100 text-blue-600 font-medium' : 'text-gray-700'
                          } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {hour}:00
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Minute Selection */}
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Minute</label>
                  <div className="grid grid-cols-2 gap-1">
                    {['00', '15', '30', '45'].map((minute) => {
                      const isDisabled = selectedHour ? isTimeDisabled(selectedHour, minute) : false;
                      
                      return (
                        <button
                          key={minute}
                          type="button"
                          onClick={() => !isDisabled && setSelectedMinute(minute)}
                          disabled={isDisabled}
                          className={`px-2 py-1 text-center rounded text-sm transition-colors ${
                            selectedMinute === minute 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          :{minute}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Selected DateTime Display & Confirm */}
            {selectedDate && selectedHour && selectedMinute && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-center mb-3">
                  <p className="text-sm text-gray-600">Selected:</p>
                  <p className="font-medium text-gray-900">
                    {selectedDate && selectedHour && selectedMinute ? 
                      `${selectedDate.split('-')[1]}/${selectedDate.split('-')[2]}/${selectedDate.split('-')[0]} at ${selectedHour}:${selectedMinute}` : 
                      'No date selected'
                    }
                  </p>
                </div>
                
                <button
                  type="button"
                  onClick={handleDateTimeSelect}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Confirm Selection
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DateTimePicker;