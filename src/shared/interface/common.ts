export class BaseGetResponse<T = any> {
  items?: T;
  totalRecord?: number;
}


export interface BaseResponse<T> {
    statusCode: number;
    message: string;
    records: T;
}

