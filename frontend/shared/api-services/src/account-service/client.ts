import { AccountServiceInstance, apiResult, ApiResultProps } from '../base';

export interface ClientProps {
  id: string;
  email: string;
  name: string;
  countryCode?: string;
}

const getClients = async (): Promise<ApiResultProps<ClientProps[] | null>> => {
  try {
    const result = await AccountServiceInstance.get('/clients');
    return apiResult(result.data, null);
  } catch (error) {
    return apiResult(null, error);
  }
};

export default {
  getClients,
};
