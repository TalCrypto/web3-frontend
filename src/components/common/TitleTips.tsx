import React from 'react';
// import { OverlayTrigger, Tooltip } from 'react-bootstrap';

interface TitleTipsProps {
  titleText: string;
  // tipsText: string;
  // placement?: string;
}

const TitleTips: React.FC<TitleTipsProps> = ({ titleText }) => (
  // const TitleTips: React.FC<TitleTipsProps> = ({ titleText, tipsText, placement = 'right' }) => (
  // const tips = <Tooltip>{tipsText}</Tooltip>;

  // <OverlayTrigger placement={placement} overlay={tips}>
  //   <span style={{ cursor: 'default' }}>{titleText}</span>
  // </OverlayTrigger>
  <div>
    <span style={{ cursor: 'default' }}>{titleText}</span>
  </div>
);

// TitleTips.defaultProps = {
//   placement: 'right'
// };

export default TitleTips;
