import React from 'react';
import { ThreeDots } from 'react-loader-spinner';

export default function LoadingIndicator(props: any) {
  const { height } = props;
  return (
    <div className="col loadingindicator">
      <ThreeDots ariaLabel="loading-indicator" height={height || 280} color="white" />
    </div>
  );
}
