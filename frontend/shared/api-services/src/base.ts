import axios, { AxiosInstance } from 'axios';
import { getServiceUrl } from '@teddy/utils/env';

export interface ApiResultProps<T> {
  data: T | null;
  error: any;
}

export const AccountServiceInstance: AxiosInstance = axios.create({
  baseURL: getServiceUrl('accountService'),
});

export const AnalyticsServiceInstance: AxiosInstance = axios.create({
  baseURL: getServiceUrl('analyticsService'),
});

export const apiResult = <T>(
  data: T | null,
  error: any
): ApiResultProps<T> => ({
  data,
  error,
});

const serviceInstances: Record<string, AxiosInstance> = {
  accountService: AccountServiceInstance,
  analyticsService: AnalyticsServiceInstance,
};

export const setAuthentication = (accessToken: string): void => {
  AccountServiceInstance.defaults.headers.common[
    'Authorization'
  ] = `Bearer ${accessToken}`;
  AnalyticsServiceInstance.defaults.headers.common[
    'Authorization'
  ] = `Bearer ${accessToken}`;
};

export const setOtherCredentials = (
  service: 'accountService' | 'analyticsService',
  name: string,
  value: string
): void => {
  const instance = serviceInstances[service];
  if (instance) {
    instance.defaults.headers.common[name] = value;
  }
};
