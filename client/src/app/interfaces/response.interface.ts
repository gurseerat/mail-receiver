export interface IResponse {
  message?: string;
  code?: number;
  success?: boolean;
  status?: string | number;
  data?: number | any;
  error?: any;
}
