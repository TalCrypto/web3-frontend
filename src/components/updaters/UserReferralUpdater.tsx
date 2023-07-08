import { useEffect } from 'react';
import { useStore as useNanostore } from '@nanostores/react';
import { $userAddress, $userIsConnected } from '@/stores/user';
import { apiConnection } from '@/utils/apiConnection';

const UserReferralUpdater = () => {
  const isConnected = useNanostore($userIsConnected);
  const userAddress = useNanostore($userAddress);

  useEffect(() => {
    if (isConnected === true) {
      apiConnection.getReferralList(String(userAddress));
    }
  }, [isConnected, userAddress]);

  return null;
};
export default UserReferralUpdater;
