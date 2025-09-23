# 📚 Complete Calendar Application Tutorial

## 🎯 Table of Contents
1. [Project Architecture Overview](#project-architecture-overview)
2. [Package Dependencies Explained](#package-dependencies-explained)
3. [Application Flow & Data Flow](#application-flow--data-flow)
4. [Redux State Management](#redux-state-management)
5. [Component Architecture](#component-architecture)
6. [Key Features Implementation](#key-features-implementation)
7. [File-by-File Breakdown](#file-by-file-breakdown)
8. [Development Workflow](#development-workflow)

---

## 🏗️ Project Architecture Overview

```
Calendar Application Architecture
├── 🎨 Presentation Layer (React Components)
│   ├── Calendar.jsx (Main Calendar Views)
│   ├── EventModal.jsx (CRUD Operations)
│   ├── SearchAndFilter.jsx (Search & Filter)
│   └── MobileAgendaView.jsx (Mobile Experience)
├── 🧠 State Management Layer (Redux)
│   ├── calendarSlice.js (All Calendar Logic)
│   └── store/index.js (Store Configuration)
├── 🎭 Interaction Layer (React DnD)
│   ├── DraggableEvent.jsx (Draggable Events)
│   └── DroppableTimeSlot.jsx (Drop Zones)
└── 💾 Persistence Layer (localStorage)
    └── Automatic Save/Load
```

---

## 📦 Package Dependencies Explained

### Core React Dependencies
```json
{
  "react": "^19.1.1",           // 🎯 Main React library
  "react-dom": "^19.1.1"        // 🎯 React DOM rendering
}
```
**What they do**: The foundation of our application. React handles component rendering, state, and lifecycle.

### State Management
```json
{
  "@reduxjs/toolkit": "^2.9.0", // 🧠 Modern Redux with less boilerplate
  "react-redux": "^9.2.0"       // 🧠 React bindings for Redux
}
```
**What they do**: 
- Redux Toolkit simplifies Redux setup and reduces boilerplate
- React Redux connects React components to Redux store
- Provides `useSelector` and `useDispatch` hooks

### Date & Time Management
```json
{
  "date-fns": "^4.1.0"          // 📅 Modern date utility library
}
```
**What they do**: Handles all date operations:
- Formatting dates (`format(new Date(), 'MMM dd')`)
- Date arithmetic (`addDays`, `addMonths`)
- Date comparisons (`isSameDay`, `isToday`)

### Drag & Drop
```json
{
  "react-dnd": "^16.0.1",                    // 🎭 Drag and drop system
  "react-dnd-html5-backend": "^16.0.1"       // 🎭 HTML5 drag backend
}
```
**What they do**: Professional drag & drop functionality:
- Makes events draggable
- Creates drop zones for time slots
- Handles drag events and drop logic

### Styling
```json
{
  "tailwindcss": "^4.1.13",     // 🎨 Utility-first CSS framework
  "@tailwindcss/vite": "^4.1.13" // 🎨 Tailwind CSS for Vite
}
```
**What they do**: Provides utility classes for styling:
- `bg-blue-500`, `text-white`, `p-4`, `rounded-lg`
- Responsive design (`lg:hidden`, `md:grid-cols-3`)
- Consistent design system

### Build Tools
```json
{
  "vite": "^7.1.2",                        // ⚡ Fast build tool
  "@vitejs/plugin-react": "^5.0.0",        // ⚡ React plugin for Vite
  "eslint": "^9.33.0"                      // 🔍 Code linting
}
```
**What they do**: Development and build tools:
- Vite provides fast development server and building
- ESLint ensures code quality

---

## 🔄 Application Flow & Data Flow

### 1. Application Startup Flow
```
1. main.jsx → App.jsx
2. App.jsx sets up Redux Provider
3. Redux store loads events from localStorage
4. Calendar component renders with initial state
5. User sees the calendar interface
```

### 2. User Interaction Flow
```
User Action → Component Event → Redux Action → State Update → UI Re-render
```

**Example: Creating an Event**
```
1. User clicks on date → handleDateClick()
2. Component dispatches openEventModal()
3. Redux updates isEventModalOpen: true
4. EventModal component renders
5. User fills form and submits
6. Component dispatches addEvent()
7. Redux adds event to state
8. localStorage saves the event
9. Calendar re-renders with new event
```

### 3. Data Persistence Flow
```
Redux State → localStorage → Browser Storage
     ↑                           ↓
User Actions ← Component ← localStorage
```

---

## 🧠 Redux State Management

### Store Structure
```javascript
{
  calendar: {
    // Navigation State
    currentDate: Date,           // What month/week/day we're viewing
    selectedDate: Date,          // User-selected date
    
    // Events Data
    events: Array,              // All calendar events
    
    // UI State
    view: 'month' | 'week' | 'day',
    selectedEvent: Object,      // Currently selected event
    isEventModalOpen: Boolean,
    isEventModalEditing: Boolean,
    
    // Configuration
    timezone: String,           // User's timezone
    filters: {
      searchTerm: String,
      category: String,
      showRecurring: Boolean
    }
  }
}
```

### Key Redux Actions
```javascript
// Navigation
goToPreviousMonth()     // Navigate to previous month
goToNextMonth()         // Navigate to next month
goToToday()            // Jump to today
selectDate(date)       // Select a specific date

// Event Management
addEvent(eventData)           // Create new event
updateEvent(id, updates)      // Update existing event
deleteEvent(id)              // Delete event

// Recurring Events
addRecurringEvent(eventData, recurrence)
updateRecurringEvent(id, updates, updateType)
deleteRecurringEvent(id, deleteType)

// Modal Management
openEventModal(event?)        // Open modal (optionally with event)
closeEventModal()            // Close modal

// Drag & Drop
moveEvent(eventId, newStartTime, newEndTime)
resizeEvent(eventId, newEndTime)
```

---

## 🧩 Component Architecture

### Component Hierarchy
```
App.jsx
├── SearchAndFilter.jsx
├── MobileAgendaView.jsx
├── Calendar.jsx
│   ├── DroppableTimeSlot.jsx
│   │   └── DraggableEvent.jsx
│   └── (Multiple time slots)
└── EventModal.jsx
```

### Component Responsibilities

#### 1. App.jsx - Application Root
```javascript
// Sets up Redux Provider and DnD Provider
// Renders main layout with all components
// Handles responsive design (mobile vs desktop)
```

#### 2. Calendar.jsx - Main Calendar Component
```javascript
// Renders different views (month/week/day)
// Handles navigation (prev/next/today)
// Manages view switching
// Renders time slots and events
```

#### 3. EventModal.jsx - Event CRUD Modal
```javascript
// Form for creating/editing events
// Validation logic
// Recurring event options
// Save/delete operations
```

#### 4. DraggableEvent.jsx - Draggable Event Wrapper
```javascript
// Makes events draggable using React DnD
// Handles drag start/end events
// Provides visual feedback during drag
```

#### 5. DroppableTimeSlot.jsx - Drop Zone
```javascript
// Creates drop zones for events
// Handles drop events
// Renders events within time slots
```

#### 6. SearchAndFilter.jsx - Search & Filter
```javascript
// Search events by title/description
// Filter by categories
// Show event statistics
// View switching controls
```

#### 7. MobileAgendaView.jsx - Mobile Experience
```javascript
// Mobile-optimized agenda view
// Shows upcoming events
// Touch-friendly interface
```

---

## ⚡ Key Features Implementation

### 1. Multi-View Calendar System

#### Month View
```javascript
// Creates 7x6 grid (weeks x days)
// Shows events as small blocks
// Handles overflow with "+X more"

const renderMonthView = () => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  
  // Generate calendar grid
  // Render each day with events
}
```

#### Week View
```javascript
// Shows 7 days with hourly time slots
// Events positioned by time
// Handles overlapping events

const renderWeekView = () => {
  const weekStart = startOfWeek(currentDate);
  const timeSlots = Array.from({length: 13}, (_, i) => i + 8); // 8 AM to 8 PM
  
  // Render each day column
  // Render time slots for each day
  // Position events by start time
}
```

#### Day View
```javascript
// Shows single day with hourly slots
// Full-width event display
// Detailed time information

const renderDayView = () => {
  const timeSlots = Array.from({length: 13}, (_, i) => i + 8);
  
  // Render single day
  // Show all time slots
  // Display events with full details
}
```

### 2. Drag & Drop System

#### Making Events Draggable
```javascript
const [{ isDragging }, drag] = useDrag({
  type: 'event',
  item: { id: event.id, type: 'event' },
  collect: (monitor) => ({
    isDragging: monitor.isDragging(),
  }),
  end: (item, monitor) => {
    // Handle drop logic
    const dropResult = monitor.getDropResult();
    if (dropResult) {
      dispatch(moveEvent({...}));
    }
  },
});
```

#### Creating Drop Zones
```javascript
const [{ isOver }, drop] = useDrop({
  accept: 'event',
  drop: (item) => {
    // Calculate new time based on drop position
    return { newStartTime: calculatedTime };
  },
  collect: (monitor) => ({
    isOver: monitor.isOver(),
  }),
});
```

### 3. Recurring Events System

#### Generating Recurring Events
```javascript
const generateRecurringEvents = (eventData, recurrence) => {
  const { frequency, interval, endDate, count } = recurrence;
  const events = [];
  const parentId = Date.now().toString();
  
  let currentDate = new Date(eventData.startTime);
  let eventCount = 0;
  
  while (currentDate <= new Date(endDate) && eventCount < maxEvents) {
    // Create event instance
    events.push({
      id: `${parentId}_${eventCount}`,
      parentId,
      ...eventData,
      startTime: currentDate.toISOString(),
      endTime: calculateEndTime(currentDate, eventData),
    });
    
    // Calculate next occurrence
    switch (frequency) {
      case 'daily': currentDate = addDays(currentDate, interval); break;
      case 'weekly': currentDate = addWeeks(currentDate, interval); break;
      case 'monthly': currentDate = addMonths(currentDate, interval); break;
      case 'yearly': currentDate = addYears(currentDate, interval); break;
    }
    
    eventCount++;
  }
  
  return events;
};
```

#### Handling Recurring Event Updates
```javascript
// Update types: 'this', 'all', 'future'
updateRecurringEvent: (state, action) => {
  const { eventId, updates, updateType } = action.payload;
  
  if (updateType === 'this') {
    // Update only this occurrence
  } else if (updateType === 'all') {
    // Update all occurrences with same parentId
  } else if (updateType === 'future') {
    // Update this and future occurrences
  }
}
```

### 4. Data Persistence

#### Saving to localStorage
```javascript
const saveEventsToStorage = (events) => {
  try {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  } catch (error) {
    console.error('Error saving events:', error);
  }
};

// Called whenever events change
const calendarSlice = createSlice({
  // ... reducers
  extraReducers: (builder) => {
    builder.addMatcher(
      (action) => action.type.startsWith('calendar/'),
      (state) => {
        saveEventsToStorage(state.events);
      }
    );
  }
});
```

#### Loading from localStorage
```javascript
const loadEventsFromStorage = () => {
  try {
    const events = localStorage.getItem('calendarEvents');
    return events ? JSON.parse(events) : [];
  } catch (error) {
    console.error('Error loading events:', error);
    return [];
  }
};
```

---

## 📁 File-by-File Breakdown

### 1. main.jsx - Application Entry Point
```javascript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```
**Purpose**: Entry point that renders the App component to the DOM.

### 2. App.jsx - Main Application Component
```javascript
import React from 'react';
import { Provider } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { store } from './store';

const App = () => {
  return (
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto py-4 lg:py-8 px-4">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Calendar & Scheduling
              </h1>
            </div>

            {/* Search and Filter */}
            <SearchAndFilter />

            {/* Mobile Agenda View */}
            <MobileAgendaView />

            {/* Desktop Calendar */}
            <div className="hidden lg:block">
              <Calendar />
            </div>

            {/* Event Modal */}
            <EventModal />
          </div>
        </div>
      </DndProvider>
    </Provider>
  );
};
```
**Purpose**: 
- Sets up Redux Provider for state management
- Sets up DnD Provider for drag & drop
- Renders responsive layout
- Includes all major components

### 3. store/index.js - Redux Store Configuration
```javascript
import { configureStore } from '@reduxjs/toolkit';
import calendarReducer from './calendarSlice';

export const store = configureStore({
  reducer: {
    calendar: calendarReducer,
  },
});

export default store;
```
**Purpose**: Configures Redux store with calendar reducer.

### 4. store/calendarSlice.js - Redux State Management
```javascript
import { createSlice } from '@reduxjs/toolkit';
import { addMonths, subMonths, /* ... other date functions */ } from 'date-fns';

// Helper functions for localStorage
const loadEventsFromStorage = () => { /* ... */ };
const saveEventsToStorage = (events) => { /* ... */ };
const generateRecurringEvents = (eventData, recurrence) => { /* ... */ };

const initialState = {
  currentDate: new Date(),
  selectedDate: new Date(),
  events: loadEventsFromStorage(),
  view: 'month',
  selectedEvent: null,
  isEventModalOpen: false,
  isEventModalEditing: false,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
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
    // Navigation actions
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
    
    // Event management actions
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
    
    // ... many more reducers
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
```
**Purpose**: 
- Defines all Redux actions and reducers
- Manages calendar state
- Handles localStorage persistence
- Implements recurring events logic

### 5. components/Calendar.jsx - Main Calendar Component
```javascript
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
    // Complex logic to render month grid
    // Handles 7x6 grid layout
    // Shows events per day
  };

  const renderWeekView = () => {
    // Logic to render week view
    // Shows 7 days with hourly time slots
    // Positions events by time
  };

  const renderDayView = () => {
    // Logic to render day view
    // Shows single day with detailed time slots
  };

  const renderCurrentView = () => {
    switch (view) {
      case 'week': return renderWeekView();
      case 'day': return renderDayView();
      default: return renderMonthView();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header with navigation and view controls */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {format(currentDate, 'MMMM yyyy')}
          </h1>
          <div className="flex space-x-2">
            <button onClick={() => dispatch(goToPreviousMonth())}>←</button>
            <button onClick={() => dispatch(goToToday())}>Today</button>
            <button onClick={() => dispatch(goToNextMonth())}>→</button>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {['month', 'week', 'day'].map(viewType => (
            <button
              key={viewType}
              onClick={() => dispatch(setView(viewType))}
              className={view === viewType ? 'bg-blue-600 text-white' : 'bg-gray-100'}
            >
              {viewType}
            </button>
          ))}
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
```
**Purpose**: 
- Main calendar rendering component
- Handles different views (month/week/day)
- Manages navigation
- Renders events and time slots

### 6. components/EventModal.jsx - Event CRUD Modal
```javascript
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  addEvent, 
  updateEvent, 
  deleteEvent, 
  closeEventModal, 
  addRecurringEvent, 
  updateRecurringEvent, 
  deleteRecurringEvent 
} from '../store/calendarSlice';
import { format, addMonths } from 'date-fns';

const EventModal = () => {
  const dispatch = useDispatch();
  const { isEventModalOpen, isEventModalEditing, selectedEvent, selectedDate } = useSelector(state => state.calendar);
  
  const [formData, setFormData] = useState({
    title: '',
    startTime: '',
    endTime: '',
    category: 'general',
    description: '',
    location: '',
    isRecurring: false,
    recurrence: {
      frequency: 'weekly',
      interval: 1,
      endDate: '',
      count: 10
    }
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Initialize form data when modal opens
    if (isEventModalOpen) {
      if (isEventModalEditing && selectedEvent) {
        // Editing existing event
        setFormData({
          title: selectedEvent.title || '',
          startTime: selectedEvent.startTime ? format(new Date(selectedEvent.startTime), "yyyy-MM-dd'T'HH:mm") : '',
          endTime: selectedEvent.endTime ? format(new Date(selectedEvent.endTime), "yyyy-MM-dd'T'HH:mm") : '',
          category: selectedEvent.category || 'general',
          description: selectedEvent.description || '',
          location: selectedEvent.location || '',
          isRecurring: !!selectedEvent.parentId,
          recurrence: {
            frequency: selectedEvent.recurrence?.frequency || 'weekly',
            interval: selectedEvent.recurrence?.interval || 1,
            endDate: selectedEvent.recurrence?.endDate || '',
            count: selectedEvent.recurrence?.count || 10
          }
        });
      } else {
        // Creating new event
        const defaultStartTime = selectedDate ? new Date(selectedDate) : new Date();
        defaultStartTime.setHours(9, 0, 0, 0);
        
        const defaultEndTime = new Date(defaultStartTime);
        defaultEndTime.setHours(10, 0, 0, 0);
        
        const defaultEndDate = addMonths(defaultStartTime, 3);
        
        setFormData({
          title: '',
          startTime: format(defaultStartTime, "yyyy-MM-dd'T'HH:mm"),
          endTime: format(defaultEndTime, "yyyy-MM-dd'T'HH:mm"),
          category: 'general',
          description: '',
          location: '',
          isRecurring: false,
          recurrence: {
            frequency: 'weekly',
            interval: 1,
            endDate: format(defaultEndDate, "yyyy-MM-dd"),
            count: 10
          }
        });
      }
      setErrors({});
    }
  }, [isEventModalOpen, isEventModalEditing, selectedEvent, selectedDate]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }

    if (formData.startTime && formData.endTime) {
      const startTime = new Date(formData.startTime);
      const endTime = new Date(formData.endTime);
      
      if (endTime <= startTime) {
        newErrors.endTime = 'End time must be after start time';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const eventData = {
      title: formData.title.trim(),
      startTime: new Date(formData.startTime).toISOString(),
      endTime: new Date(formData.endTime).toISOString(),
      category: formData.category,
      description: formData.description.trim(),
      location: formData.location.trim()
    };

    if (isEventModalEditing && selectedEvent) {
      if (formData.isRecurring && selectedEvent.parentId) {
        // Handle recurring event update
        const updateType = window.confirm(
          'This is a recurring event. Update:\n- OK: This occurrence only\n- Cancel: All occurrences'
        ) ? 'this' : 'all';
        
        dispatch(updateRecurringEvent({
          eventId: selectedEvent.id,
          updates: eventData,
          updateType
        }));
      } else {
        dispatch(updateEvent({ id: selectedEvent.id, ...eventData }));
      }
    } else {
      if (formData.isRecurring) {
        dispatch(addRecurringEvent({
          eventData,
          recurrence: formData.recurrence
        }));
      } else {
        dispatch(addEvent(eventData));
      }
    }

    dispatch(closeEventModal());
  };

  const handleDelete = () => {
    if (selectedEvent && selectedEvent.parentId) {
      // Recurring event - show dialog for delete type
      const deleteType = window.confirm(
        'This is a recurring event. Delete:\n- OK: This occurrence only\n- Cancel: All occurrences'
      ) ? 'this' : 'all';
      
      dispatch(deleteRecurringEvent({
        eventId: selectedEvent.id,
        deleteType
      }));
    } else if (selectedEvent) {
      dispatch(deleteEvent(selectedEvent.id));
    }
    dispatch(closeEventModal());
  };

  const handleClose = () => {
    dispatch(closeEventModal());
  };

  const categories = [
    { value: 'general', label: 'General', color: 'bg-blue-100 text-blue-800' },
    { value: 'work', label: 'Work', color: 'bg-green-100 text-green-800' },
    { value: 'personal', label: 'Personal', color: 'bg-purple-100 text-purple-800' },
    { value: 'meeting', label: 'Meeting', color: 'bg-orange-100 text-orange-800' },
    { value: 'important', label: 'Important', color: 'bg-red-100 text-red-800' }
  ];

  if (!isEventModalOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEventModalEditing ? 'Edit Event' : 'Create Event'}
          </h2>
          <button onClick={handleClose}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Form fields */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Event title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* More form fields... */}
          
          <div className="flex items-center justify-between pt-4">
            <div>
              {isEventModalEditing && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Delete
                </button>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
              >
                {isEventModalEditing ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
```
**Purpose**: 
- Modal form for creating/editing events
- Form validation
- Handles recurring events
- CRUD operations

### 7. components/DraggableEvent.jsx - Draggable Event Wrapper
```javascript
import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { moveEvent, resizeEvent } from '../store/calendarSlice';

const DraggableEvent = ({ event, style, children, onResize }) => {
  const dispatch = useDispatch();

  const [{ isDragging }, drag] = useDrag({
    type: 'event',
    item: { id: event.id, type: 'event' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      if (!monitor.didDrop()) {
        return;
      }
      
      const dropResult = monitor.getDropResult();
      if (dropResult && dropResult.newStartTime) {
        const duration = new Date(event.endTime) - new Date(event.startTime);
        const newEndTime = new Date(dropResult.newStartTime.getTime() + duration);
        
        dispatch(moveEvent({
          eventId: event.id,
          newStartTime: dropResult.newStartTime.toISOString(),
          newEndTime: newEndTime.toISOString()
        }));
      }
    },
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'event',
    drop: (item) => {
      if (item.id !== event.id) {
        return { newStartTime: new Date(event.startTime) };
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={(node) => {
        drag(node);
        drop(node);
      }}
      style={{
        ...style,
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: isOver ? '#e3f2fd' : style.backgroundColor,
      }}
      className="relative cursor-move"
    >
      {children}
      
      {/* Resize handle */}
      <div
        className="absolute bottom-0 right-0 w-3 h-3 bg-gray-400 cursor-se-resize opacity-0 hover:opacity-100 transition-opacity"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onResize && onResize(e);
        }}
      />
    </div>
  );
};

export default DraggableEvent;
```
**Purpose**: 
- Makes events draggable using React DnD
- Handles drag and drop logic
- Provides resize functionality
- Visual feedback during drag operations

### 8. components/DroppableTimeSlot.jsx - Drop Zone Component
```javascript
import React from 'react';
import { useDrop } from 'react-dnd';
import DraggableEvent from './DraggableEvent';

const DroppableTimeSlot = ({ 
  time, 
  date, 
  events = [], 
  onEventClick, 
  onDateClick,
  view = 'month',
  children 
}) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'event',
    drop: (item, monitor) => {
      if (monitor.didDrop()) {
        return;
      }
      
      const newStartTime = new Date(date);
      
      if (time !== undefined) {
        newStartTime.setHours(time, 0, 0, 0);
      }
      
      return { newStartTime };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const handleEventClick = (event, e) => {
    e.stopPropagation();
    onEventClick && onEventClick(event, e);
  };

  const handleSlotClick = () => {
    if (time !== undefined) {
      const clickedTime = new Date(date);
      clickedTime.setHours(time, 0, 0, 0);
      onDateClick && onDateClick(clickedTime);
    } else {
      onDateClick && onDateClick(date);
    }
  };

  const getEventStyle = (event) => {
    const start = new Date(event.startTime);
    const end = new Date(event.endTime);
    
    if (view === 'week' || view === 'day') {
      const startHour = start.getHours() + start.getMinutes() / 60;
      const endHour = end.getHours() + end.getMinutes() / 60;
      const duration = endHour - startHour;
      
      return {
        top: `${(startHour - 8) * 48}px`, // 48px per hour
        height: `${duration * 48}px`,
      };
    }
    
    return {};
  };

  const getCategoryColor = (category) => {
    const colors = {
      general: 'bg-blue-100 text-blue-800',
      work: 'bg-green-100 text-green-800',
      personal: 'bg-purple-100 text-purple-800',
      meeting: 'bg-orange-100 text-orange-800',
      important: 'bg-red-100 text-red-800'
    };
    return colors[category] || colors.general;
  };

  if (view === 'month') {
    return (
      <div
        ref={drop}
        className={`
          min-h-[120px] p-2 border border-gray-200 cursor-pointer relative
          ${isOver ? 'bg-blue-50' : 'hover:bg-gray-50'}
        `}
        onClick={handleSlotClick}
      >
        {children}
        <div className="space-y-1">
          {events.slice(0, 2).map(event => (
            <DraggableEvent
              key={event.id}
              event={event}
              style={{
                backgroundColor: 'transparent'
              }}
            >
              <div
                className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 ${getCategoryColor(event.category)}`}
                onClick={(e) => handleEventClick(event, e)}
              >
                {event.title}
              </div>
            </DraggableEvent>
          ))}
          {events.length > 2 && (
            <div className="text-xs text-gray-500">
              +{events.length - 2} more
            </div>
          )}
        </div>
      </div>
    );
  }

  // Week and Day views
  return (
    <div
      ref={drop}
      className={`
        h-12 border-b border-gray-100 relative cursor-pointer
        ${isOver ? 'bg-blue-50' : 'hover:bg-gray-50'}
      `}
      onClick={handleSlotClick}
    >
      <div className="absolute left-2 top-1 text-xs text-gray-400">
        {time === 12 ? '12 PM' : time > 12 ? `${time - 12} PM` : `${time} AM`}
      </div>
      
      {/* Render events for this time slot */}
      {events.map(event => (
        <DraggableEvent
          key={event.id}
          event={event}
          style={{
            position: 'absolute',
            left: '16px',
            right: '8px',
            ...getEventStyle(event),
            backgroundColor: 'transparent'
          }}
          onResize={(e) => {
            // Handle resize logic
            e.preventDefault();
            e.stopPropagation();
            
            const startY = e.clientY;
            const handleResize = (moveEvent) => {
              const deltaY = moveEvent.clientY - startY;
              const deltaHours = deltaY / 48; // 48px per hour
              
              const newEndTime = new Date(event.endTime);
              newEndTime.setHours(newEndTime.getHours() + deltaHours);
              
              // Update the event end time
            };
            
            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleResize);
              document.removeEventListener('mouseup', handleMouseUp);
            };
            
            document.addEventListener('mousemove', handleResize);
            document.addEventListener('mouseup', handleMouseUp);
          }}
        >
          <div
            className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 ${getCategoryColor(event.category)}`}
            onClick={(e) => handleEventClick(event, e)}
          >
            {event.title}
          </div>
        </DraggableEvent>
      ))}
    </div>
  );
};

export default DroppableTimeSlot;
```
**Purpose**: 
- Creates drop zones for events
- Renders events within time slots
- Handles drop events
- Manages event positioning

---

## 🔧 Development Workflow

### 1. Setting Up the Project
```bash
# Create new React project with Vite
npm create vite@latest calendar-app -- --template react

# Install dependencies
npm install @reduxjs/toolkit react-redux date-fns react-dnd react-dnd-html5-backend

# Install Tailwind CSS
npm install -D tailwindcss @tailwindcss/vite
npx tailwindcss init -p

# Start development server
npm run dev
```

### 2. Development Process
```
1. Plan feature → 2. Create Redux actions → 3. Update components → 4. Test functionality
```

### 3. Testing Features
```bash
# Start dev server
npm run dev

# Test in browser
http://localhost:5173

# Build for production
npm run build

# Preview production build
npm run preview
```

### 4. Code Organization
```
src/
├── store/           # Redux state management
├── components/      # React components
├── App.jsx         # Main app component
├── main.jsx        # Entry point
└── index.css       # Global styles
```

---

## 🎓 Key Learning Points

### 1. Redux Pattern
```javascript
// Action Creator
const addEvent = (eventData) => ({
  type: 'calendar/addEvent',
  payload: eventData
});

// Reducer
const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    addEvent: (state, action) => {
      state.events.push(action.payload);
    }
  }
});

// Component Usage
const dispatch = useDispatch();
const events = useSelector(state => state.calendar.events);
```

### 2. React Hooks Pattern
```javascript
// State management
const [formData, setFormData] = useState({});
const [errors, setErrors] = useState({});

// Side effects
useEffect(() => {
  // Load data when component mounts
}, []);

// Redux integration
const dispatch = useDispatch();
const { events } = useSelector(state => state.calendar);
```

### 3. Drag & Drop Pattern
```javascript
// Make component draggable
const [{ isDragging }, drag] = useDrag({
  type: 'event',
  item: { id: event.id },
  collect: (monitor) => ({
    isDragging: monitor.isDragging(),
  })
});

// Make component droppable
const [{ isOver }, drop] = useDrop({
  accept: 'event',
  drop: (item) => {
    // Handle drop logic
  }
});

// Combine refs
<div ref={(node) => { drag(node); drop(node); }}>
```

### 4. Date Manipulation Pattern
```javascript
import { format, addDays, isSameDay } from 'date-fns';

// Format dates
format(new Date(), 'MMMM yyyy') // "December 2024"

// Date arithmetic
addDays(new Date(), 7) // Add 7 days

// Date comparisons
isSameDay(date1, date2) // Check if same day
```

### 5. Form Handling Pattern
```javascript
const [formData, setFormData] = useState({});

// Controlled inputs
<input
  value={formData.title}
  onChange={(e) => setFormData({...formData, title: e.target.value})}
/>

// Form validation
const validateForm = () => {
  const errors = {};
  if (!formData.title) errors.title = 'Required';
  return Object.keys(errors).length === 0;
};
```

---

## 🚀 Next Steps for Learning

1. **Add More Features**:
   - User authentication
   - Calendar sharing
   - Event notifications
   - Import/export functionality

2. **Improve Performance**:
   - Implement React.memo for optimization
   - Add virtualization for large event lists
   - Implement lazy loading

3. **Add Testing**:
   - Unit tests with Jest
   - Component tests with React Testing Library
   - E2E tests with Cypress

4. **Deploy Application**:
   - Deploy to Vercel, Netlify, or AWS
   - Set up CI/CD pipeline
   - Add error tracking

This calendar application demonstrates modern React development patterns, Redux state management, drag & drop interactions, and responsive design. It's a great foundation for learning full-stack development!
