/* eslint-disable no-unused-vars */
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface NavbarItem {
  name: string;
  path: string;
  other: React.ReactElement | string;
  child: NavbarItem[];
  textClassName: string;
  icon?: React.ReactElement;
}

function TopMenu() {
  const router = useRouter();

  const navbarList: NavbarItem[] = [
    { name: 'Portfolio', path: '/portfolio', other: '', child: [], textClassName: '' },
    { name: 'Trade', path: '/trade', other: '', child: [], textClassName: '' },
    // {
    //   name: 'Others',
    //   path: '/others',
    //   other: '',
    //   child: [
    //     { name: 'Avatar', path: '../comingsoonavatar', /*other: <Soon />,*/ child: [] },
    //     { name: 'Battle', path: '../comingsoonbattle', /*other: <Soon />,*/ child: [] }
    //   ]
    // },
    {
      name: 'Airdrop',
      path: '/airdrop',
      other: (
        <div
          className="absolute right-0 top-0 mr-[-12px] mt-[8px] rounded-br-[6px] rounded-tl-[6px]
        bg-gradient-to-b from-[#E8900C] to-[#DA3B19]
        px-[3px] py-[2px] text-[8px] font-bold italic leading-[8px] text-[#fff]">
          <span className="end">On-going</span>
        </div>
      ),
      child: [],
      textClassName: ''
    },
    {
      name: 'Competition',
      path: '/competition',
      // other: (
      //   <div
      //     className="absolute right-0 top-0 mr-[-12px] mt-[12px] rounded-br-[6px] rounded-tl-[6px]
      //   bg-gradient-to-r from-[#f703d94d] via-[#795af44d] to-[#04aefc4d]
      //   px-[3px] py-[2px] text-[8px] font-bold italic leading-[8px] text-[#fff]">
      //     <span className="end">END</span>
      //   </div>
      // ),
      other: '',
      child: [],
      textClassName: 'glow-yellow',
      icon: (
        <div className="mr-1">
          <Image className="mt-[2px]" src="/images/common/fire.svg" width={18} height={18} alt="Airdrop Icon" />
        </div>
      )
    }
  ];

  const handleDropdown = (name: string, isShow: boolean) => {
    const dropdown = document.querySelector(`.dropdown-${name}`);
    if (dropdown) {
      if (isShow) {
        dropdown.classList.add('visible');
        dropdown.classList.remove('hidden');
      } else {
        dropdown.classList.add('hidden');
        dropdown.classList.remove('visible');
      }
    }
  };

  const listUI = navbarList.map(({ name, path, other, child, icon, textClassName }) => {
    if (child.length !== 0) {
      return (
        <div
          key={name}
          className="group relative"
          onMouseEnter={() => handleDropdown(name, true)}
          onMouseLeave={() => handleDropdown(name, false)}>
          <div
            className={`py-[16px], space-x-[6px], flex cursor-pointer items-center justify-center
              ${router.route.toUpperCase() === path.toUpperCase() ? 'active' : ''}
              active:hover text-clip bg-gradient-to-r from-pink-500 via-purple-500
              to-blue-500 bg-clip-text text-transparent`}>
            <div
              className="after rounded-3px absolute bottom-0 left-0 right-0 top-0 h-3 w-0
              translate-y-0 transform bg-gradient-to-r from-pink-500
              via-purple-500 to-blue-500 transition-all duration-200"
            />
            <p>{name}</p>
            <div className="w-[9px]">
              <div className="rotate-180 group-hover:rotate-0">
                <Image src="/icons/components/layout/top_menu/caretup.svg" width={9} height={9} alt="" />
              </div>
            </div>
          </div>
          <div
            className={`dropdown-${name} absolute -ml-6 hidden rounded-[8px]
            bg-secondaryBlue shadow`}>
            {child.map(item => (
              <Link key={item.name} href={item.path}>
                <div
                  className="flex cursor-pointer items-center space-x-[6px]
                  px-[24px] py-[16px] transition hover:text-highEmphasis">
                  <p>{item.name}</p>
                  {item.other}
                </div>
              </Link>
            ))}
          </div>
        </div>
      );
    }
    return (
      <Link key={name} href={path}>
        <div
          className={`item relative flex cursor-pointer py-[16px] ${textClassName}
          ${router.route.toUpperCase() === path.toUpperCase() ? 'active' : ''}`}>
          {icon}
          {name}
          {other}
          <div className="after absolute bottom-0 left-0 h-[3px] w-full rounded-[3px]" />
        </div>
      </Link>
    );
  });

  return (
    <div
      className="hidden items-center space-x-[20px]
        text-mediumEmphasis xl:flex">
      {listUI}
    </div>
  );
}

export default TopMenu;
