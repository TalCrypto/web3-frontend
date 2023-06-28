import { DAY_RESOLUTION, MONTH_RESOLUTION, WEEK_RESOLUTION } from '@/const';
import { AMM } from '@/const/collectionList';
import { OhlcData, Time } from 'lightweight-charts';
import { atom, computed, map } from 'nanostores';
import { Address } from 'wagmi';

export type TransactionPendings = {
  // eslint-disable-next-line no-unused-vars
  [value in AMM]?: boolean;
};

export interface ChartGraphRecord {
  round: number;
  avgPrice: number;
  open: number;
  close: number;
  start: number;
  end: number;
}

export interface FundingRatesRecord {
  amm: Address;
  timestamp: number;
  underlyingPrice: number;
  rateLong: number;
  rateShort: number;
  amountLong: number;
  amountShort: number;
}

export interface MarketHistoryRecord {
  ammAddress: string;
  timestamp: number;
  exchangedPositionSize: number;
  positionNotional: number;
  positionSizeAfter: number;
  liquidationPenalty: number;
  spotPrice: number;
  userAddress: Address;
  userId: string;
  txHash: string;
  isNew: boolean; // used for adding animation
}

export interface CollectionConfig {
  fundingPeriod: number;
  liqSwitchRatio: number;
  initMarginRatio: number;
  startPrice: number;
}

export const $vammPrice = atom<number | undefined>();
export const $oraclePrice = atom<number | undefined>();
export const $nextFundingTime = atom<number | undefined>();
export const $openInterests = atom<{ longRatio: number; shortRatio: number } | undefined>();
export const $fundingRates = atom<{ longRate: number; shortRate: number } | undefined>();

export const $currentAmm = atom<AMM | undefined>();

export const $transactionPendings = map<TransactionPendings>();

export const $collectionConfig = map<CollectionConfig>();

export const $futureMarketHistory = atom<MarketHistoryRecord[]>([]);

export const $fundingRatesHistory = atom<FundingRatesRecord[]>([]);

export const $spotMarketHistory = atom<any[]>([]);

export const $selectedTimeIndex = atom(0);

export const $graphData = atom<OhlcData[]>([]);

export const $priceChange = computed($graphData, graphData => {
  if (graphData && graphData.length > 0) {
    const basePrice = graphData[0].open;
    const nowPrice = graphData[graphData.length - 1].close;
    return nowPrice - basePrice;
  }
  return undefined;
});

export const $priceChangePct = computed($graphData, graphData => {
  if (graphData && graphData.length > 0) {
    const basePrice = graphData[0].open;
    const nowPrice = graphData[graphData.length - 1].close;
    return ((nowPrice - basePrice) / basePrice) * 100;
  }
  return undefined;
});

export const $lowPrice = computed($graphData, graphData => {
  if (graphData && graphData.length > 0) {
    let lowPrice = 0;
    graphData.forEach(({ low }) => {
      if (lowPrice === 0 || low < lowPrice) {
        lowPrice = low;
      }
    });
    return lowPrice;
  }
  return undefined;
});

export const $highPrice = computed($graphData, graphData => {
  if (graphData && graphData.length > 0) {
    let highPrice = 0;
    graphData.forEach(({ high }) => {
      if (high > highPrice) {
        highPrice = high;
      }
    });
    return highPrice;
  }
  return undefined;
});

export const $dailyVolume = atom<number | undefined>();

export function addGraphRecord(price?: number /* TODO , notionalValue?: number */) {
  const selectedTimeIndex = $selectedTimeIndex.get();
  const interval = selectedTimeIndex === 0 ? DAY_RESOLUTION : selectedTimeIndex === 1 ? WEEK_RESOLUTION : MONTH_RESOLUTION;
  const graphData = $graphData.get();
  if (graphData && graphData.length > 0) {
    const lastGraphRecord = graphData[graphData.length - 1];
    const nowTs = Math.round(new Date().getTime() / 1000);
    if (nowTs >= Number(lastGraphRecord.time) + interval) {
      if (price) {
        $graphData.set([
          ...graphData,
          {
            time: (Number(lastGraphRecord.time) + interval) as Time,
            open: price,
            high: price,
            low: price,
            close: price
          }
        ]);
      } else {
        $graphData.set([
          ...graphData,
          {
            time: (Number(lastGraphRecord.time) + interval) as Time,
            open: lastGraphRecord.close,
            high: lastGraphRecord.close,
            low: lastGraphRecord.close,
            close: lastGraphRecord.close
          }
        ]);
      }
    } else if (price) {
      const high = Math.max(price, lastGraphRecord.high);
      const low = Math.min(price, lastGraphRecord.low);
      const newRecord = {
        time: lastGraphRecord.time,
        open: lastGraphRecord.open,
        high,
        low,
        close: price
      };
      graphData.pop();
      $graphData.set([...graphData, newRecord]);
    }
  }
}

// mobile specialized stores
export const $isShowTradingMobile = atom(false);
