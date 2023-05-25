import React from 'react';
// import { OverlayTrigger, Tooltip } from 'react-bootstrap';

interface SocialMediaIconProps {
  linkUrl: string;
  idName: string;
  svgSource: string;
  // label: string;
}

function SocialMediaIcon(props: SocialMediaIconProps) {
  const { linkUrl, idName, svgSource } = props;
  // const { linkUrl, idName, svgSource, label } = props;
  // const tips = <Tooltip>{label}</Tooltip>;

  return (
    // <OverlayTrigger placement="top" overlay={tips}>
    <div>
      <span style={{ cursor: 'default' }}>
        <a href={linkUrl} target="_blank" rel="noreferrer" className="cursor-pointer">
          <svg width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="gradient" gradientUnits="userSpaceOnUse" fy="90%">
                <stop offset="0" stopColor="#04aefc" />
                <stop offset="0.5" stopColor="#795af4" />
                <stop offset="1" stopColor="#f703d9" />
              </linearGradient>

              <mask id={idName} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                <image href={svgSource} width="24" height="24" />
              </mask>
            </defs>

            <g mask={`url(#${idName})`}>
              <rect x="0" y="0" width="24" height="24" fill="white" fillOpacity="0.87" />
              <rect
                className="duration-400 inline-block opacity-0
                  transition-opacity ease-in-out hover:opacity-100"
                x="0"
                y="0"
                width="24"
                height="24"
                fill="url(#gradient)"
              />
            </g>
          </svg>
        </a>
      </span>
    </div>
  );
}

export default SocialMediaIcon;
