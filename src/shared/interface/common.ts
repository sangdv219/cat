export class BaseGetResponse<T = any> {
  data?: T;
  totalRecord?: number;
}


export interface BaseResponse<T> {
    statusCode: number;
    message: string;
    records: T;
}