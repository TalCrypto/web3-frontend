import React, { useState } from 'react';
import { useStore as useNanostore } from '@nanostores/react';
import Image from 'next/image';
import { ThreeDots } from 'react-loader-spinner';
import { getAuth } from 'firebase/auth';

import { walletProvider } from '@/utils/walletProvider';
import { apiConnection } from '@/utils/apiConnection';

import { tethCollected, inputCode, hasTraded } from '@/stores/UserState';

interface ExtraComponentProps {
  getTestToken: any;
  isWrongNetwork: boolean;
  updateTargetNetwork: any;
}

const ExtraComponent: React.FC<ExtraComponentProps> = ({ getTestToken, isWrongNetwork, updateTargetNetwork }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [isError, setIsError] = useState(false);
  const [isShowAlert, setIsShowAlert] = useState(false);
  const [inVerify, setInVerify] = useState(false);
  const [isShowReferral, setIsShowReferral] = useState(true);
  const isTethCollected = useNanostore(tethCollected);
  const isInputCode = useNanostore(inputCode);

  if (isWrongNetwork) {
    return (
      <button type="button" className="navbar-button" onClick={updateTargetNetwork}>
        <div className="container flex flex-row-reverse" id="whitelist-register-btn">
          Switch to Arbitrum
        </div>
      </button>
    );
  }

  const getWethButton = (
    <button
      type="button"
      className="navbar-button"
      onClick={() => {
        setIsLoading(true);
        getTestToken(() => setIsLoading(false));
      }}>
      <div className="flex items-center space-x-1 px-3">
        {!isLoading ? (
          <>
            <Image src="/images/components/layout/header/eth-tribe3.svg" width={16} height={16} alt="" />
            <span>Get WETH</span>
          </>
        ) : (
          <ThreeDots ariaLabel="loading-indicator" height={20} width={50} color="white" />
        )}
      </div>
    </button>
  );

  const verifyCode = async () => {
    const code = referralCode;
    setInVerify(true);
    if (code.length !== 7) {
      setIsError(true);
      setInVerify(false);
      setIsShowAlert(true);
      setTimeout(() => {
        setIsShowAlert(false);
      }, 1000);
      return;
    }
    setIsError(false);
    let auth = getAuth();
    let { currentUser } = auth;
    try {
      if (!currentUser || currentUser.uid !== walletProvider.holderAddress) {
        await apiConnection.switchAccount();
      }
      auth = getAuth();
      currentUser = auth.currentUser;
      await walletProvider.getHolderAddress().then(async () => {
        setInVerify(false);

        if (!currentUser) {
          return;
        }

        const idToken = await currentUser.getIdToken(true);
        const response = await apiConnection.useReferralCode(code, idToken);
        if (response.code !== 0) {
          setIsError(true);
          setIsShowAlert(true);
          setTimeout(() => {
            setIsShowAlert(false);
          }, 1000);
          return;
        }
        setIsError(false);
        setIsShowAlert(true);
        setTimeout(() => {
          setIsShowAlert(false);
          setIsShowReferral(false);
        }, 1000);
      });
      setInVerify(false);
    } catch (e) {
      setIsError(true);
      setInVerify(false);
      setIsShowAlert(true);
      setTimeout(() => {
        setIsShowAlert(false);
      }, 1000);
    }
  };

  const submitReferralCode = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    verifyCode();
  };

  let inputRefferalCode = null;
  if (isTethCollected && !isInputCode && !hasTraded && isShowReferral) {
    inputRefferalCode = (
      <div>
        {isShowAlert ? (
          <div className={`referral-code-alert ${isShowAlert ? 'show' : ''}`}>
            {isError ? 'Invalid Referral Code' : 'Success Apply Referral Code'}
          </div>
        ) : null}
        <form className="enter-referral-code" onSubmit={submitReferralCode}>
          <input
            type="text"
            className="input"
            placeholder="Enter referral code"
            value={referralCode}
            onChange={e => setReferralCode(e.target.value)}
          />
          <button type="submit" className="submit" disabled={!referralCode && !inVerify}>
            {!inVerify ? 'Apply' : <ThreeDots ariaLabel="loading-indicator" height={20} width={50} color="white" />}
          </button>
        </form>
      </div>
    );
  }

  return (
    <>
      {getWethButton}
      {inputRefferalCode}
    </>
  );
};

export default ExtraComponent;
