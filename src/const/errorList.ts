/* eslint-disable max-len */

export const WETH_INSUFFICIENT = 'WETH_INSUFFICIENT';
const errorMsgList = {
  AMM_POFL:
    'Transaction will fail due to high price impact of the trade. To increase the chance of executing the transaction, please reduce the notional size of your trade.',
  CH_TMRL: 'Your transaction has failed due to high price fluctuation. Please increase your slippage tolerance or try again later.',
  CH_TMRS: 'Your transaction has failed due to high price fluctuation. Please increase your slippage tolerance or try again later.',
  CH_TLRL: 'Your transaction has failed due to high price fluctuation. Please increase your slippage tolerance or try again later.',
  CH_TLRS: 'Your transaction has failed due to high price fluctuation. Please increase your slippage tolerance or try again later.',
  CH_NW: 'Sorry your wallet address is not in the whitelist.',
  CH_BDP: 'Trade failed in execution due to bad debt incurred.',
  TH_STF: WETH_INSUFFICIENT,
  CH_MRNC: 'Resulting position DOES NOT meet the maintenance leverage requirement.',
  CH_MNE: 'New Collateral must be above Initial Collateral Requirement.',
  CH_FCNE: 'Your current collateral is below Initial Collateral Requirement, you can only add Collateral to prevent liquidation.',
  CH_AC: '',
  Arithmic:
    'Transaction will fail due to high price impact of the trade. To increase the chance of executing the transaction, please reduce the notional size of your trade.',
  'RPC Error': 'RPC Network Error',
  'User rejected the request': 'User rejected the request.'
};

export const formatError = (errorMsg: string) => {
  const errorKeys = Object.keys(errorMsgList).filter(key => errorMsg.includes(key));
  if (errorKeys.length > 0) {
    return errorMsgList[errorKeys[0] as keyof typeof errorMsgList];
  }
  return errorMsg;
};
