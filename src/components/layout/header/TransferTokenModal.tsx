import React from 'react';
import Image from 'next/image';

function ButtonContent({ icon, url, name, setIsShow }) {
  const openUrl = () => {
    setIsShow(false);
    window.open(url, '_blank');
  };
  return (
    <div className="button" onClick={openUrl}>
      <Image src={icon} alt="" className="icon" width={24} height={24} />
      {name}
    </div>
  );
}

function EmptyContent() {
  return <div className="empty-btn" />;
}

const TransferTokenModal = props => {
  const { isShow, setIsShow } = props;
  if (!isShow) {
    return null;
  }

  return (
    <div className="transfertoken-modalbg" onClick={() => setIsShow(false)}>
      <div className="transfertoken-modal" onClick={e => e.stopPropagation()}>
        <div className="close-row">
          <Image
            src="/images/components/common/modal/close.svg"
            alt=""
            width={16}
            height={16}
            className="button"
            onClick={() => setIsShow(false)}
          />
        </div>
        <div className="content">
          <div className="item">
            <div className="title">Bridge ETH / WETH to Arbitrum👇</div>
            <div className="btn-rows">
              <ButtonContent
                url="https://bridge.arbitrum.io/"
                name="Arbitrum"
                icon="/images/components/layout/header/arbitrum.png"
                setIsShow={setIsShow}
              />
            </div>
          </div>
          <div className="item">
            <div className="title">Wrap ETH on Arbitrum👇</div>
            <div className="btn-rows">
              <ButtonContent
                url="https://app.uniswap.org/#/swap/"
                name="Uniswap"
                icon="/images/components/layout/header/uniswap.png"
                setIsShow={setIsShow}
              />
              <EmptyContent />
            </div>
          </div>
          <Image src="/images/components/common/modal/modal-logo.svg" width={170} height={165} alt="" className="tribelogos" />
        </div>
      </div>
    </div>
  );
};

export default TransferTokenModal;
