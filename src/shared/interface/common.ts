export class BaseResponseDto<T = any> {
    success: boolean;
    message?: string;
    data?: T;   
    totalRecord: number
}

export class UpdateCreateResponseDto<T= any> {
    success?: boolean = false;
    message?: string;
    data?: Partial<T>
}

export class DeleteResponseDto<T>{
    success?: boolean = false;
    message?: string;
    id: string | number;

}

