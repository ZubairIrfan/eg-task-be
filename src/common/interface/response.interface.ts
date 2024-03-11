export interface IApiResponse<T> {
  message: string;
  data?: T;
  success?: boolean;
}
