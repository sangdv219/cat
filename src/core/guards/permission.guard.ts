import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from '@modules/users/domain/models/user.model';
import { Reflector } from '@nestjs/core';
import { TokenSecretResolver } from '@modules/auth/interface/tokenSecret.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class PermissionAuthGuard implements CanActivate {
    private readonly logger = new Logger(PermissionAuthGuard.name);
    constructor(
        private readonly jwtService: JwtService,
        private readonly reflector: Reflector,
        @Inject('TokenSecretResolver')
        private readonly tokenSecretResolver: TokenSecretResolver,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        Logger.log('request:', request.user);
        const user = request.user;
        if(!user.roles.includes('ADMIN')) throw new ForbiddenException()
        return true
    }
    // private extractTokenFromHeader(request: Request): string | undefined {
    //     const [type, token] = request.headers.authorization?.split(' ') ?? [];
    //     return type === 'Bearer' ? token : undefined;
    // }
}
