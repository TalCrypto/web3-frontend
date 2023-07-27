// @ts-nocheck
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';

function Tooltip(props: any) {
  const { direction, content, children, className = '' } = props;
  const tooltipId = `tooltipId_${Math.random()}`;

  return (
    <>
      <div className={className} data-tooltip-id={tooltipId}>
        {children}
      </div>
      <ReactTooltip
        place={direction}
        id={tooltipId}
        content={content}
        classNameArrow="tooltip-content-arrow"
        className="tooltip-content z-10 rounded-[8px] bg-white px-3 py-2
          !text-center !text-[12px] !font-normal text-highEmphasis !opacity-100"
      />
    </>
  );
}

export default Tooltip;
