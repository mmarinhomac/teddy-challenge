import { useEffect } from 'react';

import { debounceTimeout } from '@teddy/utils/time';

import accountService from '@teddy/api-services/account-service';
import { setAuthentication } from '@teddy/api-services/base';
import { useAuth } from '../context';

export const useAuthEffect = () => {
  const { setUser, setLoading } = useAuth();

  const loadAuthData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      if (!token) return;
      setAuthentication(token);

      const { data } = await accountService.auth.me();

      if (data?.user) {
        setUser(data.user);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    debounceTimeout('load-auth-data', loadAuthData, 300, 'teddyAdminLayer');
  }, []);
};
