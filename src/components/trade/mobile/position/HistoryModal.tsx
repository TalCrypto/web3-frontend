/* eslint-disable indent */
/* eslint-disable react/no-array-index-key */
/* eslint-disable operator-linebreak */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-useless-fragment */

import { PriceWithIcon } from '@/components/common/PriceWithIcon';
import { TypeWithIconByAmm } from '@/components/common/TypeWithIcon';
import { getActionTypeFromApi, getWalletBalanceChange } from '@/utils/actionType';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { formatDateTime } from '@/utils/date';
import { $isShowMobileModal } from '@/stores/modal';
import { CollateralActions, TradeActions } from '@/const';
import { usePsHistoryByMonth } from '@/hooks/psHistory';
import { PositionHistoryRecord } from '@/stores/user';
import { DetailRowWithPriceIconMobile, LiquidationWarning, detailRowMobile } from '@/components/common/LabelsComponents';
import MobileTooltip from '@/components/common/mobile/Tooltip';

function ExplorerButton(props: any) {
  const { txHash, onClick } = props;
  return (
    <a href={`${process.env.NEXT_PUBLIC_TRANSACTIONS_DETAILS_URL}${txHash}`} onClick={onClick} target="_blank" rel="noreferrer">
      <Image alt="" src="/images/common/out.svg" width={24} height={24} />
    </a>
  );
}

const HistoryModal = (props: any) => {
  const { showHistoryModal, setShowHistoryModal } = props;
  const { psHistoryByMonth, psAmmHistoryByMonth } = usePsHistoryByMonth();
  const [selectedRecord, setSelectedRecord] = useState<PositionHistoryRecord>();

  const [isShowDetail, setIsShowDetail] = useState(false);
  const [selectedBalance, setSelectedBalance] = useState('');

  useEffect(() => {
    const recordMonths: any = Object.keys(psHistoryByMonth);
    if (recordMonths.length > 0) {
      const record = psHistoryByMonth[recordMonths[0]]?.[0];
      setSelectedRecord(record);
    }
  }, [psHistoryByMonth]);

  // detail data, selected record
  const tradeType = selectedRecord ? getActionTypeFromApi(selectedRecord) : '';
  const isFundingPaymentRecord = tradeType === TradeActions.CLOSE || tradeType === TradeActions.FULL_LIQ;
  const isLiquidation = tradeType === TradeActions.PARTIAL_LIQ || tradeType === TradeActions.FULL_LIQ;
  const isAdjustCollateral = tradeType === CollateralActions.ADD || tradeType === CollateralActions.REDUCE;
  const isFullClose = tradeType === TradeActions.CLOSE;
  const typeClassName =
    selectedRecord && selectedRecord.exchangedPositionSize > 0
      ? 'text-marketGreen'
      : selectedRecord && selectedRecord.exchangedPositionSize < 0
      ? 'text-marketRed'
      : '';

  const amountNumber = selectedRecord?.amount;
  const realizedPnlNumber = selectedRecord?.realizedPnl;
  const fundingPaymentNumber = selectedRecord?.fundingPayment;
  const positionNotionalNumber = selectedRecord?.positionNotional;
  const notionalChangeNumber = selectedRecord?.notionalChange;
  const collateralChangeNumber = selectedRecord?.collateralChange;
  const marginNumber = selectedRecord?.margin;
  const liquidationPenaltyNumber = selectedRecord?.liquidationPenalty;
  const openNotionalNumber = selectedRecord?.openNotional;

  const collateralChange =
    tradeType === TradeActions.REDUCE
      ? '-.--'
      : isLiquidation
      ? marginNumber
      : isFundingPaymentRecord
      ? -(Math.abs(amountNumber ?? 0) + (realizedPnlNumber ?? 0) - (fundingPaymentNumber ?? 0)).toFixed(4)
      : isAdjustCollateral
      ? (collateralChangeNumber ?? 0 + (fundingPaymentNumber ?? 0)).toFixed(4)
      : collateralChangeNumber?.toFixed(4);
  const fundingPayment = !selectedRecord
    ? '-.--'
    : selectedRecord.totalFundingPayment !== 0
    ? selectedRecord.totalFundingPayment.toFixed(4)
    : '0.0000';
  const fee = isLiquidation || isAdjustCollateral || !selectedRecord ? '-.--' : selectedRecord.fee.toFixed(4);
  const contractSize =
    !selectedRecord || isAdjustCollateral
      ? '-.--'
      : isLiquidation
      ? Math.abs(selectedRecord.positionSizeAfter).toFixed(4)
      : Math.abs(selectedRecord.exchangedPositionSize).toFixed(4);
  const notionalChange =
    !selectedRecord || isAdjustCollateral
      ? '-.--'
      : isLiquidation
      ? openNotionalNumber?.toFixed(4)
      : isFundingPaymentRecord
      ? -Number((positionNotionalNumber ?? 0 - (realizedPnlNumber ?? 0)).toFixed(4))
      : (notionalChangeNumber ?? 0 - (realizedPnlNumber ?? 0)).toFixed(4);
  const liquidationPenalty = isLiquidation ? `-${Number(liquidationPenaltyNumber).toFixed(4)}` : '-.--';

  const handleBackClick = () => {
    if (isShowDetail) {
      setIsShowDetail(false);
    } else {
      setShowHistoryModal(false);
      $isShowMobileModal.set(false);
    }
  };

  const onClickRow = (record: any) => {
    setSelectedRecord(record);
    setIsShowDetail(true);
    const balance = getWalletBalanceChange(record);
    setSelectedBalance(String(balance));
  };

  return (
    <div
      className={`fixed inset-0 z-10 h-screen w-full
        ${showHistoryModal ? 'left-[0]' : 'left-[100%]'}
        transition-left z-[12] overflow-auto
        bg-black bg-opacity-40 duration-500
      `}>
      <div
        className="relative top-0 mx-auto h-[calc(100%-50px)] w-full overflow-hidden
          border-[1px] border-[#71aaff38] bg-secondaryBlue"
        onClick={e => {
          e.stopPropagation();
        }}>
        {Object.keys(psAmmHistoryByMonth).length === 0 ? (
          <div className="flex h-full w-full items-center justify-center bg-lightBlue">
            <div>
              <div className="mb-2 flex items-center justify-center">
                <Image src="/images/mobile/common/empty_folder.svg" width={48} height={48} alt="" onClick={handleBackClick} />
              </div>
              <div className="text-highEmphasis">No transaction history.</div>
            </div>
          </div>
        ) : (
          <>
            <div className="relative h-full w-full bg-darkBlue">
              <div className="h-full w-full overflow-auto pb-[10px]">
                {Object.keys(psAmmHistoryByMonth).map((month: any) => {
                  const records: any = psAmmHistoryByMonth[month];

                  return (
                    <div id={`group-${month}`} key={`group-${month}`} className="collapsible">
                      {records.map((record: any, idx: any) => {
                        const currentRecordType = getActionTypeFromApi(record);
                        const balance = getWalletBalanceChange(record);

                        return (
                          <div
                            key={`item-${idx}-${record.timestamp}`}
                            className={`flex cursor-pointer justify-between
                                border-b-[1px] border-b-secondaryBlue 
                                px-5 py-[10px] text-highEmphasis`}
                            onClick={() => onClickRow(record)}>
                            <div className="flex max-w-[75%]">
                              <div className="mr-2 w-[2px] rounded-[2px] bg-primaryBlue" />
                              <div className="flex flex-col">
                                <span className="mb-2 text-[12px] text-mediumEmphasis">
                                  {formatDateTime(record.timestamp, 'MM/DD/YYYY HH:mm')}
                                </span>
                                <span>
                                  <TypeWithIconByAmm
                                    className="text-[12px]"
                                    amm={record.ammAddress}
                                    showCollectionName
                                    content={
                                      <div className="flex">
                                        &nbsp;- {currentRecordType}
                                        {currentRecordType === TradeActions.FULL_LIQ || currentRecordType === TradeActions.PARTIAL_LIQ ? (
                                          <Image className="ml-1" src="/images/common/alert/alert_red.svg" width={16} height={16} alt="" />
                                        ) : (
                                          ''
                                        )}
                                      </div>
                                    }
                                    imageWidth={20}
                                    imageHeight={20}
                                  />
                                </span>
                              </div>
                            </div>
                            <div
                              className="flex flex-col items-end justify-center text-end
                                text-[14px] text-mediumEmphasis">
                              <span className="mb-[6px] text-[12px] font-normal">Wallet Balance</span>
                              <PriceWithIcon
                                className={`${Number(balance) > 0 ? 'text-marketGreen' : Number(balance) < 0 ? 'text-marketRed' : ''}
                                  !text-[14px] font-medium`}
                                priceValue={`${Number(balance) > 0 ? '+' : ''}${
                                  Number(balance) === 0 ? '-.---' : Number(balance).toFixed(4)
                                }`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>

            <div
              className={`absolute top-0 h-full w-full bg-darkBlue pb-5
                ${isShowDetail ? 'left-[0]' : 'left-[100%]'}
                transition-left scrollable overflow-y-scroll duration-500
              `}>
              <div
                className="mb-[6px] flex items-center justify-between
                    bg-lightBlue px-5 py-4 text-[16px] text-highEmphasis">
                <div>
                  <span className="text-[12px] font-normal text-highEmphasis">Wallet Balance</span>
                  <PriceWithIcon
                    width={22}
                    height={22}
                    className={`${Number(selectedBalance) > 0 ? 'text-marketGreen' : Number(selectedBalance) < 0 ? 'text-marketRed' : ''}
                      mt-[6px] text-[20px] font-semibold`}
                    priceValue={`${Number(selectedBalance) > 0 ? '+' : ''}${
                      Number(selectedBalance) === 0 ? '--.--' : Number(selectedBalance).toFixed(4)
                    }`}
                  />
                </div>
                {selectedRecord && <ExplorerButton className="mr-[6px]" txHash={selectedRecord.txHash} />}
              </div>
              <div className="text-mediumEmphasis">
                <div className="mb-[6px] bg-lightBlue">
                  {isLiquidation ? (
                    <div className="bg-darkBlue px-5 pb-6 pt-[18px]">
                      <LiquidationWarning isFullLiquidation={getActionTypeFromApi(selectedRecord) === TradeActions.FULL_LIQ} />
                    </div>
                  ) : null}
                  {selectedRecord &&
                    detailRowMobile(
                      'Collection',
                      selectedRecord.ammAddress ? (
                        <TypeWithIconByAmm imageWidth={16} imageHeight={16} amm={selectedRecord.ammAddress} showCollectionName />
                      ) : (
                        '-'
                      )
                    )}
                  {(selectedRecord && detailRowMobile('Action', getActionTypeFromApi(selectedRecord))) || '-'}
                  {selectedRecord &&
                    detailRowMobile('Time', selectedRecord.timestamp ? formatDateTime(selectedRecord.timestamp, 'MM/DD/YYYY HH:mm') : '-')}
                  {selectedRecord &&
                    detailRowMobile('Execution Price', !selectedRecord.entryPrice ? '0.00' : selectedRecord.entryPrice.toFixed(2))}
                  {selectedRecord &&
                    detailRowMobile(
                      'Type',
                      <span className={typeClassName}>
                        {selectedRecord.exchangedPositionSize > 0 ? 'LONG' : selectedRecord.exchangedPositionSize < 0 ? 'SHORT' : '-.--'}
                      </span>
                    )}
                </div>
                <div className="bg-lightBlue">
                  {!isLiquidation && selectedRecord
                    ? detailRowMobile(
                        'Collateral Change',
                        <PriceWithIcon
                          priceValue={
                            selectedRecord.ammAddress ? `${Number(collateralChange) > 0 ? '+' : ''}${collateralChange}` : '--.--'
                          }>
                          {getActionTypeFromApi(selectedRecord) === TradeActions.REDUCE ? (
                            <MobileTooltip
                              direction="top"
                              content={
                                <>
                                  Partial close will not <br />
                                  free any collateral
                                </>
                              }>
                              <Image
                                src="/images/components/trade/history/more_info.svg"
                                alt=""
                                width={12}
                                height={12}
                                className="ml-[6px] mr-0"
                              />
                            </MobileTooltip>
                          ) : null}
                        </PriceWithIcon>
                      )
                    : selectedRecord
                    ? detailRowMobile(
                        'Resulting Collateral',
                        <PriceWithIcon priceValue={selectedRecord.ammAddress ? `${Number(collateralChange).toFixed(4)}` : '--.--'} />
                      )
                    : null}
                  {isLiquidation && selectedRecord
                    ? detailRowMobile(
                        'Resulting Contract Size',
                        selectedRecord.ammAddress ? (
                          <TypeWithIconByAmm imageWidth={16} imageHeight={16} amm={selectedRecord.ammAddress} content={contractSize} />
                        ) : (
                          '-'
                        )
                      )
                    : selectedRecord
                    ? detailRowMobile(
                        'Contract Size',
                        selectedRecord.ammAddress ? (
                          <TypeWithIconByAmm imageWidth={16} imageHeight={16} amm={selectedRecord.ammAddress} content={contractSize} />
                        ) : (
                          '-'
                        )
                      )
                    : null}
                  {isLiquidation
                    ? detailRowMobile('Resulting Notional', <PriceWithIcon priceValue={`${notionalChange}`} />)
                    : detailRowMobile(
                        'Notional Change',
                        <PriceWithIcon priceValue={`${Number(notionalChange) > 0 ? '+' : ''}${notionalChange}`} />
                      )}
                  {!isLiquidation ? detailRowMobile('Transaction Fee', <PriceWithIcon priceValue={fee} />) : null}
                  {isLiquidation ? <DetailRowWithPriceIconMobile label="Liquidation Penalty" content={liquidationPenalty} /> : null}
                </div>

                <div className="mt-[6px] bg-lightBlue">
                  {isFullClose ? <DetailRowWithPriceIconMobile label="Funding Payment" content={fundingPayment} /> : null}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div
        className="absolute bottom-0 flex h-[50px] w-full items-center justify-center
        bg-secondaryBlue px-[22px] py-4 text-[15px] text-white
      ">
        <Image
          src="/images/mobile/common/angle-right.svg"
          className="absolute left-[22px] cursor-pointer"
          width={14}
          height={14}
          alt=""
          onClick={handleBackClick}
        />
        <div className="flex">{!isShowDetail ? <>{/* currentCollectionName */} Trade History</> : 'Details'}</div>
      </div>
    </div>
  );
};

export default HistoryModal;
