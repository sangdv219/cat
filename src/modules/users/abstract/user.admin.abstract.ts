import { BaseRepository } from "@/core/repositories/base.repository";
import { UserModel } from "@/modules/users/domain/models/user.model";

export abstract class AbstractUserRepository extends BaseRepository<UserModel> {}