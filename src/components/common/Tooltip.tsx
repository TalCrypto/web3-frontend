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

  let containerClassName = '';
  let arrowClassName = '';

  if (direction === 'top') {
    containerClassName = 'bottom-[calc(100%+7px)] left-[50%] translate-x-[-50%]';
    arrowClassName = 'ml-[6px] bottom-[-12px] left-[calc(50%-12px)] border-t-[#2c479c]';
  } else if (direction === 'bottom') {
    containerClassName = '';
    arrowClassName = '';
  } else if (direction === 'right') {
    containerClassName = 'left-[calc(100%+8px)] top-[50%-6px]';
    arrowClassName = 'top-[calc(50%-7px)] left-[calc(0%-11px)] border-r-[#2c479c]';
  } else if (direction === 'left') {
    containerClassName = '';
    arrowClassName = '';
  }

  return (
    <div className="relative items-center" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div
        className={`
            tooltip-content linear pointer-events-none absolute z-20
             rounded-[4px] text-highEmphasis transition-opacity duration-300
            ${isHovered ? 'opacity-100' : 'opacity-0'}
            ${containerClassName} 
          `}>
        <div
          className={`pointer-events-none absolute 
            z-10 border-[6px] border-transparent ${arrowClassName}`}
        />
        <div className="whitespace-nowrap px-3 py-2 text-[12px]">{content}</div>
      </div>
      {children}
    </div>
  );
};

export default Tooltip;
