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
        className="tooltip-content z-10 rounded-[4px] bg-white px-3
        py-2 text-[12px] text-highEmphasis !opacity-100"
      />
    </>
  );
}

export default Tooltip;
