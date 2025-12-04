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
  viewCount?: number;
}

export interface UpdateClientDTO extends Partial<CreateClientDTO> {}

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

export const list = async (): Promise<ApiResultProps<Client[]>> => {
  try {
    const { data } = await AccountServiceInstance.get<Client[]>('/clients');
    return apiResult(data, null);
  } catch (error) {
    return apiResult([], error);
  }
};

export const findById = async (
  id: string
): Promise<ApiResultProps<Client | null>> => {
  try {
    const { data } = await AccountServiceInstance.get<Client>(`/clients/${id}`);
    return apiResult(data, null);
  } catch (error) {
    return apiResult(null, error);
  }
};

export const update = async (
  id: string,
  payload: UpdateClientDTO
): Promise<ApiResultProps<Client | null>> => {
  try {
    const { data } = await AccountServiceInstance.put<Client>(
      `/clients/${id}`,
      payload
    );
    return apiResult(data, null);
  } catch (error) {
    return apiResult(null, error);
  }
};

export const remove = async (id: string): Promise<ApiResultProps<void>> => {
  try {
    await AccountServiceInstance.delete(`/clients/${id}`);
    return apiResult(undefined, null);
  } catch (error) {
    return apiResult(undefined, error);
  }
};

export default {
  create,
  list,
  findById,
  update,
  remove,
};
