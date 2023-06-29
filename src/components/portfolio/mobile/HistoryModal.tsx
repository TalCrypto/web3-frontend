/* eslint-disable indent */
/* eslint-disable react/no-array-index-key */
/* eslint-disable operator-linebreak */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { BigNumber } from 'ethers';
import { calculateNumber, formatterValue } from '@/utils/calculateNumbers';
import { TypeWithIconByAmm } from '@/components/common/TypeWithIcon';
import Image from 'next/image';
import { formatDateTime } from '@/utils/date';
import { useStore as useNanostore } from '@nanostores/react';
import { $psHistoryRecordsByMonth, $psShowHistory } from '@/stores/portfolio';
import MobileTooltip from '@/components/common/mobile/Tooltip';
import { PriceWithIcon } from '@/components/common/PriceWithIcon';
import { ExplorerButton, LiquidationWarning } from '@/components/common/LabelsComponents';
import { $isShowMobileModal } from '@/stores/modal';
import { getTradingActionType } from '@/utils/actionType';

const defaultSelectedRecord = {
  exchangedPositionSize: 0,
  ammAddress: '',
  entryPrice: '',
  timestamp: 0,
  txHash: '',
  totalFundingPayment: '',
  amount: '',
  realizedPnl: '',
  fundingPayment: '',
  positionNotional: '',
  notionalChange: '',
  collateralChange: 0,
  margin: '',
  liquidationPenalty: '',
  openNotional: '',
  fee: '',
  positionSizeAfter: ''
};

const HistoryModal = () => {
  const historyRecordsByMonth = useNanostore($psHistoryRecordsByMonth);

  const [selectedRecord, setSelectedRecord]: any = useState(defaultSelectedRecord);
  const [isShowDetail, setIsShowDetail] = useState(false);
  const [selectedBalance, setSelectedBalance] = useState('');
  const showHistoryModal = useNanostore($psShowHistory);

  useEffect(() => {
    const recordMonths: any = Object.keys(historyRecordsByMonth);
    if (recordMonths.length > 0) {
      const record = historyRecordsByMonth[recordMonths[0]]?.[0];
      setSelectedRecord(record);
    }
  }, [historyRecordsByMonth]);

  const detailRow = (label: any, content: any) => (
    <div className="flex justify-between border-t-[1px] border-t-secondaryBlue px-5 py-3 text-[14px]">
      <div className="">{label}</div>
      <div className="text-white">{content}</div>
    </div>
  );

  // detail data, selected record
  const tradeType = getTradingActionType(selectedRecord);
  const isFundingPaymentRecord = tradeType === 'Full Close' || tradeType === 'Full Liquidation';
  const isLiquidation = tradeType === 'Partial Liquidation' || tradeType === 'Full Liquidation';
  const isAdjustCollateral = tradeType === 'Add Collateral' || tradeType === 'Reduce Collateral';
  const isFullClose = tradeType === 'Full Close';
  const typeClassName =
    Number(formatterValue(selectedRecord.exchangedPositionSize, 4)) > 0
      ? 'text-marketGreen'
      : Number(formatterValue(selectedRecord.exchangedPositionSize, 4)) < 0
      ? 'text-marketRed'
      : '';

  const amountNumber = !selectedRecord.amount ? BigNumber.from(0) : BigNumber.from(selectedRecord.amount);
  const realizedPnlNumber = !selectedRecord.realizedPnl ? BigNumber.from(0) : BigNumber.from(selectedRecord.realizedPnl);
  const fundingPaymentNumber = !selectedRecord.fundingPayment ? BigNumber.from(0) : BigNumber.from(selectedRecord.fundingPayment);
  const positionNotionalNumber = !selectedRecord.positionNotional ? BigNumber.from(0) : BigNumber.from(selectedRecord.positionNotional);
  const notionalChangeNumber = !selectedRecord.notionalChange ? BigNumber.from(0) : BigNumber.from(selectedRecord.notionalChange);
  const collateralChangeNumber = !selectedRecord.collateralChange ? BigNumber.from(0) : BigNumber.from(selectedRecord.collateralChange);
  const marginNumber = !selectedRecord.margin ? BigNumber.from(0) : BigNumber.from(selectedRecord.margin);
  const liquidationPenaltyNumber = !selectedRecord.liquidationPenalty
    ? BigNumber.from(0)
    : BigNumber.from(selectedRecord.liquidationPenalty);
  const openNotionalNumber = !selectedRecord.positionNotional ? BigNumber.from(0) : BigNumber.from(selectedRecord.openNotional);

  const collateralChange =
    tradeType === 'Partial Close'
      ? '-.--'
      : isLiquidation
      ? Number(calculateNumber(marginNumber, 4))
      : isFundingPaymentRecord
      ? -Number(calculateNumber(amountNumber.abs().add(realizedPnlNumber).sub(fundingPaymentNumber), 4))
      : isAdjustCollateral
      ? Number(calculateNumber(collateralChangeNumber.add(fundingPaymentNumber), 4))
      : formatterValue(selectedRecord.collateralChange, 4);
  const fundingPayment =
    selectedRecord.totalFundingPayment === '0' ? '0.0000' : Number(calculateNumber(selectedRecord.totalFundingPayment, 4));
  const fee = isLiquidation || isAdjustCollateral ? '-.--' : Math.abs(Number(calculateNumber(selectedRecord.fee, 6)));
  const contractSize =
    !selectedRecord || isAdjustCollateral
      ? '-.--'
      : isLiquidation
      ? Math.abs(Number(calculateNumber(selectedRecord.positionSizeAfter, 4)))
      : Math.abs(Number(calculateNumber(selectedRecord.exchangedPositionSize, 4)));
  const notionalChange = isAdjustCollateral
    ? '-.--'
    : isLiquidation
    ? Number(calculateNumber(openNotionalNumber, 4))
    : isFundingPaymentRecord
    ? -Number(calculateNumber(positionNotionalNumber.sub(realizedPnlNumber), 4)).toFixed(4)
    : Number(calculateNumber(notionalChangeNumber.sub(realizedPnlNumber), 4)).toFixed(4);
  const liquidationPenalty = isLiquidation ? -Number(calculateNumber(liquidationPenaltyNumber, 4)) : '-.--';

  const handleBackClick = () => {
    if (isShowDetail) {
      setIsShowDetail(false);
    } else {
      $psShowHistory.set(false);
      $isShowMobileModal.set(false);
    }
  };

  const onClickRow = (record: any) => {
    setSelectedRecord(defaultSelectedRecord);
    setSelectedRecord(record);
    setIsShowDetail(true);

    const currentRecordType = getTradingActionType(record);
    const recordAmount = BigNumber.from(record.amount).abs();
    const recordFee = !record.fee ? BigNumber.from(0) : BigNumber.from(record.fee);
    const recordRealizedPnl = !record.realizedPnl ? BigNumber.from(0) : BigNumber.from(record.realizedPnl);
    const recordRealizedFundingPayment = !record.fundingPayment ? BigNumber.from(0) : BigNumber.from(record.fundingPayment);
    const recordCollateralChange = !record.collateralChange ? BigNumber.from(0) : BigNumber.from(record.collateralChange);
    const balance: any =
      currentRecordType === 'Open' || currentRecordType === 'Add' || currentRecordType === 'Add Collateral'
        ? -Math.abs(Number(calculateNumber(recordAmount.add(recordFee).add(recordRealizedFundingPayment), 4))).toFixed(4)
        : currentRecordType === 'Reduce Collateral'
        ? Math.abs(Number(calculateNumber(recordCollateralChange.add(recordRealizedFundingPayment), 4))).toFixed(4)
        : currentRecordType === 'Full Close'
        ? Math.abs(
            Number(calculateNumber(recordAmount.add(recordRealizedPnl).sub(recordFee).sub(recordRealizedFundingPayment), 4))
          ).toFixed(4)
        : -Math.abs(Number(calculateNumber(record.fee, 4))).toFixed(4);
    setSelectedBalance(balance);
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
        {Object.keys(historyRecordsByMonth).length === 0 ? (
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
                {Object.keys(historyRecordsByMonth).map((month: any) => {
                  const records: any = historyRecordsByMonth[month];
                  return (
                    <div id={`group-${month}`} key={`group-${month}`} className="collapsible">
                      {records.map((record: any, idx: any) => {
                        const currentRecordType = getTradingActionType(record);
                        const recordAmount = BigNumber.from(record.amount).abs();
                        const recordFee = !record.fee ? BigNumber.from(0) : BigNumber.from(record.fee);
                        const recordRealizedPnl = !record.realizedPnl ? BigNumber.from(0) : BigNumber.from(record.realizedPnl);
                        const recordRealizedFundingPayment = !record.fundingPayment
                          ? BigNumber.from(0)
                          : BigNumber.from(record.fundingPayment);
                        const recordCollateralChange = !record.collateralChange
                          ? BigNumber.from(0)
                          : BigNumber.from(record.collateralChange);
                        const balance =
                          currentRecordType === 'Open' || currentRecordType === 'Add' || currentRecordType === 'Add Collateral'
                            ? -Math.abs(Number(calculateNumber(recordAmount.add(recordFee).add(recordRealizedFundingPayment), 4))).toFixed(
                                4
                              )
                            : currentRecordType === 'Reduce Collateral'
                            ? Math.abs(Number(calculateNumber(recordCollateralChange.add(recordRealizedFundingPayment), 4))).toFixed(4)
                            : currentRecordType === 'Full Close'
                            ? Math.abs(
                                Number(
                                  calculateNumber(recordAmount.add(recordRealizedPnl).sub(recordFee).sub(recordRealizedFundingPayment), 4)
                                )
                              ).toFixed(4)
                            : -Math.abs(Number(calculateNumber(record.fee, 4))).toFixed(4);
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
                                <span className="text-[12px] text-mediumEmphasis">
                                  {formatDateTime(record.timestamp, 'MM/DD/YYYY HH:mm')}
                                </span>
                                <span>
                                  <TypeWithIconByAmm amm={record.ammAddress} showCollectionName content={` - ${currentRecordType}`} />
                                </span>
                              </div>
                            </div>
                            <div
                              className="flex flex-col items-end justify-between text-end
                                  text-[14px] text-mediumEmphasis">
                              <span className="title">Wallet Balance</span>
                              <PriceWithIcon
                                className={`${Number(balance) > 0 ? 'text-marketGreen' : Number(balance) < 0 ? 'text-marketRed' : ''}`}
                                priceValue={`${Number(balance) > 0 ? '+' : ''}${
                                  Number(balance) === 0 ? '--.--' : Number(balance).toFixed(4)
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
                    bg-lightBlue px-5 py-6 text-[16px] text-highEmphasis">
                <div>
                  <span>Wallet Balance</span>
                  <PriceWithIcon
                    className={`
                      text-[20px] font-semibold
                      ${Number(selectedBalance) > 0 ? 'text-marketGreen' : Number(selectedBalance) < 0 ? 'text-marketRed' : ''}
                    `}
                    width={22}
                    height={22}
                    priceValue={`${Number(selectedBalance) > 0 ? '+' : ''}${
                      Number(selectedBalance) === 0 ? '--.--' : Number(selectedBalance).toFixed(4)
                    }`}
                  />
                </div>
                <ExplorerButton txHash={selectedRecord.txHash} />
              </div>
              <div className="text-mediumEmphasis">
                <div className="mb-[6px]  bg-lightBlue">
                  {isLiquidation ? <LiquidationWarning /> : null}
                  {detailRow(
                    'Collection',
                    selectedRecord.ammAddress ? <TypeWithIconByAmm amm={selectedRecord.ammAddress} showCollectionName /> : '-'
                  )}
                  {detailRow('Action', getTradingActionType(selectedRecord)) || '-'}
                  {detailRow('Time', selectedRecord.timestamp ? formatDateTime(selectedRecord.timestamp, 'MM/DD/YYYY HH:mm') : '-')}
                  {detailRow(
                    'Entry Price',
                    selectedRecord.entryPrice === 'NaN' || selectedRecord.entryPrice === 'Infinity' || !selectedRecord.entryPrice
                      ? '0.00'
                      : Number(formatterValue(Number(BigNumber.from(selectedRecord.entryPrice)), 2)).toFixed(2)
                  )}
                  {detailRow(
                    'Type',
                    <span className={typeClassName}>
                      {Number(formatterValue(selectedRecord.exchangedPositionSize, 4)) > 0
                        ? 'LONG'
                        : Number(formatterValue(selectedRecord.exchangedPositionSize, 4)) < 0
                        ? 'SHORT'
                        : '-.--'}
                    </span>
                  )}
                </div>
                <div className="bg-lightBlue">
                  {!isLiquidation
                    ? detailRow(
                        'Collateral Change',
                        <PriceWithIcon
                          priceValue={
                            selectedRecord.ammAddress ? `${Number(collateralChange) > 0 ? '+' : ''}${collateralChange}` : '--.--'
                          }>
                          {getTradingActionType(selectedRecord) === 'Partial Close' ? (
                            <MobileTooltip content="Collateral will not change.">
                              <Image
                                src="/images/components/trade/history/more_info.svg"
                                alt=""
                                width={16}
                                height={16}
                                className="ml-[6px] mr-0"
                              />
                            </MobileTooltip>
                          ) : null}
                        </PriceWithIcon>
                      )
                    : detailRow(
                        'Resulting Collateral',
                        <PriceWithIcon priceValue={selectedRecord.ammAddress ? `${collateralChange}` : '--.--'} />
                      )}
                  {isLiquidation
                    ? detailRow(
                        'Resulting Contract Size',
                        selectedRecord.ammAddress ? <TypeWithIconByAmm amm={selectedRecord.ammAddress} content={contractSize} /> : '-'
                      )
                    : detailRow(
                        'Contract Size',
                        selectedRecord.ammAddress ? <TypeWithIconByAmm amm={selectedRecord.ammAddress} content={contractSize} /> : '-'
                      )}
                  {isLiquidation
                    ? detailRow('Resulting Notional', <PriceWithIcon priceValue={`${notionalChange}`} />)
                    : detailRow(
                        'Notional Change',
                        <PriceWithIcon priceValue={`${Number(notionalChange) > 0 ? '+' : ''}${notionalChange}`} />
                      )}
                  {!isLiquidation ? detailRow('Transaction Fee', <PriceWithIcon priceValue={fee} />) : null}
                  {isLiquidation ? detailRow('Liquidation Penalty', <PriceWithIcon priceValue={liquidationPenalty} />) : null}
                  {isFullClose ? detailRow('Funding Payment', <PriceWithIcon priceValue={fundingPayment} />) : null}
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
        <div className="flex">{!isShowDetail ? <>Trade History</> : 'Details'}</div>
      </div>
    </div>
  );
};

export default HistoryModal;
