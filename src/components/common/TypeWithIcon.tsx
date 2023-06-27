import Image from 'next/image';
import React from 'react';
import { getCollectionInformation } from '@/const/collectionList';

export function TypeWithIconByAmm(props: any) {
  const { content, showCollectionName, amm, className } = props;

  const targetCollection = getCollectionInformation(amm);

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
