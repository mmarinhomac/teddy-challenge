const SERVICES = {
  accountService: {
    local: 'http://localhost:3000',
    test: 'https://account-test.teddydigital.io',
    prod: 'https://account.teddydigital.io',
  },
  analyticsService: {
    local: 'http://localhost:3001',
    test: 'https://analytics-test.teddydigital.io',
    prod: 'https://analytics.teddydigital.io',
  },
};

const getEnv = (): 'local' | 'test' | 'prod' => {
  if (location.hostname === 'localhost') return 'local';
  if (location.hostname.includes('testing')) return 'test';
  return 'prod';
};

export const getServiceUrl = (service: keyof typeof SERVICES): string => {
  const env = getEnv();
  return SERVICES[service][env];
};

const MICROFRONTS = {
  admin: {
    local: 'http://localhost:5173',
    test: 'https://admin-test.teddydigital.io',
    prod: 'https://admin.teddydigital.io',
  },
};

export const getMicroFrontUrl = (name: keyof typeof MICROFRONTS): string => {
  const env = getEnv();
  return MICROFRONTS[name][env];
};
