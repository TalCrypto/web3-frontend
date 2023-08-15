/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect } from 'react';
import { useStore as useNanostore } from '@nanostores/react';
import { $userAddress, $userIsConnected } from '@/stores/user';
import { apiConnection } from '@/utils/apiConnection';
import { firebaseApp } from '@/const/firebaseConfig';
import { getAuth } from 'firebase/auth';
import {
  $asHasReferCode,
  $asReferResponse,
  $asReferredUser,
  $asShowResponseModal,
  $userPoint,
  $targetReferralCode,
  defaultUserPoint
} from '@/stores/airdrop';
import { useRouter } from 'next/router';
import { ReferredResponse } from '@/const/airdrop';
import { authConnections } from '@/utils/authConnections';

const UserReferralUpdater = () => {
  const router = useRouter();
  const isConnected = useNanostore($userIsConnected);
  const userAddress = useNanostore($userAddress);
  const referredUser: any = useNanostore($asReferredUser);
  const showResponseModal = useNanostore($asShowResponseModal);
  const asReferResponse = useNanostore($asReferResponse);

  const refersCode = router.query.ref;
  const address = useNanostore($userAddress);
  const userPoint = useNanostore($userPoint);
  const hadTradedOnce = userPoint?.isInputCode && Object.keys(userPoint.referralUser).length === 0;
  const hadEnterCode = userPoint?.isInputCode && userPoint.referralUser?.userAddress;
  const fbApp = firebaseApp;

  useEffect(() => {
    if (isConnected === true && userAddress) {
      apiConnection.getReferralList(String(userAddress));
    }
  }, [isConnected, userAddress]);

  useEffect(() => {
    if (refersCode) {
      $targetReferralCode.set(refersCode);
      apiConnection.getUsernameFromReferral(refersCode).then(item => {
        $asReferredUser.set(item);
        $asShowResponseModal.set(false);
        $asHasReferCode.set(true);
      });
    }
  }, [refersCode]);

  useEffect(() => {
    let auth = getAuth();
    const userAddr: any = address?.toLowerCase();
    async function useReferral() {
      let currentUser = auth?.currentUser;
      try {
        if (!currentUser || currentUser.uid !== userAddr) {
          await authConnections.switchCurrentUser(userAddr || '');
          auth = getAuth();
          currentUser = auth.currentUser;
        }

        const idToken = await currentUser?.getIdToken(true);
        const response: any = await apiConnection.useReferralCode(refersCode, idToken, String(address));
        if (response.code === 0) {
          $asReferResponse.set(ReferredResponse.Congrats);
        }
      } catch (e) {
        $asReferResponse.set(ReferredResponse.IsError);
      }
    }

    if (showResponseModal && isConnected && userPoint && referredUser && refersCode) {
      if (referredUser?.userAddress === userAddr) {
        $asReferResponse.set(ReferredResponse.IsInvalidCode);
      } else if (hadTradedOnce) {
        $asReferResponse.set(ReferredResponse.IsTradedOnce);
      } else if (hadEnterCode) {
        $asReferResponse.set(ReferredResponse.IsHadEnterCode);
      } else {
        useReferral();
      }
    }
  }, [showResponseModal, isConnected, userPoint, refersCode]);

  useEffect(() => {
    const userAddr: any = address?.toLowerCase();
    if (asReferResponse === ReferredResponse.Congrats) {
      apiConnection.getUserPoint(userAddr).then(res => {
        if (res?.multiplier) {
          $userPoint.set(res);
        } else {
          $userPoint.set(defaultUserPoint);
        }
      });
    }
  }, [asReferResponse]);

  return null;
};

export default UserReferralUpdater;
