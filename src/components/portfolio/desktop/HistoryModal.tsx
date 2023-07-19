/* eslint-disable indent */
/* eslint-disable react/no-array-index-key */
/* eslint-disable operator-linebreak */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { TypeWithIconByAmm } from '@/components/common/TypeWithIcon';
import Image from 'next/image';
import { formatDateTime } from '@/utils/date';
import Tooltip from '@/components/common/Tooltip';
import { $psShowHistory } from '@/stores/portfolio';
import { DetailRowWithPriceIcon, ExplorerButton, LiquidationWarning, detailRow } from '@/components/common/LabelsComponents';
import { PriceWithIcon } from '@/components/common/PriceWithIcon';
import { getActionTypeFromApi, getWalletBalanceChange } from '@/utils/actionType';
import { usePsHistoryByMonth } from '@/hooks/psHistory';
import { PositionHistoryRecord } from '@/stores/user';
import { CollateralActions, TradeActions } from '@/const';

const HistoryModal = () => {
  const { psHistoryByMonth } = usePsHistoryByMonth();
  const [selectedRecord, setSelectedRecord] = useState<PositionHistoryRecord>();

  const hide = () => {
    $psShowHistory.set(false);
  };

  useEffect(() => {
    const recordMonths: Array<string> = Object.keys(psHistoryByMonth);
    if (recordMonths.length > 0) {
      const record = psHistoryByMonth[recordMonths[0]]?.[0];
      setSelectedRecord(record);
    }
  }, [psHistoryByMonth]);

  const toggleCollapse = (id: any, imageId: any) => {
    const modal = document.getElementById(id);
    const image = document.getElementById(imageId);
    if (modal) {
      modal.classList.toggle('hidden');
    }
    if (image) {
      image.classList.toggle('not-extended');
    }
  };

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
  const fee = isLiquidation || isAdjustCollateral || !selectedRecord ? '-.--' : selectedRecord.fee.toFixed(6);
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

  return (
    <div
      className="fixed inset-0 z-10 flex h-screen
        items-center justify-center overflow-auto bg-black bg-opacity-40"
      onClick={hide}>
      <div
        className="relative mx-auto flex h-[600px] w-[830px]
          rounded-[12px] border-[1px] border-[#71aaff38] bg-secondaryBlue"
        onClick={e => {
          e.stopPropagation();
        }}>
        {Object.keys(psHistoryByMonth).length === 0 ? (
          <div className="w-full">
            <div className="flex justify-between rounded-[12px] px-6 py-[27px] text-[12px]">
              <div className="flex text-[16px] font-semibold text-white">
                <Image className="mr-[6px]" src="/images/components/trade/position/history_title.svg" width={20} height={20} alt="" />
                <span>Trade History</span>
              </div>
              <div className="flex flex-row items-center justify-end">
                <Image
                  src="/images/components/common/modal/close.svg"
                  width={20}
                  height={20}
                  alt=""
                  className="cursor-pointer"
                  onClick={hide}
                />
              </div>
            </div>
            <div className="overflow-auto p-1 text-center">You have no history records.</div>
          </div>
        ) : (
          <>
            <div className="h-full w-[450px] rounded-l-[12px] bg-darkBlue">
              <div className="flex justify-between px-6 py-[27px] text-[12px]">
                <div className="flex text-[16px] font-semibold text-white">
                  <Image className="mr-[6px]" src="/images/components/trade/position/history_title.svg" width={20} height={20} alt="" />
                  <span>Trade History</span>
                </div>
              </div>
              <div className="scrollable h-[500px] overflow-auto p-1">
                {Object.keys(psHistoryByMonth).map((month: any) => {
                  const records: any = psHistoryByMonth[month];
                  return (
                    <div key={`group-${month}`} className="mb-1 bg-lightBlue">
                      <div
                        className="flex justify-between
                        border-b-[1px] border-b-secondaryBlue px-[10px]
                        py-[10px] text-[12px] text-white">
                        <span>{month}</span>
                        <Image
                          className="cursor-pointer"
                          src="/images/components/trade/history/drop_down.svg"
                          id={`direction-image-${month}`}
                          width={20}
                          height={20}
                          alt=""
                          onClick={() => {
                            toggleCollapse(`group-${month}`, `direction-image-${month}`);
                          }}
                        />
                      </div>
                      <div id={`group-${month}`} className="collapsible">
                        {records.map((record: PositionHistoryRecord, idx: any) => {
                          const currentRecordType = getActionTypeFromApi(record);
                          const balance = getWalletBalanceChange(record);
                          return (
                            <div
                              key={`item-${idx}-${record.timestamp}`}
                              className={`flex cursor-pointer justify-between
                                border-b-[1px] border-b-secondaryBlue 
                                px-6 py-[10px] text-highEmphasis
                                ${selectedRecord && record.timestamp === selectedRecord.timestamp ? 'bg-secondaryBlue' : ''}`}
                              onClick={() => {
                                setSelectedRecord(record);
                              }}>
                              <div className="flex max-w-[75%]">
                                <div className="mr-2 w-[2px] rounded-[2px] bg-primaryBlue" />
                                <div className="flex flex-col">
                                  <span className="text-[12px] text-mediumEmphasis">
                                    {formatDateTime(record.timestamp, 'MM/DD/YYYY HH:mm')}
                                  </span>
                                  <span className="mt-[10px] text-[14px] font-normal">
                                    <TypeWithIconByAmm
                                      amm={record.ammAddress}
                                      showCollectionName
                                      imageWidth={20}
                                      imageHeight={20}
                                      content={
                                        <div className="flex">
                                          &nbsp;- {currentRecordType}
                                          {currentRecordType === TradeActions.FULL_LIQ || currentRecordType === TradeActions.PARTIAL_LIQ ? (
                                            <Image
                                              className="ml-1"
                                              src="/images/common/alert/alert_red.svg"
                                              width={16}
                                              height={16}
                                              alt=""
                                            />
                                          ) : (
                                            ''
                                          )}
                                        </div>
                                      }
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
                                    Number(balance) === 0 ? '-.--' : Number(balance).toFixed(4)
                                  }`}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex-1 p-6">
              <div className="flex flex-row items-center justify-end">
                <Image
                  src="/images/components/common/modal/close.svg"
                  width={16}
                  height={16}
                  alt=""
                  onClick={() => {
                    hide();
                  }}
                  className="cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-center text-[16px] text-highEmphasis">
                <span>Details</span>
                {selectedRecord && <ExplorerButton className="mr-[6px]" txHash={selectedRecord.txHash} />}
              </div>
              {isLiquidation ? (
                <div className="mt-9">
                  <LiquidationWarning isFullLiquidation={getActionTypeFromApi(selectedRecord) === TradeActions.FULL_LIQ} />
                </div>
              ) : null}
              <div className="p-3 text-mediumEmphasis">
                {selectedRecord &&
                  detailRow(
                    'Collection',
                    selectedRecord.amm ? (
                      <TypeWithIconByAmm imageWidth={20} imageHeight={20} amm={selectedRecord.amm} showCollectionName />
                    ) : (
                      '-'
                    )
                  )}
                {(selectedRecord && detailRow('Action', getActionTypeFromApi(selectedRecord))) || '-'}
                {selectedRecord &&
                  detailRow('Time', selectedRecord.timestamp ? formatDateTime(selectedRecord.timestamp, 'MM/DD/YYYY HH:mm') : '-')}
                {selectedRecord &&
                  detailRow(
                    'Execution Price',
                    <PriceWithIcon
                      width={20}
                      height={20}
                      priceValue={!selectedRecord.entryPrice ? '0.00' : selectedRecord.entryPrice.toFixed(2)}
                    />
                  )}
                {selectedRecord &&
                  detailRow(
                    'Type',
                    <span className={typeClassName}>
                      {selectedRecord.exchangedPositionSize > 0 ? 'LONG' : selectedRecord.exchangedPositionSize < 0 ? 'SHORT' : '-.--'}
                    </span>
                  )}
                {!isLiquidation && selectedRecord
                  ? detailRow(
                      'Collateral Change',
                      <PriceWithIcon
                        width={20}
                        height={20}
                        priceValue={selectedRecord.ammAddress ? `${Number(collateralChange) > 0 ? '+' : ''}${collateralChange}` : '-.--'}>
                        {getActionTypeFromApi(selectedRecord) === TradeActions.REDUCE ? (
                          <Tooltip
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
                              width={16}
                              height={16}
                              className="ml-[6px] cursor-pointer"
                            />
                          </Tooltip>
                        ) : // </OverlayTrigger>
                        null}
                      </PriceWithIcon>
                    )
                  : selectedRecord
                  ? detailRow(
                      'Resulting Collateral',
                      <PriceWithIcon
                        width={20}
                        height={20}
                        priceValue={selectedRecord.ammAddress ? `${Number(collateralChange).toFixed(4)}` : '-.--'}
                      />
                    )
                  : null}
                {isLiquidation && selectedRecord
                  ? detailRow(
                      'Resulting Contract Size',
                      selectedRecord.ammAddress ? (
                        <TypeWithIconByAmm imageWidth={20} imageHeight={20} amm={selectedRecord.ammAddress} content={contractSize} />
                      ) : (
                        '-'
                      )
                    )
                  : selectedRecord
                  ? detailRow(
                      'Contract Size',
                      selectedRecord.ammAddress ? (
                        <TypeWithIconByAmm imageWidth={20} imageHeight={20} amm={selectedRecord.ammAddress} content={contractSize} />
                      ) : (
                        '-'
                      )
                    )
                  : null}
                {isLiquidation && selectedRecord
                  ? detailRow('Resulting Notional', <PriceWithIcon width={20} height={20} priceValue={`${notionalChange}`} />)
                  : detailRow(
                      'Notional Change',
                      <PriceWithIcon width={20} height={20} priceValue={`${Number(notionalChange) > 0 ? '+' : ''}${notionalChange}`} />
                    )}
                {!isLiquidation && selectedRecord
                  ? detailRow('Transaction Fee', <PriceWithIcon width={20} height={20} priceValue={fee} />)
                  : null}
                {isLiquidation && selectedRecord ? (
                  <DetailRowWithPriceIcon label="Liquidation Penalty" content={liquidationPenalty} />
                ) : null}
                {isFullClose && selectedRecord ? <DetailRowWithPriceIcon label="Funding Payment" content={fundingPayment} /> : null}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HistoryModal;
