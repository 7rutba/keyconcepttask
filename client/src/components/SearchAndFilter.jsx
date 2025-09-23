import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setView } from '../store/calendarSlice';

const SearchAndFilter = () => {
  const dispatch = useDispatch();
  const { events, view } = useSelector(state => state.calendar);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { value: 'all', label: 'All Categories', color: 'bg-gray-100 text-gray-800' },
    { value: 'general', label: 'General', color: 'bg-blue-100 text-blue-800' },
    { value: 'work', label: 'Work', color: 'bg-green-100 text-green-800' },
    { value: 'personal', label: 'Personal', color: 'bg-purple-100 text-purple-800' },
    { value: 'meeting', label: 'Meeting', color: 'bg-orange-100 text-orange-800' },
    { value: 'important', label: 'Important', color: 'bg-red-100 text-red-800' }
  ];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryStats = () => {
    const stats = {};
    events.forEach(event => {
      stats[event.category] = (stats[event.category] || 0) + 1;
    });
    return stats;
  };

  const categoryStats = getCategoryStats();

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      {/* Search Bar */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-2 rounded-lg border ${
            showFilters ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          Filters
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label} ({categoryStats[category.value] || 0})
                  </option>
                ))}
              </select>
            </div>

            {/* View Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                View
              </label>
              <div className="flex space-x-2">
                {['month', 'week', 'day'].map(viewType => (
                  <button
                    key={viewType}
                    onClick={() => dispatch(setView(viewType))}
                    className={`px-3 py-2 rounded-lg text-sm capitalize ${
                      view === viewType 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {viewType}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Results
              </label>
              <div className="text-sm text-gray-600">
                {filteredEvents.length} of {events.length} events
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="border-t border-gray-200 pt-4 mt-4">
        <div className="flex flex-wrap gap-2">
          {categories.slice(1).map(category => (
            <div
              key={category.value}
              className={`px-3 py-1 rounded-full text-xs font-medium ${category.color}`}
            >
              {category.label}: {categoryStats[category.value] || 0}
            </div>
          ))}
        </div>
      </div>

      {/* Search Results Preview */}
      {searchTerm && (
        <div className="border-t border-gray-200 pt-4 mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Search Results ({filteredEvents.length})
          </h3>
          <div className="max-h-40 overflow-y-auto space-y-2">
            {filteredEvents.slice(0, 5).map(event => (
              <div key={event.id} className="p-2 bg-gray-50 rounded-lg">
                <div className="font-medium text-sm text-gray-900">{event.title}</div>
                <div className="text-xs text-gray-500">
                  {new Date(event.startTime).toLocaleDateString()} at {new Date(event.startTime).toLocaleTimeString()}
                </div>
                {event.location && (
                  <div className="text-xs text-gray-500">📍 {event.location}</div>
                )}
              </div>
            ))}
            {filteredEvents.length > 5 && (
              <div className="text-xs text-gray-500 text-center">
                ... and {filteredEvents.length - 5} more events
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter;
