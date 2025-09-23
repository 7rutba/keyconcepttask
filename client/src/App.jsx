import React from 'react';
import { Provider } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { store } from './store';
import Calendar from './components/Calendar';
import EventModal from './components/EventModal';
import SearchAndFilter from './components/SearchAndFilter';
import MobileAgendaView from './components/MobileAgendaView';

const App = () => {
  return (
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto py-4 lg:py-8 px-4">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Calendar & Scheduling</h1>
              <p className="text-gray-600">Manage your events and schedule with ease</p>
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

export default App;