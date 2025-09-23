import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { openEventModal, selectDate } from '../store/calendarSlice';
import { format, isSameDay, isToday, addDays } from 'date-fns';

const MobileAgendaView = () => {
  const dispatch = useDispatch();
  const { events, selectedDate } = useSelector(state => state.calendar);

  // Get events for the next 7 days
  const upcomingEvents = events
    .filter(event => {
      const eventDate = new Date(event.startTime);
      const today = new Date();
      const weekFromNow = addDays(today, 7);
      return eventDate >= today && eventDate <= weekFromNow;
    })
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

  const groupEventsByDate = (events) => {
    const grouped = {};
    events.forEach(event => {
      const dateKey = format(new Date(event.startTime), 'yyyy-MM-dd');
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });
    return grouped;
  };

  const groupedEvents = groupEventsByDate(upcomingEvents);

  const getCategoryColor = (category) => {
    const colors = {
      general: 'bg-blue-100 text-blue-800 border-blue-200',
      work: 'bg-green-100 text-green-800 border-green-200',
      personal: 'bg-purple-100 text-purple-800 border-purple-200',
      meeting: 'bg-orange-100 text-orange-800 border-orange-200',
      important: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[category] || colors.general;
  };

  const handleEventClick = (event) => {
    dispatch(selectDate(new Date(event.startTime)));
    dispatch(openEventModal(event));
  };

  const handleDateClick = (date) => {
    dispatch(selectDate(date));
  };

  return (
    <div className="lg:hidden">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
          <p className="text-sm text-gray-500">Next 7 days</p>
        </div>

        {/* Agenda List */}
        <div className="divide-y divide-gray-200">
          {Object.keys(groupedEvents).length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p>No upcoming events</p>
              <p className="text-sm">Tap on a date to create an event</p>
            </div>
          ) : (
            Object.entries(groupedEvents)
              .sort(([a], [b]) => new Date(a) - new Date(b))
              .map(([dateKey, dayEvents]) => {
                const date = new Date(dateKey);
                const isTodayDate = isToday(date);
                const isSelected = isSameDay(date, selectedDate);

                return (
                  <div key={dateKey} className="p-4">
                    {/* Date Header */}
                    <div 
                      className={`flex items-center mb-3 cursor-pointer ${
                        isSelected ? 'bg-blue-50 rounded-lg p-2' : ''
                      }`}
                      onClick={() => handleDateClick(date)}
                    >
                      <div className={`text-2xl font-bold mr-3 ${
                        isTodayDate ? 'text-blue-600' : 'text-gray-900'
                      }`}>
                        {format(date, 'd')}
                      </div>
                      <div>
                        <div className={`font-medium ${
                          isTodayDate ? 'text-blue-600' : 'text-gray-900'
                        }`}>
                          {format(date, 'EEEE')}
                        </div>
                        <div className="text-sm text-gray-500">
                          {format(date, 'MMMM yyyy')}
                          {isTodayDate && <span className="ml-2 text-blue-600">• Today</span>}
                        </div>
                      </div>
                      <div className="ml-auto">
                        <div className={`w-2 h-2 rounded-full ${
                          dayEvents.length > 0 ? 'bg-blue-500' : 'bg-gray-300'
                        }`} />
                      </div>
                    </div>

                    {/* Events for this date */}
                    <div className="space-y-2">
                      {dayEvents.map(event => (
                        <div
                          key={event.id}
                          className={`p-3 rounded-lg border cursor-pointer hover:shadow-sm transition-shadow ${getCategoryColor(event.category)}`}
                          onClick={() => handleEventClick(event)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-medium text-sm">{event.title}</h3>
                              <p className="text-xs opacity-75 mt-1">
                                {format(new Date(event.startTime), 'h:mm a')} - {format(new Date(event.endTime), 'h:mm a')}
                              </p>
                              {event.location && (
                                <p className="text-xs opacity-75 mt-1 flex items-center">
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  {event.location}
                                </p>
                              )}
                            </div>
                            {event.parentId && (
                              <div className="ml-2">
                                <div className="w-1 h-1 bg-current rounded-full opacity-50" />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
          )}
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => dispatch(openEventModal())}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create New Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileAgendaView;
