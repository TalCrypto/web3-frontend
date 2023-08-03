import React, { FC, PropsWithChildren } from 'react';

type ItemProps = PropsWithChildren & {
  className?: string;
};

const Item: FC<ItemProps> = ({ children, className }) => (
  <div className={`flex min-w-[140px] flex-col items-center rounded bg-secondaryBlue p-[10px] ${className}`}>{children}</div>
);

Item.defaultProps = {
  className: undefined
};

const Container: FC<PropsWithChildren> = ({ children }) => (
  <div className="absolute right-0 top-0 h-full">
    <div className="sticky top-24 flex flex-col space-y-4">{children}</div>
  </div>
);

export default { Container, Item };
