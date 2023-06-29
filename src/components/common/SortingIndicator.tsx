import React from 'react';
import Image from 'next/image';

const SortingIndicator = (props: any) => {
  const { value } = props;

  return (
    <Image
      className="ml-1"
      alt=""
      width={10}
      height={10}
      src={value === 0 ? '/images/common/no_sort.svg' : value === 1 ? '/images/common/sort_up.svg' : '/images/common/sort_down.svg'}
    />
  );
};

export default SortingIndicator;
