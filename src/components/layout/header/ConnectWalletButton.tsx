import React from 'react';
// import React { useEffect, useState } from 'react';
// import { ThreeDots } from 'react-loader-spinner';

// interface ConnectWalletButtonProps {
//   handleClick: (isLogin: boolean) => void;
//   isLogin: boolean;
//   inWrongNetwork: boolean;
//   accountInfo: {
//     address: string;
//     balance: number;
//   };
//   currentChain: string;
//   disconnectWallet: () => void;
//   getTestToken: () => void;
//   isWrongNetwork: boolean;
//   updateTargetNetwork: () => void;
//   callBalance: () => void;
//   userInfo: {
//     username: string;
//   } | null;
// }

const ConnectWalletButton = () => (
  // const ConnectWalletButton = (props: ConnectWalletButtonProps) => {
  // const {
  //   handleClick,
  //   isLogin,
  //   inWrongNetwork,
  //   accountInfo,
  //   currentChain,
  //   disconnectWallet,
  //   getTestToken,
  //   isWrongNetwork,
  //   updateTargetNetwork,
  //   callBalance,
  //   userInfo
  // } = props;

  // const { address, balance } = accountInfo;
  // const showWethBalaceLabel = !isLogin ? '' : inWrongNetwork ? '-.-- WETH' : `${Number(balance).toFixed(2)} WETH`;
  // const [showDisconnectTooltip, setShowDisconnectTooltip] = useState(false);
  // const isNotSetUsername = !userInfo || !userInfo.username;
  // const showUsermame = isNotSetUsername
  //   ? ''
  //   : userInfo.username && userInfo.username.length <= 10
  //     ? userInfo.username
  //     : userInfo.username && userInfo.username.length > 10
  //       ? `${userInfo.username.substring(0, 10)}...`
  //       : '';
  // // const isWalletLoading = useNanostore(walletLoading);
  // const isWalletLoading = false;
  // const [isBalanceLoading, setIsBalanceLoading] = useState(false);

  // useEffect(() => {
  //   setIsBalanceLoading(true);
  //   const timer = setTimeout(() => setIsBalanceLoading(false), 1000);
  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, [balance]);

  // return (
  <>
    {/* {getWethButton} */}
    {/* {inputRefferalCode} */}
  </>
  // <div className={`navbar-outer${isLogin ? ' connected' : ''}`}>
  //   <button
  //     type="button"
  //     className={`navbar-button ${!isLogin ? 'not-connected' : 'connected'}`}
  //     onClick={() => (isWalletLoading ? null : handleClick(!isLogin))}>
  //     <div className={`container ${!isLogin ? 'flex-reverse' : ''}`} id="login-btn">
  //       {isWalletLoading ? (
  //         <ThreeDots ariaLabel="loading-indicator" height={20} width={50} color="white" />
  //       ) : (
  //         <>
  //           {isLogin ? (
  //             <>
  //               <span className="username">{isNotSetUsername ? address : isLogin ? showUsermame : ''}</span>
  //               <img src="/static/credit_card.svg" alt="" className="image" />
  //               <span className={`balance ${isBalanceLoading ? 'animate__animated animate__flash animate__infinite' : ''}`}>
  //                 {showWethBalaceLabel}
  //               </span>
  //               {isWrongNetwork ? <img src="/static/incorrect-network.png" alt="" className="image" /> : null}
  //             </>
  //           ) : (
  //             <>
  //               <span>Connect Wallet</span>
  //               <img src="/static/credit_card.svg" alt="" className="image" />
  //             </>
  //           )}
  //         </>
  //       )}
  //     </div>
  //   </button>

  //   {/* <ProfileContent
  //     address={address}
  //     inWrongNetwork={inWrongNetwork}
  //     currentChain={currentChain}
  //     balance={balance}
  //     showDisconnectTooltip={showDisconnectTooltip}
  //     disconnectWallet={disconnectWallet}
  //     setShowDisconnectTooltip={setShowDisconnectTooltip}
  //     getTestToken={getTestToken}
  //     isWrongNetwork={isWrongNetwork}
  //     updateTargetNetwork={updateTargetNetwork}
  //     isLogin={isLogin}
  //     callBalance={callBalance}
  //     userInfo={userInfo}
  //   /> */}
  // </div>
);
// };

export default ConnectWalletButton;
