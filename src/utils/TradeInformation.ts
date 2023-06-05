import collectionList from '@/const/collectionList';
import { getMarketHistory, getFundingPaymentHistory } from '@/utils/trading';
import { getBaycFromMainnet } from '@/utils/opensea';

import { tsMarketHistory, tsFundingPaymentHistory, tsSportPriceList } from '@/stores/TradeInformation';

function getCollectionInformation(type: any) {
  const targetCollection = collectionList.filter(({ collection }) => collection.toUpperCase() === type.toUpperCase());
  return targetCollection.length !== 0 ? targetCollection[0] : collectionList[0];
}

const fetchMarketHistory = async (currentToken: any) => {
  await getMarketHistory(getCollectionInformation(currentToken).amm)
    .then((data: any) => {
      tsMarketHistory.set(data);
    })
    .catch(() => tsMarketHistory.set([]));
};

const fetchFundingPaymentHistory = async (currentToken: any) => {
  await getFundingPaymentHistory(getCollectionInformation(currentToken).amm)
    .then((data: any) => {
      tsFundingPaymentHistory.set(data);
    })
    .catch(() => tsFundingPaymentHistory.set([]));
};

const fetchSpotPriceList = async (currentToken: any) => {
  await getBaycFromMainnet(getCollectionInformation(currentToken).contract)
    .then((data: any) => {
      tsSportPriceList.set(data);
    })
    .catch(() => tsSportPriceList.set([]));
};

export const updateTradeInformation = (currentToken: any): void => {
  fetchMarketHistory(currentToken);
  fetchFundingPaymentHistory(currentToken);
  fetchSpotPriceList(currentToken);
};
