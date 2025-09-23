# Calendar & Scheduling System

A comprehensive calendar application built with React, Redux Toolkit, and Tailwind CSS, featuring event management, drag & drop functionality, recurring events, and responsive design.

## Features

### ✅ Basic Calendar (Foundation)
- **Monthly Calendar Grid**: Display a monthly calendar with navigation
- **Today Highlighting**: Current date is visually highlighted
- **Navigation Controls**: Previous/Next month buttons and "Today" button
- **Event Display**: Shows events per day with "+X more" for overflow

### ✅ Event CRUD Operations
- **Add/Edit/Delete Events**: Full CRUD operations with modal form
- **Event Fields**: Title, Start Time, End Time, Category, Description, Location
- **Form Validation**: Required title, end time must be after start time
- **Persistent Storage**: Events stored in Redux state and localStorage

### ✅ Multi-View Support
- **Month View**: Traditional monthly calendar grid
- **Week View**: Weekly time-slot view with hourly breakdown
- **Day View**: Detailed daily view with time slots
- **Overlapping Events**: Events displayed side-by-side in time views

### ✅ Drag & Drop + Resize
- **Event Dragging**: Drag events to reschedule them
- **Event Resizing**: Resize events to adjust duration
- **Optimistic UI**: Immediate visual feedback during operations
- **React DnD Integration**: Professional drag & drop implementation

### ✅ Recurring Events
- **Recurrence Patterns**: Daily, Weekly, Monthly, Yearly
- **Custom Intervals**: Set custom intervals (every 2 weeks, etc.)
- **End Date Support**: Set when recurring events should stop
- **Exception Handling**: Update/delete individual occurrences or all instances

### ✅ Advanced Features
- **Search & Filter**: Search events by title, description, location
- **Category Filtering**: Filter by event categories with color coding
- **Responsive Design**: Mobile-friendly agenda view for small screens
- **Timezone Support**: Auto-detect and display user timezone
- **Event Statistics**: Show category counts and event summaries

## Technology Stack

- **React 19**: Modern React with hooks
- **Redux Toolkit**: State management with RTK
- **React Redux**: React bindings for Redux
- **date-fns**: Date manipulation library
- **React DnD**: Drag and drop functionality
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast build tool and dev server

## Project Structure

```
src/
├── store/
│   ├── index.js              # Redux store configuration
│   └── calendarSlice.js      # Calendar state management
├── components/
│   ├── Calendar.jsx          # Main calendar component
│   ├── EventModal.jsx        # Event creation/editing modal
│   ├── DraggableEvent.jsx    # Draggable event wrapper
│   ├── DroppableTimeSlot.jsx # Drop zones for events
│   ├── SearchAndFilter.jsx   # Search and filtering
│   └── MobileAgendaView.jsx  # Mobile-responsive agenda
├── App.jsx                   # Main application component
└── main.jsx                  # Application entry point
```

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## Usage Guide

### Creating Events
1. Click on any date or time slot
2. Fill in the event details in the modal
3. Optionally set up recurring patterns
4. Click "Create" to save

### Managing Events
- **Edit**: Click on an existing event to edit it
- **Delete**: Use the delete button in the event modal
- **Drag**: Drag events to different time slots
- **Resize**: Use the resize handle on the bottom-right of events

### Views
- **Month**: Traditional calendar grid view
- **Week**: Weekly view with hourly time slots
- **Day**: Detailed daily view with time slots

### Recurring Events
1. Check "Make this a recurring event" when creating
2. Set the frequency (daily, weekly, monthly, yearly)
3. Set the interval (every X days/weeks/months/years)
4. Set an end date for the recurring series

### Search & Filter
- Use the search bar to find events by title, description, or location
- Filter by categories using the category dropdown
- View statistics for each category

### Mobile Experience
- On mobile devices, the calendar switches to an agenda view
- Shows upcoming events for the next 7 days
- Touch-friendly interface with swipe gestures

## Redux State Structure

```javascript
{
  calendar: {
    currentDate: Date,           // Currently displayed date
    selectedDate: Date,          // User-selected date
    events: Array,              // All events
    view: 'month' | 'week' | 'day',
    selectedEvent: Object,      // Currently selected event
    isEventModalOpen: Boolean,
    isEventModalEditing: Boolean,
    timezone: String,           // User timezone
    filters: {
      searchTerm: String,
      category: String,
      showRecurring: Boolean
    }
  }
}
```

## Event Data Structure

```javascript
{
  id: String,                   // Unique identifier
  parentId: String,             // For recurring events
  title: String,                // Event title
  startTime: ISO String,        // Start time
  endTime: ISO String,          // End time
  category: String,             // Event category
  description: String,          // Event description
  location: String,             // Event location
  createdAt: ISO String,        // Creation timestamp
  updatedAt: ISO String         // Last update timestamp
}
```

## Key Features Explained

### Drag & Drop Implementation
- Uses React DnD for professional drag and drop
- Events are draggable across different time slots
- Drop zones are time slots in week/day views
- Optimistic updates provide immediate feedback

### Recurring Events
- Generates multiple event instances based on pattern
- Links related events with `parentId`
- Supports updating/deleting individual or all occurrences
- Handles complex recurrence patterns

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Desktop: Full calendar views
- Mobile: Agenda list view
- Touch-friendly interactions

### Data Persistence
- Redux state management
- localStorage for data persistence
- Automatic save/load on application start

## Future Enhancements

- **Multi-user Support**: User authentication and shared calendars
- **Notifications**: Event reminders and notifications
- **Calendar Sharing**: Share calendars with other users
- **Import/Export**: Import from Google Calendar, Outlook, etc.
- **Advanced Recurrence**: Custom recurrence patterns
- **Event Templates**: Save and reuse event templates
- **Time Blocking**: Block time for focused work
- **Analytics**: Event analytics and insights

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
