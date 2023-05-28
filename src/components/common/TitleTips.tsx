/* eslint-disable no-unused-vars */
import React from 'react';
// import { OverlayTrigger, Tooltip } from 'react-bootstrap';

function TitleTips(props: any) {
  const { titleText, tipsText, placement } = props;
  // const TitleTips: React.FC<TitleTipsProps> = ({ titleText, tipsText, placement = 'right' }) => (
  // const tips = <Tooltip>{tipsText}</Tooltip>;

  // <OverlayTrigger placement={placement} overlay={tips}>
  //   <span style={{ cursor: 'default' }}>{titleText}</span>
  // </OverlayTrigger>
  return <span style={{ cursor: 'default' }}>{titleText}</span>;
}

export default TitleTips;
