import Image from 'next/image';
import React from 'react';
import collectionList from '@/const/collectionList';

function filter(filterFunction: any, params: any) {
  const { content, className, showCollectionName } = params;
  const targetCollection = collectionList.filter(filterFunction);
  if (targetCollection.length) {
    return (
      <div className={`type-with-icon flex ${className}`}>
        <div className="icon">
          <Image src={targetCollection[0].image} alt="" width={24} height={24} className="mr-[6px]" />
        </div>
        {showCollectionName ? <span>{targetCollection[0].shortName}</span> : null}
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

export function TypeWithIconByAmm(props: any) {
  return filter((item: any) => item.amm.toUpperCase() === props.amm.toUpperCase(), props);
}

export function TypeWithIconByName(props: any) {
  return filter((item: any) => item.name.toUpperCase() === props.name.toUpperCase(), props);
}

export function TypeWithIconByCollection(props: any) {
  return filter((item: any) => item.collection.toUpperCase() === props.collection.toUpperCase(), props);
}

export function TypeWithIconByAmmAddress(props: any) {
  return filter((item: any) => item.amm.toUpperCase() === props.ammAddress.toUpperCase(), props);
}
