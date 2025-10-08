import React, { forwardRef } from 'react';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(({ 
  children, 
  className = '', 
  style,
  draggable,
  onDragStart,
  onDragOver,
  onDrop,
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={`bg-blue-500 text-white px-2 py-1 rounded-md text-sm font-medium ${className}`}
      style={style}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      {...props}
    >
      {children}
    </div>
  );
});
