import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface NavbarItem {
  name: string;
  path: string;
  other: string;
  child: NavbarItem[];
}

function TopMenu() {
  const activePageName = 'Trade';

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
      // const isSelected = child.reduce((pre, item) => pre || activePageName.toUpperCase() === item.name.toUpperCase(), false);

      return (
        <div
          key={name}
          className="group relative"
          onMouseEnter={() => handleDropdown(name, true)}
          onMouseLeave={() => handleDropdown(name, false)}>
          <div
            className={`item flex cursor-pointer items-center justify-center space-x-[6px] py-[16px]
              ${activePageName.toUpperCase() === name.toUpperCase() ? 'active' : ''}`}>
            <p>{name}</p>
            <div className="w-[9px]">
              <div className="rotate-180 group-hover:rotate-0">
                <Image src="/icons/components/layout/top_menu/caretup.svg" width={9} height={9} alt="" />
              </div>
            </div>
          </div>
          <div className={`dropdown-${name} absolute -ml-6 hidden rounded-[8px] bg-secondaryBlue shadow`}>
            {child.map(item => (
              <Link key={item.name} href={item.path}>
                <div className="flex cursor-pointer items-center space-x-[6px] px-[24px] py-[16px] transition hover:text-highEmphasis">
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
        <div className={`item cursor-pointer py-[16px] ${activePageName.toUpperCase() === name.toUpperCase() ? 'active' : ''}`}>
          {name}
          {other}
        </div>
      </Link>
    );
  });

  return <div className="top-menu-navbar flex items-center space-x-[20px] text-mediumEmphasis">{listUI}</div>;
}

export default TopMenu;
