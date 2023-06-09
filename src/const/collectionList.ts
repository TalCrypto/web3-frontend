/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */

export enum AMM {
  BAYC = 'bayc',
  MAYC = 'mayc',
  AZUKI = 'azuki',
  PUNKS = 'punks',
  DEGODS = 'degods',
  CAPTAINZ = 'captainz'
}

export const DEFAULT_AMM: AMM = AMM.DEGODS;

export interface CollectionInfo {
  amm: AMM;
  name: string;
  title: string;
  image: string;
  collection: string;
  contract: string;
  logo: string;
  sidebarLogo: string;
  collectionName: string;
  collectionType: string;
  contractId: string;
  homeUrl: string;
  twitterUrl: string;
  discordUrl: string;
  etherscanUrl: string;
  shortName: string;
  displayCollectionPair: string;
  isNew: boolean;
}

export type CollectionInfos = {
  [value in AMM]: CollectionInfo;
};

export const collectionsInfos: CollectionInfos = {
  [AMM.DEGODS]: {
    amm: AMM.DEGODS,
    name: 'DEGODS/ETH',
    title: 'DeGods',
    image: '/images/collections/small/degods.svg',
    collection: 'DEGODS',
    contract: process.env.NEXT_PUBLIC_DEGODS_CONTRACT_ADDRESS || '',
    logo: '/images/collections/big/degods.svg',
    sidebarLogo: '/images/collections/normal/degods.svg',
    collectionName: 'DEGODS',
    collectionType: 'DEGODS',
    contractId: process.env.NEXT_PUBLIC_FIREBASE_CHAT_MEEBITS_CONTRACTID || '',
    homeUrl: 'https://degods.com//',
    twitterUrl: 'https://twitter.com/DeGodsNFT',
    discordUrl: 'https://discord.gg/dedao',
    etherscanUrl: 'https://etherscan.io/token/0x1821363abc9E33f1bfbE3f96F7C68ECa7f6Af2BD',
    shortName: 'DEGODS',
    displayCollectionPair: 'DEGODS/WETH',
    isNew: true
  },
  [AMM.CAPTAINZ]: {
    amm: AMM.CAPTAINZ,
    name: 'CAPTAINZ/ETH',
    title: 'Captainz',
    image: '/images/collections/small/captainz.svg',
    collection: 'CAPTAINZ',
    contract: process.env.NEXT_PUBLIC_CAPTAINZ_CONTRACT_ADDRESS || '',
    logo: '/images/collections/big/captainz.svg',
    sidebarLogo: '/images/collections/normal/captainz.svg',
    collectionName: 'CAPTAINZ',
    collectionType: 'CAPTAINZ',
    contractId: process.env.NEXT_PUBLIC_FIREBASE_CHAT_MEEBITS_CONTRACTID || '',
    homeUrl: 'http://memeland.com/captainz/',
    twitterUrl: 'https://www.twitter.com/Memeland',
    discordUrl: 'https://discord.gg/memeland',
    etherscanUrl: 'https://etherscan.io/address/0x769272677fab02575e84945f03eca517acc544cc',
    shortName: 'CAPTAINZ',
    displayCollectionPair: 'CAPTAINZ/WETH',
    isNew: true
  },
  [AMM.BAYC]: {
    amm: AMM.BAYC,
    name: 'BAYC/ETH',
    title: 'Bored Ape Yacht Club',
    image: '/images/collections/small/bayc.svg',
    collection: 'BAYC',
    contract: process.env.NEXT_PUBLIC_BAYC_CONTRACT_ADDRESS || '',
    logo: '/images/collections/big/bayc.svg',
    sidebarLogo: '/images/collections/normal/bayc.svg',
    collectionName: 'BAYC',
    collectionType: 'BAYC',
    contractId: process.env.NEXT_PUBLIC_FIREBASE_CHAT_CONTRACTID || '',
    homeUrl: 'https://boredapeyachtclub.com/',
    twitterUrl: 'https://twitter.com/boredapeyc',
    discordUrl: 'https://discord.com/invite/3P5K3dzgdB',
    etherscanUrl: 'https://etherscan.io/token/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
    shortName: 'BAYC',
    displayCollectionPair: 'BAYC/WETH',
    isNew: false
  },
  [AMM.MAYC]: {
    amm: AMM.MAYC,
    name: 'MAYC/ETH',
    title: 'Mutant Ape Yacht Club',
    image: '/images/collections/small/mayc.svg',
    collection: 'MAYC',
    contract: process.env.NEXT_PUBLIC_MAYC_CONTRACT_ADDRESS || '',
    logo: '/images/collections/big/mayc.svg',
    sidebarLogo: '/images/collections/normal/mayc.svg',
    collectionName: 'MAYC',
    collectionType: 'MAYC',
    contractId: process.env.NEXT_PUBLIC_FIREBASE_CHAT_MEEBITS_CONTRACTID || '',
    homeUrl: 'https://boredapeyachtclub.com/',
    twitterUrl: 'https://twitter.com/boredapeyc',
    discordUrl: 'https://discord.com/invite/3P5K3dzgdB',
    etherscanUrl: 'https://etherscan.io/token/0x60e4d786628fea6478f785a6d7e704777c86a7c6',
    shortName: 'MAYC',
    displayCollectionPair: 'MAYC/WETH',
    isNew: false
  },
  [AMM.AZUKI]: {
    amm: AMM.AZUKI,
    name: 'AZUKI/ETH',
    title: 'Azuki',
    image: '/images/collections/small/azuki.svg',
    collection: 'AZUKI',
    contract: process.env.NEXT_PUBLIC_AZUKI_CONTRACT_ADDRESS || '',
    logo: '/images/collections/big/azuki.svg',
    sidebarLogo: '/images/collections/normal/azuki.svg',
    collectionName: 'AZUKI',
    collectionType: 'AZUKI',
    contractId: process.env.NEXT_PUBLIC_FIREBASE_CHAT_AZUKI_CONTRACTID || '',
    homeUrl: 'http://www.azuki.com ',
    twitterUrl: 'https://twitter.com/azukiofficial',
    discordUrl: 'https://discord.com/invite/azuki',
    etherscanUrl: 'https://etherscan.io/token/0xed5af388653567af2f388e6224dc7c4b3241c544',
    shortName: 'AZUKI',
    displayCollectionPair: 'AZUKI/WETH',
    isNew: false
  },
  [AMM.PUNKS]: {
    amm: AMM.PUNKS,
    name: 'PUNKS/ETH',
    title: 'CRYPTOPUNKS',
    image: '/images/collections/small/cryptopunks.svg',
    collection: 'C',
    contract: process.env.NEXT_PUBLIC_CRYPTOPUNKS_CONTRACT_ADDRESS || '',
    logo: '/images/collections/big/cryptopunks.svg',
    sidebarLogo: '/images/collections/normal/cryptopunks.svg',
    collectionName: 'CRYPTOPUNKS',
    collectionType: 'C',
    contractId: process.env.NEXT_PUBLIC_FIREBASE_CHAT_CRYPTOPUNKS_CONTRACTID || '',
    homeUrl: ' https://www.larvalabs.com/cryptopunks',
    twitterUrl: 'https://twitter.com/cryptopunksnfts',
    discordUrl: 'https://discord.com/invite/4JMAauFZBq',
    etherscanUrl: 'https://etherscan.io/token/0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb',
    shortName: 'PUNKS',
    displayCollectionPair: 'PUNKS/WETH',
    isNew: false
  }
  // {
  //   name: 'DOODLES/ETH',
  //   title: 'Doodles',
  //   image: '/images/collections/small/doodle.svg',
  //   amm: process.env.NEXT_PUBLIC_DOODLE_AMM_ADDRESS || '',
  //   collection: 'DOODLE',
  //   contract: process.env.NEXT_PUBLIC_DOODLE_CONTRACT_ADDRESS || '',
  //   logo: '/images/collections/big/doodle.svg',
  //   sidebarLogo: '/images/collections/normal/doodles.svg',
  //   collectionName: 'DOODLES',
  //   collectionType: 'DOODLE',
  //   contractId: process.env.NEXT_PUBLIC_FIREBASE_CHAT_DOODLE_CONTRACTID || '',
  //   homeUrl: 'https://doodles.app/',
  //   twitterUrl: 'https://twitter.com/doodles',
  //   discordUrl: 'https://discord.com/invite/doodles',
  //   etherscanUrl: 'https://etherscan.io/token/0x8a90cab2b38dba80c64b7734e58ee1db38b8992e',
  //   shortName: 'DOODLES'
  // }
  // {
  //   name: 'MOONBIRDS/ETH',
  //   title: 'Moonbirds',
  //   image: '/images/collections/small/moonbirds.svg',
  //   amm: process.env.NEXT_PUBLIC_MOONBIRDS_AMM_ADDRESS || '',
  //   collection: 'MOONBIRD',
  //   contract: process.env.NEXT_PUBLIC_MOONBIRDS_CONTRACT_ADDRESS || '',
  //   logo: '/images/collections/big/moonbirds.svg',
  //   sidebarLogo: '/images/collections/normal/moonbirds.svg',
  //   collectionName: 'MOONBIRDS',
  //   collectionType: 'MOONBIRDS',
  //   contractId: process.env.NEXT_PUBLIC_FIREBASE_CHAT_MOONBIRDS_CONTRACTID || '',
  //   homeUrl: ' https://moonbirds.xyz',
  //   twitterUrl: 'https://twitter.com/moonbirds',
  //   discordUrl: 'https://discord.com/invite/PROOF',
  //   etherscanUrl: 'https://etherscan.io/token/0x23581767a106ae21c074b2276D25e5C3e136a68b',
  //   shortName: 'MOONBIRDS'
  // },
  // {
  //   name: 'CLONEX/ETH',
  //   title: 'CLONE X',
  //   image: '/images/collections/small/clonex.svg',
  //   amm: process.env.NEXT_PUBLIC_CLONEX_AMM_ADDRESS || '',
  //   collection: 'CLONEX',
  //   contract: process.env.NEXT_PUBLIC_CLONEX_CONTRACT_ADDRESS || '',
  //   logo: '/images/collections/big/clonex.svg',
  //   sidebarLogo: '/images/collections/normal/clonex.svg',
  //   collectionName: 'CLONEX',
  //   collectionType: 'CLONEX',
  //   contractId: process.env.NEXT_PUBLIC_FIREBASE_CHAT_CLONEX_CONTRACTID || '',
  //   homeUrl: ' http://www.rtfkt.com/',
  //   twitterUrl: 'https://twitter.com/RTFKT',
  //   discordUrl: 'https://discord.com/invite/rtfkt',
  //   etherscanUrl: 'https://etherscan.io/token/0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b',
  //   shortName: 'CLONEX'
  // },

  // {
  //   name: 'MEEBITS/ETH',
  //   title: 'Meebits',
  //   image: '/images/collections/small/meebits.svg',
  //   amm: process.env.NEXT_PUBLIC_MEEBITS_AMM_ADDRESS || '',
  //   collection: 'MEEBITS',
  //   contract: process.env.NEXT_PUBLIC_MEEBITS_CONTRACT_ADDRESS || '',
  //   logo: '/images/collections/big/meebits.svg',
  //   sidebarLogo: '/images/collections/normal/meebits.svg',
  //   collectionName: 'MEEBITS',
  //   collectionType: '⚇',
  //   contractId: process.env.NEXT_PUBLIC_FIREBASE_CHAT_MEEBITS_CONTRACTID || '',
  //   homeUrl: 'https://meebits.app/',
  //   twitterUrl: 'https://twitter.com/MeebitsNFTs',
  //   discordUrl: 'https://discord.com/invite/meebits',
  //   etherscanUrl: 'https://etherscan.io/token/0x7Bd29408f11D2bFC23c34f18275bBf23bB716Bc7',
  //   shortName: 'MEEBITS'
  // }
};

export const getCollectionInformation = (amm: AMM): CollectionInfo => collectionsInfos[amm];
