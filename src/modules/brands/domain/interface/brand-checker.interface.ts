export interface IBrandCheckService{
    exists(brandId: string):Promise<boolean>
}