import { useEffect } from 'react';

export const useAuthEffect = () => {
  console.log('useAuthEffect called');

  useEffect(() => {
    console.log('Auth effect executed');
  }, []);
};
