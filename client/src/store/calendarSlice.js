import { createSlice } from '@reduxjs/toolkit';
import { addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, format, isSameDay, isToday, addDays as addDaysToDate, addWeeks, addYears } from 'date-fns';

// Load events from localStorage
const loadEventsFromStorage = () => {
  try {
    const events = localStorage.getItem('calendarEvents');
    return events ? JSON.parse(events) : [];
  } catch (error) {
    console.error('Error loading events from localStorage:', error);
    return [];
  }
};

// Save events to localStorage
const saveEventsToStorage = (events) => {
  try {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  } catch (error) {
    console.error('Error saving events to localStorage:', error);
  }
};

// Generate recurring events
const generateRecurringEvents = (eventData, recurrence) => {
  const { frequency, interval, endDate, count } = recurrence;
  const events = [];
  const parentId = Date.now().toString();
  const startDate = new Date(eventData.startTime);
  const endTime = new Date(eventData.endTime);
  
  let currentDate = new Date(startDate);
  let eventCount = 0;
  const maxEvents = count || 52; // Default to 52 occurrences (1 year for weekly)
  
  while (currentDate <= new Date(endDate) && eventCount < maxEvents) {
    const duration = endTime - startDate;
    const eventStartTime = new Date(currentDate);
    const eventEndTime = new Date(currentDate.getTime() + duration);
    
    events.push({
      id: `${parentId}_${eventCount}`,
      parentId,
      ...eventData,
      startTime: eventStartTime.toISOString(),
      endTime: eventEndTime.toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
    // Calculate next occurrence
    switch (frequency) {
      case 'daily':
        currentDate = addDaysToDate(currentDate, interval || 1);
        break;
      case 'weekly':
        currentDate = addWeeks(currentDate, interval || 1);
        break;
      case 'monthly':
        currentDate = addMonths(currentDate, interval || 1);
        break;
      case 'yearly':
        currentDate = addYears(currentDate, interval || 1);
        break;
      default:
        currentDate = addDaysToDate(currentDate, 1);
    }
    
    eventCount++;
  }
  
  return events;
};

const initialState = {
  currentDate: new Date(),
  selectedDate: new Date(),
  events: loadEventsFromStorage(),
  view: 'month', // 'month', 'week', 'day'
  selectedEvent: null,
  isEventModalOpen: false,
  isEventModalEditing: false,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Auto-detect user timezone
  filters: {
    searchTerm: '',
    category: 'all',
    showRecurring: true
  }
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    // Navigation
    goToPreviousMonth: (state) => {
      state.currentDate = subMonths(state.currentDate, 1);
    },
    goToNextMonth: (state) => {
      state.currentDate = addMonths(state.currentDate, 1);
    },
    goToToday: (state) => {
      state.currentDate = new Date();
      state.selectedDate = new Date();
    },
    
    // Date selection
    selectDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    
    // View management
    setView: (state, action) => {
      state.view = action.payload;
    },
    
    // Event management
    addEvent: (state, action) => {
      const newEvent = {
        id: Date.now().toString(),
        ...action.payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.events.push(newEvent);
      saveEventsToStorage(state.events);
    },
    
    updateEvent: (state, action) => {
      const { id, ...updates } = action.payload;
      const eventIndex = state.events.findIndex(event => event.id === id);
      if (eventIndex !== -1) {
        state.events[eventIndex] = {
          ...state.events[eventIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        saveEventsToStorage(state.events);
      }
    },
    
    deleteEvent: (state, action) => {
      state.events = state.events.filter(event => event.id !== action.payload);
      saveEventsToStorage(state.events);
    },
    
    // Modal management
    openEventModal: (state, action) => {
      state.isEventModalOpen = true;
      state.isEventModalEditing = action.payload ? true : false;
      state.selectedEvent = action.payload || null;
    },
    
    closeEventModal: (state) => {
      state.isEventModalOpen = false;
      state.isEventModalEditing = false;
      state.selectedEvent = null;
    },
    
    // Drag and drop
    moveEvent: (state, action) => {
      const { eventId, newStartTime, newEndTime } = action.payload;
      const eventIndex = state.events.findIndex(event => event.id === eventId);
      if (eventIndex !== -1) {
        state.events[eventIndex].startTime = newStartTime;
        state.events[eventIndex].endTime = newEndTime;
        state.events[eventIndex].updatedAt = new Date().toISOString();
        saveEventsToStorage(state.events);
      }
    },
    
    resizeEvent: (state, action) => {
      const { eventId, newEndTime } = action.payload;
      const eventIndex = state.events.findIndex(event => event.id === eventId);
      if (eventIndex !== -1) {
        state.events[eventIndex].endTime = newEndTime;
        state.events[eventIndex].updatedAt = new Date().toISOString();
        saveEventsToStorage(state.events);
      }
    },
    
    // Recurring events
    addRecurringEvent: (state, action) => {
      const { eventData, recurrence } = action.payload;
      const events = generateRecurringEvents(eventData, recurrence);
      state.events.push(...events);
      saveEventsToStorage(state.events);
    },
    
    updateRecurringEvent: (state, action) => {
      const { eventId, updates, updateType } = action.payload; // 'this', 'all', 'future'
      const eventIndex = state.events.findIndex(event => event.id === eventId);
      
      if (eventIndex === -1) return;
      
      const originalEvent = state.events[eventIndex];
      
      if (updateType === 'this') {
        // Update only this occurrence
        state.events[eventIndex] = {
          ...state.events[eventIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      } else if (updateType === 'all' || updateType === 'future') {
        // Update all or future occurrences
        state.events = state.events.map(event => {
          if (event.parentId === originalEvent.parentId || 
              (updateType === 'future' && new Date(event.startTime) >= new Date(originalEvent.startTime))) {
            return {
              ...event,
              ...updates,
              updatedAt: new Date().toISOString(),
            };
          }
          return event;
        });
      }
      
      saveEventsToStorage(state.events);
    },
    
    deleteRecurringEvent: (state, action) => {
      const { eventId, deleteType } = action.payload; // 'this', 'all', 'future'
      const eventIndex = state.events.findIndex(event => event.id === eventId);
      
      if (eventIndex === -1) return;
      
      const originalEvent = state.events[eventIndex];
      
      if (deleteType === 'this') {
        // Delete only this occurrence
        state.events.splice(eventIndex, 1);
      } else if (deleteType === 'all') {
        // Delete all occurrences
        state.events = state.events.filter(event => 
          event.parentId !== originalEvent.parentId && event.id !== eventId
        );
      } else if (deleteType === 'future') {
        // Delete this and future occurrences
        state.events = state.events.filter(event => 
          !(event.parentId === originalEvent.parentId && 
            new Date(event.startTime) >= new Date(originalEvent.startTime))
        );
      }
      
      saveEventsToStorage(state.events);
    },
    
    // Filters
    setSearchTerm: (state, action) => {
      state.filters.searchTerm = action.payload;
    },
    
    setCategoryFilter: (state, action) => {
      state.filters.category = action.payload;
    },
    
    setShowRecurring: (state, action) => {
      state.filters.showRecurring = action.payload;
    },
    
    setTimezone: (state, action) => {
      state.timezone = action.payload;
    },
  },
});

export const {
  goToPreviousMonth,
  goToNextMonth,
  goToToday,
  selectDate,
  setView,
  addEvent,
  updateEvent,
  deleteEvent,
  openEventModal,
  closeEventModal,
  moveEvent,
  resizeEvent,
  addRecurringEvent,
  updateRecurringEvent,
  deleteRecurringEvent,
  setSearchTerm,
  setCategoryFilter,
  setShowRecurring,
  setTimezone,
} = calendarSlice.actions;

export default calendarSlice.reducer;
