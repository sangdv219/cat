export class BaseGetResponse<T = any> {
  data?: T;
  totalRecord?: number;
}


export interface BaseResponse<T> {
    statusCode: number;
    message: string;
    records: T;
}

export class BaseAuditTableEntity{
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}