export class BaseResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;   
    totalRecord: number
}

export class UpdateCreateResponse<T= any> {
    success?: boolean = false;
    message?: string;
    data?: Partial<T>
}

export class DeleteResponse<T>{
    success?: boolean = false;
    message?: string;
    id: string | number;
}

