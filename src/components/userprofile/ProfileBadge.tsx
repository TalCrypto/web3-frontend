// create react component

import React, { PropsWithChildren } from 'react';

type BadgeColors = 'sky' | 'red' | 'yellow' | 'green';

type BadgeVariant = {
  bg: string;
  border: string;
  font: string;
};

const variants: {
  // eslint-disable-next-line no-unused-vars
  [name in BadgeColors]: BadgeVariant;
} = {
  sky: {
    bg: 'bg-[#43F4FF33]',
    border: 'border-[#43F4FF80]',
    font: 'text-[#43F4FF]'
  },
  red: {
    bg: 'bg-[#FF7B4333]',
    border: 'border-[#FF874380]',
    font: 'text-[#FF8743]'
  },
  yellow: {
    bg: 'bg-[#FFEC4333]',
    border: 'border-[#FFEC4380]',
    font: 'text-[#FFEC43]'
  },
  green: {
    bg: 'bg-[#43FFA533]',
    border: 'border-[#43FFA580]',
    font: 'text-[#43FFA5]'
  }
};

interface ProfileBadgeProps extends PropsWithChildren {
  color: BadgeColors;
}

const ProfileBadge: React.FC<ProfileBadgeProps> = ({ children, color }) => {
  const variant = variants[color];
  return (
    <div
      className={`
      flex space-x-1 rounded-[14px] border ${variant.bg} ${variant.border} px-2 py-1 
      ${variant.font} text-[10px] font-medium
      `}>
      {children}
    </div>
  );
};

// ProfileBadge.defaultProps = {
//   color: 'sky'
// };

export default ProfileBadge;
