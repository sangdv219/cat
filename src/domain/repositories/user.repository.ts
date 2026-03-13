import { UserEntity } from "@/infrastructure/models/user.model";
import { PaginationQueryDto } from "@/shared/dto/common";

export interface IUserRepository {
    getAll(dto: PaginationQueryDto):Promise<UserEntity[] | null>
    findByEmail(email: string):Promise<UserEntity | null>
    // created(): Promise<void>
    // updated(): Promise<void>
    // destroy(): Promise<void>
  }