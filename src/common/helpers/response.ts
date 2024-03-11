import { IApiResponse } from '../interface/response.interface';

export const ApiSuccessResponse = <T>(
  message: string,
  data?: T,
  success = true,
): IApiResponse<T> => {
  return {
    message,
    data,
    success,
  };
};
