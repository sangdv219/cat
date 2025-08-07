import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { UserModel } from "models/user.model";

@Injectable()
export class PermissionAuthGuard implements CanActivate {
    constructor(
        @InjectModel(UserModel)
        private userModel:typeof UserModel,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const userId = request.user.id;
        const userData = await this.userModel.findOne({
            where: { id: userId },
        });
        const isRoot = userData?.toJSON().is_root;

        return isRoot;
    }
}