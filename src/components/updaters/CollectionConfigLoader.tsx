import React, { useEffect } from 'react';
import { useContractReads } from 'wagmi';
import { useStore as useNanostore } from '@nanostores/react';
import { $collectionConfig, $currentAmm } from '@/stores/trading';
import { getAMMContract, getCHContract, Contract } from '@/const/contracts';
import { ammAbi, chAbi } from '@/const/abi';
import { formatBigInt } from '@/utils/bigInt';
import { $currentChain } from '@/stores/user';

const Loader = ({ ammContract, chContract }: { ammContract: Contract; chContract: Contract }) => {
  const { data } = useContractReads({
    contracts: [
      { ...ammContract, abi: ammAbi, functionName: 'initMarginRatio' },
      { ...ammContract, abi: ammAbi, functionName: 'fundingPeriod' },
      { ...chContract, abi: chAbi, functionName: 'LIQ_SWITCH_RATIO' },
      { ...ammContract, abi: ammAbi, functionName: 'reserveSnapshots', args: [0n] }
    ]
  });
  const initMarginRatio = data ? data[0].result : 0n;
  const fundingPeriod = data ? data[1].result : 0n;
  const liqSwitchRatio = data ? data[2].result : 0n;
  const startSnapShort = data ? data[3].result : null;
  const startPrice = startSnapShort ? (startSnapShort[0] * BigInt(10 ** 18)) / startSnapShort[1] : 0n;
  useEffect(() => {
    if (initMarginRatio && fundingPeriod && liqSwitchRatio && startPrice) {
      $collectionConfig.set({
        initMarginRatio: formatBigInt(initMarginRatio),
        fundingPeriod: Number(fundingPeriod),
        liqSwitchRatio: formatBigInt(liqSwitchRatio),
        startPrice: formatBigInt(startPrice)
      });
    }
  }, [initMarginRatio, fundingPeriod, liqSwitchRatio, startPrice]);
  return null;
};

const CollectionConfigLoader: React.FC = () => {
  const chain = useNanostore($currentChain);
  const currentAmm = useNanostore($currentAmm);
  const ammContract = getAMMContract(chain, currentAmm);
  const chContract = getCHContract(chain);
  if (!ammContract || !chContract) return null;
  return <Loader ammContract={ammContract} chContract={chContract} />;
};

export default CollectionConfigLoader;
