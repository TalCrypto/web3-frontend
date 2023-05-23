import React from 'react';
// import Image from 'next/image';

const ExtraComponent = () => (
  // const ExtraComponent = ({ logEventByName, getTestToken, isWrongNetwork, updateTargetNetwork, accountInfo }) => {
  // const { address, balance } = accountInfo;

  // // states for get teth
  // const [isLoading, setIsLoading] = useState(false);
  // // states for referral code
  // const [referralCode, setReferralCode] = useState('');
  // const [isError, setIsError] = useState(false);
  // const [isShowAlert, setIsShowAlert] = useState(false);
  // const [inVerify, setInVerify] = useState(false);
  // const [isShowReferral, setIsShowReferral] = useState(true);
  // const isTethCollected = useNanostore(tethCollected);
  // const isInputCode = useNanostore(inputCode);

  // if (isWrongNetwork) {
  //   return (
  //     <button type="button" className="navbar-button" onClick={updateTargetNetwork}>
  //       <div className="flex-reverse container" id="whitelist-register-btn">
  //         Switch to Arbitrum
  //       </div>
  //     </button>
  //   );
  // }

  // // show get weth button. was: if (balance <= 0)
  // const getWethButton = (
  //   <button
  //     type="button"
  //     className="navbar-button"
  //     onClick={() => {
  //       setIsLoading(true);
  //       getTestToken(() => setIsLoading(false));
  //     }}>
  //     <div className="flex items-center space-x-1 px-3">
  //       {!isLoading ? (
  //         <>
  //           <Image src="/static/eth-tribe3.svg" width={16} height={16} />
  //           <span>Get WETH</span>
  //         </>
  //       ) : (
  //         <ThreeDots ariaLabel="loading-indicator" height={20} width={50} color="white" />
  //       )}
  //     </div>
  //   </button>
  // );

  // // show input referral code

  // const submitReferralCode = e => {
  //   e.preventDefault();
  //   verifyCode();
  // };

  // const verifyCode = async () => {
  //   const code = referralCode;
  //   setInVerify(true);
  //   if (code.length !== 7) {
  //     setIsError(true);
  //     setInVerify(false);
  //     setIsShowAlert(true);
  //     setTimeout(() => {
  //       setIsShowAlert(false);
  //     }, 1000);
  //     return;
  //   }
  //   logEventByName('reward_enter_referral_code_apply_pressed', { code });
  //   setIsError(false);
  //   let auth = getAuth();
  //   let { currentUser } = auth;
  //   try {
  //     if (!currentUser || currentUser.uid !== walletProvider.holderAddress) {
  //       await apiConnection.switchAccount();
  //     }
  //     auth = getAuth();
  //     currentUser = auth.currentUser;
  //     await walletProvider.getHolderAddress().then(async () => {
  //       setInVerify(false);
  //       const idToken = await currentUser.getIdToken(true);
  //       const response = await apiConnection.useReferralCode(code, idToken);
  //       if (response.code !== 0) {
  //         setIsError(true);
  //         setIsShowAlert(true);
  //         setTimeout(() => {
  //           setIsShowAlert(false);
  //         }, 1000);
  //         return;
  //       }
  //       setIsError(false);
  //       setIsShowAlert(true);
  //       setTimeout(() => {
  //         setIsShowAlert(false);
  //         setIsShowReferral(false);
  //       }, 1000);
  //     });
  //     setInVerify(false);
  //   } catch (e) {
  //     setIsError(true);
  //     setInVerify(false);
  //     setIsShowAlert(true);
  //     setTimeout(() => {
  //       setIsShowAlert(false);
  //     }, 1000);
  //   }
  // };

  // let inputRefferalCode = null;
  // if (isTethCollected && !isInputCode && !hasTraded && isShowReferral) {
  //   inputRefferalCode = (
  //     <div>
  //       <Alert className={`referral-code-alert ${isShowAlert ? 'show' : ''}`} variant="filled" severity={isError ? 'error' : 'success'}>
  //         {isError ? 'Invalid Referral Code' : 'Success Apply Referral Code'}
  //       </Alert>
  //       <form className="enter-referral-code" onSubmit={submitReferralCode}>
  //         <input
  //           type="text"
  //           className="input"
  //           placeholder="Enter referral code"
  //           value={referralCode}
  //           onChange={e => setReferralCode(e.target.value)}
  //         />
  //         <button type="submit" className="submit" disabled={!referralCode && !inVerify}>
  //           {!inVerify ? 'Apply' : <ThreeDots ariaLabel="loading-indicator" height={20} width={50} color="white" />}
  //         </button>
  //       </form>
  //     </div>
  //   );
  // }

  // return (
  <>
    {/* {getWethButton} */}
    {/* {inputRefferalCode} */}
  </>
);
// };

export default ExtraComponent;
