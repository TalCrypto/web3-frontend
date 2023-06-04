/* eslint-disable indent */
/* eslint-disable react/no-array-index-key */
/* eslint-disable operator-linebreak */
/* eslint-disable react-hooks/exhaustive-deps */

import { PriceWithIcon } from '@/components/common/PricWithIcon';
import { TypeWithIconByAmm } from '@/components/common/TypeWithIcon';
import { getTradingActionTypeFromAPI } from '@/components/trade/desktop/information/ActionType';
import collectionList from '@/const/collectionList';
import { firebaseAnalytics } from '@/const/firebaseConfig';
import { apiConnection } from '@/utils/apiConnection';
import { calculateNumber, formatterValue } from '@/utils/calculateNumbers';
import { BigNumber } from 'ethers';
import { logEvent } from 'firebase/analytics';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { formatDateTime } from '@/utils/date';
import { walletProvider } from '@/utils/walletProvider';
import { useStore as useNanostore } from '@nanostores/react';
import { wsHistoryGroupByMonth } from '@/stores/WalletState';

function ExplorerButton(props: any) {
  const { txHash, onClick } = props;
  return (
    <a href={`${process.env.NEXT_PUBLIC_TRANSACTIONS_DETAILS_URL}${txHash}`} onClick={onClick} target="_blank" rel="noreferrer">
      <Image alt="" src="/images/common/out.svg" width={24} height={24} />
    </a>
  );
}

function LiquidationWarning() {
  return (
    <div className="liquidation-warning">
      <Image src="../../../static/dashboard_notice.svg" alt="" className="icon" width={24} height={24} />
      Your position has been liquidated because it no longer meet the collateral requirement.
    </div>
  );
}

function DetailRowWithPriceIcon(props: any) {
  const { label, content } = props;
  const numberVal = Number(content);
  return (
    <div className="mb-6 flex justify-between text-[14px]">
      <div className="">{label}</div>
      <div className="text-white">
        <PriceWithIcon className={`icon-label ${numberVal > 0 ? 'plus' : numberVal < 0 ? 'minus' : ''}`} priceValue={content} />
      </div>
    </div>
  );
}

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

const HistoryModal = (props: any) => {
  const { setShowHistoryModal } = props;
  const fullWalletAddress = walletProvider.holderAddress;
  const historyRecordsByMonth = useNanostore(wsHistoryGroupByMonth);

  const [selectedRecord, setSelectedRecord] = useState(defaultSelectedRecord);

  const hide = () => {
    setShowHistoryModal(false);
  };

  useEffect(() => {
    const recordMonths: any = Object.keys(historyRecordsByMonth);
    if (recordMonths.length > 0) {
      const record = historyRecordsByMonth[recordMonths[0]]?.[0];
      setSelectedRecord(record);
    }
  }, [historyRecordsByMonth]);

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

  const detailRow = (label: any, content: any) => (
    <div className="mt-6 flex justify-between text-[14px]">
      <div className="">{label}</div>
      <div className="text-white">{content}</div>
    </div>
  );

  // detail data, selected record
  const tradeType = getTradingActionTypeFromAPI(selectedRecord);
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

  const logTradeButton = (e: any, txHash: any, amm: any) => {
    if (!selectedRecord) {
      e.preventDefault();
      return;
    }

    const filtering = collectionList.filter((item: any) => item.amm.toUpperCase() === amm.toUpperCase());
    const logCollection = filtering[0].collection;
    if (firebaseAnalytics) {
      logEvent(firebaseAnalytics, 'dashboard_position_view_history_etherscan_pressed', {
        wallet: fullWalletAddress.substring(2),
        transaction: txHash.substring(2),
        collection: logCollection
      });
    }

    apiConnection.postUserEvent('dashboard_position_view_history_etherscan_pressed', {
      page: 'Dashboard',
      transaction: txHash.substring(2),
      collection: logCollection
    });
  };

  return (
    <div
      className="fixed inset-0 z-10 flex h-screen
        items-center justify-center overflow-auto bg-black bg-opacity-40"
      onClick={hide}>
      <div
        className="relative mx-auto flex h-[600px] w-[830px] overflow-hidden
          border-[1px] border-[#71aaff38] bg-secondaryBlue"
        onClick={e => {
          e.stopPropagation();
        }}>
        {Object.keys(historyRecordsByMonth).length === 0 ? (
          <div className="w-full">
            <div className="flex justify-between px-6 py-[27px] text-[12px]">
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
            <div className="h-full w-[450px] bg-[#0c0d20]">
              <div className="flex justify-between px-6 py-[27px] text-[12px]">
                <div className="flex text-[16px] font-semibold text-white">
                  <Image className="mr-[6px]" src="/images/components/trade/position/history_title.svg" width={20} height={20} alt="" />
                  <span>Trade History</span>
                </div>
              </div>
              <div className="h-[500px] overflow-auto p-1">
                {Object.keys(historyRecordsByMonth).map((month: any) => {
                  const records: any = historyRecordsByMonth[month];
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
                        {records.map((record: any, idx: any) => {
                          const currentRecordType = getTradingActionTypeFromAPI(record);
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
                              ? -Math.abs(
                                  Number(calculateNumber(recordAmount.add(recordFee).add(recordRealizedFundingPayment), 4))
                                ).toFixed(4)
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
                                px-6 py-[10px] text-highEmphasis
                                ${record.timestamp === selectedRecord.timestamp ? 'bg-secondaryBlue' : ''}`}
                              onClick={() => {
                                setSelectedRecord(defaultSelectedRecord);
                                setSelectedRecord(record);
                              }}>
                              <div className="flex max-w-[75%]">
                                <div className="mr-2 w-[2px] rounded-[2px] bg-primaryBlue" />
                                <div className="flex flex-col">
                                  <span className="text-[12px] text-mediumEmphasis">
                                    {formatDateTime(record.timestamp, 'MM/DD/YYYY HH:mm')}
                                  </span>
                                  <span>
                                    <TypeWithIconByAmm
                                      className="icon-label"
                                      amm={record.ammAddress}
                                      showCollectionName
                                      content={` - ${currentRecordType}`}
                                    />
                                  </span>
                                </div>
                              </div>
                              <div
                                className="flex flex-col items-end justify-between text-end
                                  text-[14px] text-mediumEmphasis">
                                <span className="title">Wallet Balance</span>
                                <PriceWithIcon
                                  className={`icon-label ${Number(balance) > 0 ? 'plus' : Number(balance) < 0 ? 'text-marketRed' : ''}`}
                                  priceValue={`${Number(balance) > 0 ? '+' : ''}${
                                    Number(balance) === 0 ? '--.--' : Number(balance).toFixed(4)
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
                <ExplorerButton
                  className="mr-[6px]"
                  txHash={selectedRecord.txHash}
                  onClick={(e: any) => logTradeButton(e, selectedRecord.txHash, selectedRecord.ammAddress)}
                />
              </div>
              {isLiquidation ? <LiquidationWarning /> : null}
              <div className="p-3 text-mediumEmphasis">
                {detailRow(
                  'Collection',
                  selectedRecord.ammAddress ? (
                    <TypeWithIconByAmm className="icon-label" amm={selectedRecord.ammAddress} showCollectionName />
                  ) : (
                    '-'
                  )
                )}
                {detailRow('Action', getTradingActionTypeFromAPI(selectedRecord)) || '-'}
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
                {!isLiquidation
                  ? detailRow(
                      'Collateral Change',
                      <PriceWithIcon
                        className="icon-label"
                        priceValue={selectedRecord.ammAddress ? `${Number(collateralChange) > 0 ? '+' : ''}${collateralChange}` : '--.--'}>
                        {getTradingActionTypeFromAPI(selectedRecord) === 'Partial Close' ? (
                          // <OverlayTrigger placement="top" overlay={<Tooltip>Collateral will not change.</Tooltip>}>
                          <Image
                            src="/static/moreInfo.svg"
                            alt=""
                            style={{ marginLeft: '6px', width: '16px', height: '16px', marginRight: '0px' }}
                          />
                        ) : // </OverlayTrigger>
                        null}
                      </PriceWithIcon>
                    )
                  : detailRow(
                      'Resulting Collateral',
                      <PriceWithIcon className="icon-label" priceValue={selectedRecord.ammAddress ? `${collateralChange}` : '--.--'} />
                    )}
                {isLiquidation
                  ? detailRow(
                      'Resulting Contract Size',
                      selectedRecord.ammAddress ? (
                        <TypeWithIconByAmm className="icon-label" amm={selectedRecord.ammAddress} content={contractSize} />
                      ) : (
                        '-'
                      )
                    )
                  : detailRow(
                      'Contract Size',
                      selectedRecord.ammAddress ? (
                        <TypeWithIconByAmm className="icon-label" amm={selectedRecord.ammAddress} content={contractSize} />
                      ) : (
                        '-'
                      )
                    )}
                {isLiquidation
                  ? detailRow('Resulting Notional', <PriceWithIcon className="icon-label" priceValue={`${notionalChange}`} />)
                  : detailRow(
                      'Notional Change',
                      <PriceWithIcon className="icon-label" priceValue={`${Number(notionalChange) > 0 ? '+' : ''}${notionalChange}`} />
                    )}
                {!isLiquidation ? detailRow('Transaction Fee', <PriceWithIcon className="icon-label" priceValue={fee} />) : null}
                {isLiquidation ? <DetailRowWithPriceIcon label="Liquidation Penalty" content={liquidationPenalty} /> : null}
                {isFullClose ? <DetailRowWithPriceIcon label="Funding Payment" content={fundingPayment} /> : null}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HistoryModal;
