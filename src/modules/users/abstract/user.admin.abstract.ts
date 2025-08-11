import { BaseRepository } from "@/shared/interface/common";
import { UserModel } from "models/user.model";

export abstract class AbstractUserRepository extends BaseRepository<UserModel> {}