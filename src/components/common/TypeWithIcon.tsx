import Image from 'next/image';
import React from 'react';
import { getCollectionInformation } from '@/const/collectionList';
import { getAMMByAddress } from '@/const/addresses';
import { $currentChain } from '@/stores/user';
import { useStore as useNanostore } from '@nanostores/react';

export function TypeWithIconByAmm(props: any) {
  const { content, showCollectionName, amm, className } = props;
  const chain = useNanostore($currentChain);
  const ammValue = getAMMByAddress(amm, chain);

  const targetAmm = getCollectionInformation(amm);
  const targetCollection = targetAmm ?? getCollectionInformation(ammValue);

  if (targetCollection) {
    return (
      <div className={`type-with-icon flex ${className}`}>
        <div className="icon">
          <Image src={targetCollection.image} alt="" width={24} height={24} className="mr-[6px]" />
        </div>
        {showCollectionName ? <span>{targetCollection.shortName}</span> : null}
        <span>{content}</span>
      </div>
    );
  }

  return (
    <div className={`type-with-icon flex ${className}`}>
      <span>{content}</span>
    </div>
  );
}
