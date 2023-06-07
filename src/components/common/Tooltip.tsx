// components/Tooltip.tsx
import React, { useState } from 'react';

interface TooltipProps {
  direction: 'top' | 'bottom' | 'left' | 'right';
  content: string | React.ReactNode;
  children: React.ReactNode; // Add children prop
}

const Tooltip: React.FC<TooltipProps> = ({ direction, content, children }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  let style: any = {};

  if (direction === 'top') {
    style = { bottom: 'calc(100% + 7px)' };
  } else if (direction === 'bottom') {
    style = {};
  } else if (direction === 'right') {
    style = {};
  } else if (direction === 'left') {
    style = {};
  }

  return (
    <div className="relative items-center" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div
        className={`
            tooltip-content linear pointer-events-none absolute rounded-[4px]
            bg-gray-800 text-white transition-opacity duration-300
            ${isHovered ? 'opacity-100' : 'opacity-0'}            
            ${direction === 'top' ? 'left-[50%] translate-x-[-50%]' : ''} 
          `}
        style={style}>
        <div
          className="pointer-events-none absolute bottom-[-12px] left-[calc(50%-12px)]
            z-10 ml-[6px] border-[6px] border-transparent border-t-[#2c479c]"
        />
        <div className="px-3 py-2">{content}</div>
      </div>
      {children}
    </div>
  );
};

export default Tooltip;
