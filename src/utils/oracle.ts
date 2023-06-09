/* eslint-disable import/no-cycle */
import { ethers } from 'ethers';
import collectionList from '../const/collectionList';

const url: string = process.env.NEXT_PUBLIC_WSS_PROVIDER_URL ?? '';
const wssProvider = new ethers.providers.WebSocketProvider(url);
const ammABI = require('@/const/abi/amm.json');

export const getLatestTwapPrice = async (nftAddr: string): Promise<number> => {
  const filterCollection = collectionList.filter(item => item.contract === nftAddr);
  const currentAmm = filterCollection.length > 0 ? filterCollection[0].amm : collectionList[0].amm;
  const ammInstance = new ethers.Contract(currentAmm, ammABI, wssProvider);
  const oraclePrice = await ammInstance.getUnderlyingPrice();

  return oraclePrice;
};
