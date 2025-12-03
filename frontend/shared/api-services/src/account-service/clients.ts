import { AccountServiceInstance, apiResult, ApiResultProps } from '../base';

export type ClientStatus = 'active' | 'inactive';

export interface CreateClientDTO {
  name: string;
  email: string;
  document: string;
  status: ClientStatus;
}

export interface Client extends CreateClientDTO {
  id: string;
}

export const create = async (
  payload: CreateClientDTO
): Promise<ApiResultProps<Client | null>> => {
  try {
    const { data } = await AccountServiceInstance.post<Client>(
      '/clients',
      payload
    );
    return apiResult(data, null);
  } catch (error) {
    return apiResult(null, error);
  }
};

export default {
  create,
};
