/* eslint-disable max-len */
import React from 'react';
// import * as htmlToImage from 'html-to-image';
// import download from 'downloadjs';
// import moment from 'moment';
import { logEvent } from 'firebase/analytics';
import { useRouter } from 'next/router';

import collectionList from '@/const/collectionList';
import { calculateNumber } from '@/utils/calculateNumbers';
import { apiConnection } from '@/utils/apiConnection';
import { firebaseAnalytics } from '@/const/firebaseConfig';
import { walletProvider } from '@/utils/walletProvider';
import { pageTitleParser } from '@/utils/eventLog';
import Image from 'next/image';
import { formatDateTime } from '@/utils/date';

function LargeEthPrice(props: any) {
  const { pnlValue } = props;

  return (
    <div className="row eths">
      <div className="large-eth col-auto">
        <Image src="/images/common/symbols/eth-tribe3.svg" alt="" className="eth-icon" />
        <span className={`price ${Number(pnlValue) > 0 ? 'raise' : Number(pnlValue) < 0 ? 'drop' : ''}`}>
          {(Number(pnlValue) > 0 ? '+' : '') + (Number(pnlValue) === 0 ? '0.00' : pnlValue)}
        </span>
      </div>
    </div>
  );
}

function NormalEthPrice(props: any) {
  const { price } = props;

  return (
    <div className="row">
      <div className="normal-eth col-auto">
        <Image src="/images/common/symbols/eth-tribe3.svg" alt="" className="eth-icon" />
        <span className="price">{price}</span>
      </div>
    </div>
  );
}

export default function IndividualShareContainer(props: any) {
  const { userPosition, index = 0, setShowShareComponent, userInfo } = props;
  const filteredPosition = userPosition[index];
  const ammTitle = filteredPosition.pair;
  const filteringCollection = collectionList.filter((item: any) => item.name === ammTitle);
  const filteredCollection = filteringCollection[0];
  const pnlStatus = filteredPosition.unrealizedPnl
    ? Number(calculateNumber(filteredPosition.unrealizedPnl, 4)) >= 0
    : Number(calculateNumber(filteredPosition.unrealizedPnl, 4)) >= 0;
  const side = Number(calculateNumber(filteredPosition.size, 4)) > 0;
  const leverage = Number(calculateNumber(filteredPosition.remainMarginLeverage, 2)).toFixed(2);
  const pnlValue = filteredPosition.unrealizedPnl
    ? calculateNumber(filteredPosition.unrealizedPnl, 4)
    : calculateNumber(filteredPosition.unrealizedPnl, 4);
  const entryPrice = calculateNumber(filteredPosition.entryPrice, 2);
  const futurePrice = filteredPosition.spotPrice
    ? calculateNumber(filteredPosition.spotPrice, 2)
    : calculateNumber(filteredPosition.currentPrice, 2);
  const currentPositionName = filteredCollection.collectionName;
  const router = useRouter();
  const { page } = pageTitleParser(router.asPath);
  console.log(userInfo);
  // const userAddress = `${userInfo?.userAddress.substring(0, 7)}...${userInfo?.userAddress.slice(-3)}`;
  // const showUserId = userInfo?.username === '' ? userAddress : userInfo?.username;

  const closeShareWindow = () => {
    setShowShareComponent(false);
  };
  const downloadRank = () => {
    // const target = document.getElementById('image-bg');
    // htmlToImage.toJpeg(target).then((dataUrl: any) => {
    //   if (window.screen.width > 800) {
    //     download(dataUrl, `my-result-${filteredCollection.collectionName}.jpeg`);
    //   } else {
    //     const image = new Image();
    //     image.src = dataUrl;
    //     const w = window.open('');
    //     w.document.write(image.outerHTML);
    //     w.document.close();
    //   }
    // });

    const fullWalletAddress = walletProvider.holderAddress;
    const eventName = 'share_position_performance_download_pressed';

    if (firebaseAnalytics) {
      logEvent(firebaseAnalytics, eventName, {
        wallet: fullWalletAddress.substring(2),
        collection: currentPositionName
      });
    }

    apiConnection.postUserEvent(eventName, {
      page,
      collection: currentPositionName
    });
  };
  const shareToTwitter = () => {
    const content = `Taking a ${
      side ? 'long' : 'short'
    } position on ${currentPositionName} on @Tribe3Official \n\non Tribe3 public beta app.tribe3.xyz and earn Tribe3 Points! 🪶🪶\n\n#Tribe3 #DEX #NFTFi #NFTFutures #Tribe3Points #airdrop`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(content)}`;
    window.open(url);

    const fullWalletAddress = walletProvider.holderAddress;
    const eventName = 'share_position_performance_twitter_pressed';

    if (firebaseAnalytics) {
      logEvent(firebaseAnalytics, eventName, {
        wallet: fullWalletAddress.substring(2),
        collection: currentPositionName
      });
    }

    apiConnection.postUserEvent(eventName, {
      page,
      collection: currentPositionName
    });
  };

  return (
    <div className="indi-share-component" onClick={() => setShowShareComponent(false)}>
      <div className="contents-mod" onClick={e => e.stopPropagation()}>
        <div className="row full-contents-row">
          <div className={`image-bg ${pnlStatus ? 'win' : 'lose'}`} id="image-bg">
            <div className="content-col">
              <div className="headers">
                <Image src={filteredCollection.logo} alt="" width={64} height={64} />
                <div className="row intro">
                  <div className="collection-name col-auto">
                    <span className="">{filteredCollection.displayCollectionPair}</span>
                  </div>
                  <div className="col contact">
                    <span>Perpetual Contract</span>
                  </div>
                </div>
              </div>
              <div className="price-content">
                <div className="row side">
                  <div className={`side-content col-auto ${side ? 'long' : 'short'}`}>{side ? 'LONG' : 'SHORT'}</div>
                  <div className="leverage col-auto">
                    <span className="text">{`${leverage}x`}</span> Leverage
                  </div>
                </div>
                <div className="pnlcontent">
                  <LargeEthPrice pnlValue={pnlValue} />
                </div>
                <div className="entrycontent">
                  <NormalEthPrice price={entryPrice} />
                </div>
                <div className="entrycontent future">
                  <NormalEthPrice price={futurePrice} />
                </div>
                <div className="time">
                  {/* <div>ID: {showUserId}</div> */}
                  <div>{formatDateTime(Date.now(), 'YYYY. DD. MMM HH:mm UTCZ').toUpperCase()}</div>
                  {/* <div>{moment().format('YYYY. DD. MMM HH:mm UTCZ').toUpperCase()}</div> */}
                </div>
              </div>
            </div>
          </div>
          <div className="col function-col">
            <div className="row contents-row-empty">
              <div className="col closebtn">
                <Image
                  src="/images/components/common/modal/close.svg"
                  alt=""
                  className="cursor-pointer"
                  width={16}
                  height={16}
                  onClick={closeShareWindow}
                />
              </div>
            </div>
            <div className="row contents-row">
              <div className="col-12 function-icon">
                <Image src="../../static/share_twitter.png" alt="" width={44} height={44} onClick={shareToTwitter} />
              </div>
              <div className="col function-title">Share to Twitter</div>
            </div>
            <div className="row contents-row">
              <div className="col-12 function-icon">
                <Image src="../../static/download_img.png" alt="" width={44} height={44} onClick={downloadRank} />
              </div>
              <div className="col function-title">Download Image</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
