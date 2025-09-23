import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  goToPreviousMonth, 
  goToNextMonth, 
  goToToday, 
  selectDate, 
  setView,
  openEventModal 
} from '../store/calendarSlice';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  isSameDay, 
  isToday,
  isSameMonth,
  addWeeks,
  subWeeks,
  startOfWeek as startWeek,
  endOfWeek as endWeek,
  addDays as addDaysToWeek,
  startOfDay,
  addHours
} from 'date-fns';
import DroppableTimeSlot from './DroppableTimeSlot';

const Calendar = () => {
  const dispatch = useDispatch();
  const { currentDate, selectedDate, events, view } = useSelector(state => state.calendar);

  const handleDateClick = (date) => {
    dispatch(selectDate(date));
    dispatch(openEventModal());
  };

  const handleEventClick = (event, e) => {
    e.stopPropagation();
    dispatch(openEventModal(event));
  };

  const getEventsForDate = (date) => {
    return events.filter(event => 
      isSameDay(new Date(event.startTime), date)
    );
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const dayEvents = getEventsForDate(day);
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isSelected = isSameDay(day, selectedDate);
        const isTodayDate = isToday(day);

        days.push(
          <DroppableTimeSlot
            key={day}
            date={day}
            events={dayEvents}
            onEventClick={handleEventClick}
            onDateClick={handleDateClick}
            view="month"
          >
            <div className={`
              text-sm font-medium mb-1
              ${isTodayDate ? 'text-blue-600 font-bold' : ''}
              ${!isCurrentMonth ? 'text-gray-400' : ''}
            `}>
              {format(day, dateFormat)}
            </div>
          </DroppableTimeSlot>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }

    return (
      <div className="bg-white">
        <div className="grid grid-cols-7 border-b border-gray-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-3 text-center font-medium text-gray-700 bg-gray-50">
              {day}
            </div>
          ))}
        </div>
        <div className="divide-y divide-gray-200">
          {rows}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate);
    const weekEnd = endOfWeek(weekStart);
    const days = [];
    let day = weekStart;

    // Time slots (8 AM to 8 PM)
    const timeSlots = [];
    for (let hour = 8; hour <= 20; hour++) {
      timeSlots.push(hour);
    }

    while (day <= weekEnd) {
      const dayEvents = getEventsForDate(day);
      const isSelected = isSameDay(day, selectedDate);
      const isTodayDate = isToday(day);

      days.push(
        <div
          key={day}
          className={`
            flex-1 border-r border-gray-200 min-h-[600px]
            ${isSelected ? 'bg-blue-50' : ''}
            ${isTodayDate ? 'bg-blue-25' : ''}
          `}
        >
          <div className={`
            p-2 text-center font-medium border-b border-gray-200
            ${isTodayDate ? 'bg-blue-100 text-blue-800' : 'bg-gray-50'}
          `}>
            <div className="text-sm">{format(day, 'EEE')}</div>
            <div className="text-lg">{format(day, 'd')}</div>
          </div>
          
          <div className="relative">
            {timeSlots.map(hour => {
              const hourEvents = dayEvents.filter(event => {
                const eventStart = new Date(event.startTime);
                const eventEnd = new Date(event.endTime);
                const slotStart = addHours(startOfDay(day), hour);
                const slotEnd = addHours(startOfDay(day), hour + 1);
                return eventStart < slotEnd && eventEnd > slotStart;
              });

              return (
                <DroppableTimeSlot
                  key={hour}
                  time={hour}
                  date={day}
                  events={hourEvents}
                  onEventClick={handleEventClick}
                  onDateClick={() => handleDateClick(addHours(startOfDay(day), hour))}
                  view="week"
                />
              );
            })}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }

    return (
      <div className="flex bg-white border border-gray-200">
        <div className="w-16 border-r border-gray-200">
          <div className="h-12 border-b border-gray-200"></div>
          {timeSlots.map(hour => (
            <div key={hour} className="h-12 border-b border-gray-100 text-xs text-gray-400 pl-2 pt-1">
              {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
            </div>
          ))}
        </div>
        {days}
      </div>
    );
  };

  const renderDayView = () => {
    const dayEvents = getEventsForDate(selectedDate);
    const isTodayDate = isToday(selectedDate);

    // Time slots (8 AM to 8 PM)
    const timeSlots = [];
    for (let hour = 8; hour <= 20; hour++) {
      timeSlots.push(hour);
    }

    return (
      <div className="flex bg-white border border-gray-200">
        <div className="w-16 border-r border-gray-200">
          <div className="h-12 border-b border-gray-200"></div>
          {timeSlots.map(hour => (
            <div key={hour} className="h-12 border-b border-gray-100 text-xs text-gray-400 pl-2 pt-1">
              {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
            </div>
          ))}
        </div>
        
        <div className="flex-1">
          <div className={`
            h-12 border-b border-gray-200 text-center font-medium flex items-center justify-center
            ${isTodayDate ? 'bg-blue-100 text-blue-800' : 'bg-gray-50'}
          `}>
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </div>
          
          <div className="relative">
            {timeSlots.map(hour => {
              const hourEvents = dayEvents.filter(event => {
                const eventStart = new Date(event.startTime);
                const eventEnd = new Date(event.endTime);
                const slotStart = addHours(startOfDay(selectedDate), hour);
                const slotEnd = addHours(startOfDay(selectedDate), hour + 1);
                return eventStart < slotEnd && eventEnd > slotStart;
              });

              return (
                <DroppableTimeSlot
                  key={hour}
                  time={hour}
                  date={selectedDate}
                  events={hourEvents}
                  onEventClick={handleEventClick}
                  onDateClick={() => handleDateClick(addHours(startOfDay(selectedDate), hour))}
                  view="day"
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderCurrentView = () => {
    switch (view) {
      case 'week':
        return renderWeekView();
      case 'day':
        return renderDayView();
      default:
        return renderMonthView();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {format(currentDate, 'MMMM yyyy')}
          </h1>
          <div className="flex space-x-2">
            <button
              onClick={() => dispatch(goToPreviousMonth())}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              ←
            </button>
            <button
              onClick={() => dispatch(goToToday())}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Today
            </button>
            <button
              onClick={() => dispatch(goToNextMonth())}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              →
            </button>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => dispatch(setView('month'))}
            className={`px-4 py-2 rounded-lg ${view === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Month
          </button>
          <button
            onClick={() => dispatch(setView('week'))}
            className={`px-4 py-2 rounded-lg ${view === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Week
          </button>
          <button
            onClick={() => dispatch(setView('day'))}
            className={`px-4 py-2 rounded-lg ${view === 'day' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Day
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {renderCurrentView()}
      </div>
    </div>
  );
};

export default Calendar;
