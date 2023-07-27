import React, { useEffect } from 'react';
import { usePublicClient } from 'wagmi';
import { useStore as useNanostore } from '@nanostores/react';
import { $collectionConfig, $currentAmm } from '@/stores/trading';
import { getAMMContract, getCHContract } from '@/const/contracts';
import { ammAbi, chAbi } from '@/const/abi';
import { formatBigInt } from '@/utils/bigInt';
import { $currentChain } from '@/stores/user';

const CollectionConfigLoader: React.FC = () => {
  const chain = useNanostore($currentChain);
  const currentAmm = useNanostore($currentAmm);
  const publicClient = usePublicClient();

  useEffect(() => {
    async function loadAmmConfig() {
      if (currentAmm) {
        const amm = getAMMContract(chain, currentAmm);
        const ch = getCHContract(chain);
        if (amm) {
          try {
            const initMarginRatio = await publicClient.readContract({
              address: amm.address,
              abi: ammAbi,
              functionName: 'initMarginRatio'
            });
            const fundingPeriod = await publicClient.readContract({
              address: amm.address,
              abi: ammAbi,
              functionName: 'fundingPeriod'
            });
            const liqSwitchRatio = await publicClient.readContract({
              address: ch.address,
              abi: chAbi,
              functionName: 'LIQ_SWITCH_RATIO'
            });
            $collectionConfig.set({
              initMarginRatio: formatBigInt(initMarginRatio),
              fundingPeriod: Number(fundingPeriod),
              liqSwitchRatio: formatBigInt(liqSwitchRatio)
            });
          } catch (e) {
            // console.log(e);
          }
        }
      }
    }

    loadAmmConfig();
  }, [currentAmm, chain, publicClient]);

  return null;
};

export default CollectionConfigLoader;
