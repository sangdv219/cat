export class BaseResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;   
    totalRecord?: number
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
export interface IBaseRepository<T> {
    getAll(): Promise<T[]>;
    findWithPagination(findWithPagination: IPaginationDTO): Promise<{ items: any, total: number }>;
    findByField<K extends keyof T>(field: K, value: T[K]): Promise<T | null>;
    findOne(id: string): Promise<T | null>;
    findOneByRaw(condition: Record<string, any>): Promise<T | null>;
    created(payload: Partial<T>): Promise<T>;
    updated(id: string, payload: Partial<T>): Promise<T>;
    deleted(id: string): Promise<T>;
}
export abstract class BaseRepository<T> implements IBaseRepository<T> {
    public readonly _entityName: string

    constructor(entityName: string = 'BaseEntity') {
        this._entityName = entityName;
    }

    protected logAction(_entityName: string) {
        console.log(`[${this._entityName}] ${_entityName}`);
    }

    abstract getAll(): Promise<T[]>;

    abstract findWithPagination(findWithPagination: IPaginationDTO): Promise<{ items: any, total: number }>;

    abstract findByField<K extends keyof T>(field: K, value: T[K]): Promise<T | null>;

    abstract findOne(id: string): Promise<T | null>;

    abstract findOneByRaw(condition: Record<string, any>): Promise<T | null>;

    abstract created(payload: Required<T>): Promise<T>

    abstract updated(id: string, payload: Partial<T>): Promise<T>;

    abstract deleted(id: string): Promise<T>;
}
export interface IPaginationDTO {
    page: number ;
    limit: number;
    keyword?: string;
}