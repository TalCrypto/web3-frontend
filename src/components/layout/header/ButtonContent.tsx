import React from 'react';

import Image from 'next/image';

interface ButtonContentProps {
  icon: string;
  url: string;
  name: string;
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const ButtonContent: React.FC<ButtonContentProps> = ({ icon, url, name, setIsShow }) => {
  const openUrl = () => {
    setIsShow(false);
    window.open(url, '_blank');
  };
  return (
    <div className="button" onClick={openUrl}>
      <Image src={icon} alt="" className="icon" />
      {name}
    </div>
  );
};

export default ButtonContent;
