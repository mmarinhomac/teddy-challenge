type AxiosErrorLike = {
  response?: {
    data?: {
      message?: string | string[];
    };
  };
};

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === 'object') {
    const message = (error as AxiosErrorLike).response?.data?.message;
    if (typeof message === 'string' && message.trim().length > 0) {
      return message;
    }
    if (Array.isArray(message) && message.length > 0) {
      return message[0];
    }
  }

  return fallback;
}
