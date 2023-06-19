import { useEffect, useState } from 'react';

export const useDebounce = (value: bigint | undefined, timeout = 500) => {
  const [result, setResult] = useState<bigint | undefined>();
  useEffect(() => {
    const timeoutHandler = setTimeout(() => {
      setResult(value);
    }, timeout);
    return () => {
      clearTimeout(timeoutHandler);
    };
  }, [value, timeout]);
  return result;
};
