/* eslint-disable import/no-cycle */
import localforage from 'localforage';
import { atom } from 'nanostores';
import collectionList from '@/const/collectionList';
import { walletProvider } from '@/utils/walletProvider';

interface CollectionsLoadingData {
  [key: string]: boolean;
}

const collectionsLoading: any = atom<CollectionsLoadingData>({
  [collectionList[0]['amm']]: false,
  [collectionList[1]['amm']]: false,
  [collectionList[2]['amm']]: false,
  [collectionList[3]['amm']]: false,
  [collectionList[4]['amm']]: false,
  [collectionList[5]['amm']]: false
  // [collectionList[6]['amm']]: false
});

const setCollectionsLoading = async (collectionAdrr: string, txAdrr: boolean) => {
  const oldData = await collectionsLoading.get();
  const newData = { ...oldData };
  newData[collectionAdrr] = txAdrr;
  collectionsLoading.set(newData);
  await localforage.setItem('collectionsLoading', newData);
};

const getCollectionsLoading = async (collectionAmm?: string) => {
  let collectionsLoadingNew: CollectionsLoadingData = await collectionsLoading.get();
  const collectionsLoadingOld: CollectionsLoadingData = (await localforage.getItem('collectionsLoading')) || collectionsLoadingNew;

  if (collectionAmm) {
    if (collectionsLoadingOld[collectionAmm]) {
      collectionsLoadingNew = await walletProvider.getPendingTransactions(collectionsLoadingOld, collectionAmm);
    } else {
      collectionsLoadingNew = collectionsLoadingOld;
    }
  } else {
    collectionsLoadingNew = await walletProvider.getPendingTransactions(collectionsLoadingOld);
  }

  collectionsLoading.set(collectionsLoadingNew);
  await localforage.setItem('collectionsLoading', collectionsLoadingNew);
};

export default {
  collectionsLoading,
  setCollectionsLoading,
  getCollectionsLoading
};
