import React from 'react';

export const ErrorTip = ({ label }: { label: string | null }) => {
  if (!label) return null;
  return (
    <div className="mb-2">
      <span className="text-[12px] leading-[20px] text-marketRed">{label}</span>
    </div>
  );
};
