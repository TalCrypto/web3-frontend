const errorMsgList = {
  AMM_POFL: 'Please try with smaller notional value.',
  CH_TMRL: 'Your transaction has failed due to high price fluctuation. Please increase your slippage tolerance or try again later.',
  CH_TMRS: 'Your transaction has failed due to high price fluctuation. Please increase your slippage tolerance or try again later.',
  CH_TLRL: 'Your transaction has failed due to high price fluctuation. Please increase your slippage tolerance or try again later.',
  CH_TLRS: 'Your transaction has failed due to high price fluctuation. Please increase your slippage tolerance or try again later.',
  CH_NW: 'Sorry your wallet address is not in the whitelist.',
  CH_MRNC: 'Trade failed to be executed as resulting margin ratio does not meet requirement.',
  CH_BDP: 'Trade failed to be executed due to bad debt incurred.',
  TH_STF: 'Insufficient WETH balance'
};

export const formatError = (errorMsg: string) => {
  const errorKeys = Object.keys(errorMsgList).filter(key => errorMsg.includes(key));
  if (errorKeys.length > 0) {
    return errorMsgList[errorKeys[0] as keyof typeof errorMsgList];
  }
  return errorMsg;
};
