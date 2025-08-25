export interface ICategoryCheckService{
    exists(categoryId: string):Promise<boolean>
}