import React from 'react';
import Image from 'next/image';

const TradePanelModal = (props: any) => {
  const { isShow, setIsShow, message, link } = props;
  if (!isShow) {
    return null;
  }

  const dismissModal = () => {
    setIsShow(false);
  };

  return (
    <div className="trade-panel-modal">
      <div className="body">
        {message.map((msg: any) => (
          <div className="text-center">{msg}</div>
        ))}
        {link ? (
          <a href={link} target="_blank" rel="noreferrer" className="text-center">
            check on Arbiscan
            <Image alt="" src="/images/common/out.svg" />
          </a>
        ) : null}
        <button
          type="button"
          className="button"
          onClick={e => {
            e.stopPropagation();
            dismissModal();
          }}>
          OK
        </button>
      </div>
    </div>
  );
};

export default TradePanelModal;
