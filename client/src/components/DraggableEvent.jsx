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
        // Calculate new position based on drop location
        const rect = event.target.getBoundingClientRect();
        const dropX = event.clientX - rect.left;
        const dropY = event.clientY - rect.top;
        
        // This is a simplified implementation - in a real app you'd calculate
        // the exact time slot based on position
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
