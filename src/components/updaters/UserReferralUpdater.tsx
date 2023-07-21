/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect } from 'react';
import { useStore as useNanostore } from '@nanostores/react';
import { $userAddress, $userIsConnected } from '@/stores/user';
import { apiConnection } from '@/utils/apiConnection';
import { firebaseApp } from '@/const/firebaseConfig';
import { getAuth } from 'firebase/auth';
import { $asHasReferCode, $asReferResponse, $asReferredUser, $asShowResponseModal, $userPoint } from '@/stores/airdrop';
import { useRouter } from 'next/router';
import { ReferredResponse } from '@/const/airdrop';
import { authConnections } from '@/utils/authConnections';

const UserReferralUpdater = () => {
  const router = useRouter();
  const isConnected = useNanostore($userIsConnected);
  const userAddress = useNanostore($userAddress);
  const referredUser: any = useNanostore($asReferredUser);
  const showResponseModal = useNanostore($asShowResponseModal);

  const refersCode = router.query.ref;
  const address = useNanostore($userAddress);
  const userPoint = useNanostore($userPoint);
  const hadTradedOnce = userPoint?.isInputCode && Object.keys(userPoint.referralUser).length === 0;
  const hadEnterCode = userPoint?.isInputCode && userPoint.referralUser?.userAddress;
  const fbApp = firebaseApp;
  let auth = getAuth();

  useEffect(() => {
    if (isConnected === true) {
      apiConnection.getReferralList(String(userAddress));
    }
  }, [isConnected, userAddress]);

  useEffect(() => {
    if (refersCode) {
      apiConnection.getUsernameFromReferral(refersCode).then(item => {
        $asReferredUser.set(item);
        $asShowResponseModal.set(false);
        $asHasReferCode.set(true);
      });
    }
  }, [refersCode]);

  useEffect(() => {
    async function useReferral() {
      let currentUser = auth?.currentUser;
      try {
        if (!currentUser || currentUser.uid === address) {
          await authConnections.switchCurrentUser(address || '');
          auth = getAuth();
          currentUser = auth.currentUser;
        }
        const idToken = await currentUser?.getIdToken(true);
        const response: any = apiConnection.useReferralCode(refersCode, idToken, String(address));
        if (response.code === 0) {
          $asReferResponse.set(ReferredResponse.Congrats);
        }
      } catch (e) {
        // console.log({ e });
      }
    }

    if (showResponseModal && isConnected && userPoint && referredUser) {
      if (referredUser?.userAddress === address?.toLowerCase()) {
        $asReferResponse.set(ReferredResponse.IsInvalidCode);
      } else if (hadTradedOnce) {
        $asReferResponse.set(ReferredResponse.IsTradedOnce);
      } else if (hadEnterCode) {
        $asReferResponse.set(ReferredResponse.IsHadEnterCode);
      } else {
        useReferral();
      }
    }
  }, [showResponseModal, isConnected, userPoint]);

  return null;
};

export default UserReferralUpdater;
