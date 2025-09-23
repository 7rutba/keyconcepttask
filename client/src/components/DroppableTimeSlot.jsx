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
      
      // Calculate the new start time based on the drop position
      const rect = monitor.getDropResult?.() || {};
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
        top: `${(startHour - 8) * 48}px`, // 48px per hour (12px per 15min)
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
            // Handle resize logic here
            e.preventDefault();
            e.stopPropagation();
            
            const startY = e.clientY;
            const handleResize = (moveEvent) => {
              const deltaY = moveEvent.clientY - startY;
              const deltaHours = deltaY / 48; // 48px per hour
              
              const newEndTime = new Date(event.endTime);
              newEndTime.setHours(newEndTime.getHours() + deltaHours);
              
              // Update the event end time
              // This would typically be handled by a resize handler
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
