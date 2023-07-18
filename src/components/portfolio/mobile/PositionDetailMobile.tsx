/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
/* eslint-disable operator-linebreak */
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useStore as useNanostore } from '@nanostores/react';
import {
  $psLiqSwitchRatio,
  $psSelectedCollectionAmm,
  $psShowBalance,
  $psShowFundingPayment,
  $psShowPositionDetail
} from '@/stores/portfolio';
import { getCollectionInformation } from '@/const/collectionList';
import { $isShowMobileModal } from '@/stores/modal';
import { $userPositionInfos } from '@/stores/user';
import { PriceWithIcon } from '@/components/common/PriceWithIcon';
import { detailRowMobile } from '@/components/common/LabelsComponents';
import { useFundingPaymentHistory } from '@/hooks/collection';
import { ammAbi } from '@/const/abi';
import { usePublicClient } from 'wagmi';
import { formatBigInt } from '@/utils/bigInt';

const PositionDetailMobile = () => {
  const psSelectedCollectionAmm: any = useNanostore($psSelectedCollectionAmm);
  const collectionInfo = getCollectionInformation(psSelectedCollectionAmm);
  const showPositionDetailModal = useNanostore($psShowPositionDetail);
  const userPositionInfos: any = useNanostore($userPositionInfos);
  const userPosition = userPositionInfos[psSelectedCollectionAmm];
  const isShowBalance = useNanostore($psShowBalance);
  const { size } = userPosition;
  const { total: accFp } = useFundingPaymentHistory(userPosition.amm);
  const [isLiquidationRisk, setIsLiquidationRisk] = useState(false);
  const [oraclePrice, setOraclePrice] = useState(0);
  const liqSwitchRatio = useNanostore($psLiqSwitchRatio);
  const publicClient = usePublicClient();

  const handleBackClick = () => {
    $psShowPositionDetail.set(false);
    $isShowMobileModal.set(false);
  };

  useEffect(() => {
    async function getOracle() {
      const oraclePriceBn = await publicClient.readContract({
        address: userPosition.ammAddress,
        abi: ammAbi,
        functionName: 'getUnderlyingPrice'
      });
      setOraclePrice(formatBigInt(oraclePriceBn));
    }

    if (userPosition.ammAddress) {
      getOracle();
    }
  }, [publicClient, userPosition.ammAddress]);

  useEffect(() => {
    const isOver =
      oraclePrice && userPosition.vammPrice && liqSwitchRatio
        ? Math.abs((userPosition.vammPrice - oraclePrice) / oraclePrice) >= liqSwitchRatio
        : false;
    const selectedPriceForCalc = !isOver ? userPosition.vammPrice : oraclePrice;
    setIsLiquidationRisk(
      (userPosition.size > 0 && selectedPriceForCalc <= userPosition.liquidationPrice) ||
        (userPosition.size < 0 && selectedPriceForCalc >= userPosition.liquidationPrice)
    );
  }, [liqSwitchRatio, oraclePrice, userPosition]);

  const onClickFundingPayment = () => {
    $psShowFundingPayment.set(true);
  };

  return (
    <div
      className={`fixed bottom-0 left-0 top-0 z-10 h-full w-full
        ${showPositionDetailModal ? 'left-[0]' : 'left-[100%]'}
        transition-left z-[12] w-full items-center justify-center
        bg-black/[.2] backdrop-blur-[4px] duration-500
      `}>
      <div
        className="h-full w-full justify-between rounded-[12px] border-[1px]
        border-[#71aaff38] bg-darkBlue text-[14px] font-normal text-mediumEmphasis">
        <div className="mb-[6px] flex w-full items-center justify-between bg-lightBlue px-5 py-6">
          <div>
            <div className="mb-[6px] text-[12px] font-normal text-highEmphasis">Unrealized P/L</div>
            <PriceWithIcon
              width={22}
              height={22}
              className={`text-[20px] font-semibold
                ${
                  Number(userPosition?.margin.toFixed(4)) > 0
                    ? 'text-marketGreen'
                    : Number(userPosition?.margin.toFixed(4)) < 0
                    ? 'text-ma rketRed'
                    : ''
                }`}
              priceValue={`
                ${Number(userPosition?.margin.toFixed(4)) > 0 ? '+' : ''}${userPosition?.margin.toFixed(4)}
              `}
            />
          </div>

          <div>
            <Image src={collectionInfo?.image} width={40} height={40} alt="" />
          </div>
        </div>

        {isLiquidationRisk ? (
          <div className="mx-5 my-6 flex items-start">
            <Image src="/images/common/alert/alert_yellow.svg" width={15} height={15} alt="" />
            <p className="ml-1 text-[12px] font-normal text-warn">
              Your position is at risk of being liquidated. <br />
              Please manage your risk.
            </p>
          </div>
        ) : null}

        <div className="text-mediumEmphasis">
          <div className="mb-[6px] bg-lightBlue">
            {detailRowMobile(
              'Type',
              <div className={`${size > 0 ? 'text-marketGreen' : 'text-marketRed'}`}>
                {isShowBalance ? (size > 0 ? 'LONG' : 'SHORT') : '****'}
              </div>
            )}
            {detailRowMobile(
              'vAMM Price',
              <PriceWithIcon className="font-normal" priceValue={isShowBalance ? userPosition.vammPrice?.toFixed(2) : '****'} />
            )}

            {detailRowMobile(
              'Avg. Entry Price',
              <PriceWithIcon className="font-normal" priceValue={isShowBalance ? userPosition.entryPrice?.toFixed(2) : '****'} />
            )}
          </div>

          <div className="mb-[6px] bg-lightBlue">
            {detailRowMobile(
              'Liq. Price',
              <PriceWithIcon className="font-normal" priceValue={isShowBalance ? userPosition.liquidationPrice?.toFixed(2) : '****'} />
            )}
            {detailRowMobile(
              'Leverage',
              <div className="font-normal">{isShowBalance ? `${userPosition.leverage?.toFixed(2)} x` : '****'}</div>
            )}
            {detailRowMobile(
              'Contract Size',
              <div className="flex font-normal">
                <Image src={collectionInfo?.image} width={16} height={16} alt="" />
                <div className="ml-[6px]">{isShowBalance ? Math.abs(userPosition.size)?.toFixed(4) : '****'}</div>
              </div>
            )}
            {detailRowMobile(
              'Notional Value',
              <PriceWithIcon className="font-normal" priceValue={isShowBalance ? userPosition.currentNotional?.toFixed(4) : '****'} />
            )}
            {detailRowMobile(
              'Collateral Value',
              <PriceWithIcon className="font-normal" priceValue={isShowBalance ? userPosition.margin?.toFixed(4) : '****'} />
            )}
          </div>

          <div className="mb-[6px] bg-lightBlue" onClick={onClickFundingPayment}>
            {detailRowMobile(
              'Accu. Funding Payment',
              <div className="flex items-center">
                <PriceWithIcon
                  className={`font-normal
                  ${accFp > 0 ? 'text-marketGreen' : accFp < 0 ? 'text-marketRed' : ''}`}
                  priceValue={isShowBalance ? accFp?.toFixed(4) : '****'}
                />
                <Image
                  src="/images/mobile/common/angle-left.svg"
                  className="ml-[2px] cursor-pointer"
                  width={14}
                  height={14}
                  alt=""
                  onClick={handleBackClick}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-0 h-[50px] w-full
        bg-secondaryBlue  text-[15px] text-white
      ">
        <div className="flex h-[50px] w-full items-center justify-center px-[22px] py-4">
          <Image
            src="/images/mobile/common/angle-right.svg"
            className="absolute left-[22px] cursor-pointer"
            width={14}
            height={14}
            alt=""
            onClick={handleBackClick}
          />
          <div className="flex">{collectionInfo?.collection} Position Detail</div>
        </div>
      </div>
    </div>
  );
};

export default PositionDetailMobile;
