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
      <div className="flex">
        <Image src="/images/common/symbols/eth-tribe3.svg" alt="" className="eth-icon" width={36} height={36} />
        <span
          className={`ml-1 text-[36px] font-semibold
            ${Number(pnlValue) > 0 ? 'text-[#78f363]' : Number(pnlValue) < 0 ? 'text-[#ff5656]' : ''}`}>
          {(Number(pnlValue) > 0 ? '+' : '') + (Number(pnlValue) === 0 ? '0.00' : pnlValue)}
        </span>
      </div>
    </div>
  );
}

function NormalEthPrice(props: any) {
  const { price } = props;

  return (
    <div className="flex">
      <div className="flex">
        <Image src="/images/common/symbols/eth-tribe3.svg" alt="" className="eth-icon" width={20} height={20} />
        <span className="ml-1 text-[16px] font-medium">{price}</span>
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
    <div
      className="fixed left-0 top-0 z-[20] flex h-full
      w-full items-center justify-center overflow-auto bg-black/[.3]
      text-white/[.95] backdrop-blur-[8px]"
      onClick={() => setShowShareComponent(false)}>
      <div className="share-container min-w-[600px] rounded-[12px]" onClick={e => e.stopPropagation()}>
        <div className="ml-3 flex py-4">
          <div
            className={`image-bg h-[618px] w-[440px] py-3 pl-3
            ${pnlStatus ? 'win' : 'lose'}`}
            id="image-bg">
            <div className="mt-4">
              <div className="ml-6">
                <Image src={filteredCollection.logo} alt="" width={64} height={64} />
                <div className="mt-2 flex items-baseline">
                  <div className="pr-[6px] text-[18px] font-bold text-white/[.95]">
                    <span className="">{filteredCollection.displayCollectionPair}</span>
                  </div>
                  <div className="p-0 text-[14px] font-semibold text-[#98bbfe]/[.89]">
                    <span>Perpetual Contract</span>
                  </div>
                </div>
              </div>
              <div className="mt-5">
                <div className="ml-8 flex">
                  <div
                    className={`mx-2 my-0 rounded-[2px] bg-[#78f363]/[.2] px-1 py-0
                      text-[16px] font-semibold
                    ${side ? 'text-[#78f363]' : 'text-[#ff5656]'}`}>
                    {side ? 'LONG' : 'SHORT'}
                  </div>

                  <div className="pl-1">
                    <span className="text">{`${leverage}x`}</span> Leverage
                  </div>
                </div>
                <div className="ml-9 mt-[62px]">
                  <LargeEthPrice pnlValue={pnlValue} />
                </div>
                <div className="ml-10 mt-[52px]">
                  <NormalEthPrice price={entryPrice} />
                </div>
                <div className="ml-10 mt-[32px]">
                  <NormalEthPrice price={futurePrice} />
                </div>
                <div
                  className="mx-4 mb-3 mt-[172px] flex items-center
                  justify-between text-[12px] font-medium">
                  <div>ID: {/* showUserId */}</div>
                  <div>{formatDateTime(Date.now() / 1000, 'YYYY. DD. MMM HH:mm UTCZ').toUpperCase()}</div>
                  {/* <div>{moment().format('YYYY. DD. MMM HH:mm UTCZ').toUpperCase()}</div> */}
                </div>
              </div>
            </div>
          </div>
          <div className="w-[140px]">
            <div className="relative mb-[440px] flex">
              <div className="absolute right-[4px] top-[4px]">
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
            <div className="mb-8 cursor-pointer" onClick={shareToTwitter}>
              <div className="mb-1 flex justify-center">
                <Image src="/images/components/trade/share_twitter.png" alt="" width={44} height={44} />
              </div>
              <div className="text-center text-[12px]">Share to Twitter</div>
            </div>
            <div className="cursor-pointer" onClick={downloadRank}>
              <div className="mb-1 flex justify-center">
                <Image src="/images/components/trade/download_img.png" alt="" width={44} height={44} />
              </div>
              <div className="text-center text-[12px]">Download Image</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
