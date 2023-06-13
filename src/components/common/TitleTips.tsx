/* eslint-disable no-unused-vars */
import Tooltip from '@/components/common/Tooltip';
import React from 'react';

function TitleTips(props: any) {
  const { titleText, tipsText, placement } = props;
  return (
    <Tooltip direction={placement} content={tipsText}>
      <span style={{ cursor: 'default' }}>{titleText}</span>
    </Tooltip>
  );
}

export default TitleTips;
