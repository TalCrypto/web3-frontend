import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { withRouter } from 'next/router';

interface NavbarItem {
  name: string;
  path: string;
  other: string;
  child: NavbarItem[];
}

function TopMenu(props: any) {
  const { router } = props;

  const navbarList: NavbarItem[] = [
    { name: 'Portfolio', path: '/portfolio', other: '', child: [] },
    { name: 'Trade', path: '/trade', other: '', child: [] },
    // {
    //   name: 'Others',
    //   path: '/others',
    //   other: '',
    //   child: [
    //     { name: 'Avatar', path: '../comingsoonavatar', /*other: <Soon />,*/ child: [] },
    //     { name: 'Battle', path: '../comingsoonbattle', /*other: <Soon />,*/ child: [] }
    //   ]
    // },
    { name: 'Airdrop', path: '/airdrop', other: '', child: [] }
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

  const listUI = navbarList.map(({ name, path, other, child }) => {
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
              via-purple-500 to-blue-500 transition-all duration-200 "
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
          className={`item cursor-pointer py-[16px]
          ${router.route.toUpperCase() === path.toUpperCase() ? 'active' : ''}`}>
          {name}
          {other}
          <div className="after absolute bottom-0 left-0 h-[3px] w-full rounded-[3px]" />
        </div>
      </Link>
    );
  });

  return (
    <div
      className="font-mont hidden items-center space-x-[20px]
        text-mediumEmphasis lg:flex">
      {listUI}
    </div>
  );
}

export default withRouter(TopMenu);
