import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addEvent, updateEvent, deleteEvent, closeEventModal, addRecurringEvent, updateRecurringEvent, deleteRecurringEvent } from '../store/calendarSlice';
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
        defaultStartTime.setHours(9, 0, 0, 0); // Default to 9:00 AM
        
        const defaultEndTime = new Date(defaultStartTime);
        defaultEndTime.setHours(10, 0, 0, 0); // Default to 10:00 AM
        
        const defaultEndDate = addMonths(defaultStartTime, 3); // Default to 3 months from now
        
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
        // Handle recurring event update - show dialog for update type
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
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                Start Time *
              </label>
              <input
                type="datetime-local"
                id="startTime"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.startTime ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.startTime && (
                <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>
              )}
            </div>

            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                End Time *
              </label>
              <input
                type="datetime-local"
                id="endTime"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.endTime ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.endTime && (
                <p className="mt-1 text-sm text-red-600">{errors.endTime}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Event location"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Event description"
            />
          </div>

          {/* Recurring Event Section */}
          {!isEventModalEditing && (
            <div>
              <div className="flex items-center mb-3">
                <input
                  type="checkbox"
                  id="isRecurring"
                  checked={formData.isRecurring}
                  onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="isRecurring" className="text-sm font-medium text-gray-700">
                  Make this a recurring event
                </label>
              </div>

              {formData.isRecurring && (
                <div className="space-y-3 pl-6 border-l-2 border-gray-200">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
                        Repeat
                      </label>
                      <select
                        id="frequency"
                        value={formData.recurrence.frequency}
                        onChange={(e) => setFormData({
                          ...formData,
                          recurrence: { ...formData.recurrence, frequency: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="interval" className="block text-sm font-medium text-gray-700 mb-1">
                        Every
                      </label>
                      <input
                        type="number"
                        id="interval"
                        min="1"
                        value={formData.recurrence.interval}
                        onChange={(e) => setFormData({
                          ...formData,
                          recurrence: { ...formData.recurrence, interval: parseInt(e.target.value) || 1 }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      value={formData.recurrence.endDate}
                      onChange={(e) => setFormData({
                        ...formData,
                        recurrence: { ...formData.recurrence, endDate: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

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
