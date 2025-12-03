import {
  AccountServiceInstance,
  apiResult,
  ApiResultProps,
  setAuthentication,
} from '../base';

export interface SignInDTO {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  is_admin: boolean;
}

export interface SignInResponse {
  user: User;
  access_token: string;
}

export const signIn = async (
  payload: SignInDTO
): Promise<ApiResultProps<SignInResponse | null>> => {
  try {
    const { data } = await AccountServiceInstance.post<SignInResponse>(
      '/auth/login',
      payload
    );

    if (data?.access_token) setAuthentication(data.access_token);
    return apiResult(data, null);
  } catch (error) {
    return apiResult(null, error);
  }
};

export default {
  signIn,
};
