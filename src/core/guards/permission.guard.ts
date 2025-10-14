import { PERMISSIONS_KEY } from '@core/decorators/permissions.decorator';
import { TokenSecretResolver } from '@modules/auth/interface/tokenSecret.interface';
import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { RedisContext } from '@redis/enums/redis-key.enum';
import { buildRedisKeyQuery } from '@redis/helpers/redis-key.helper';
import { RedisService } from '@redis/redis.service';
import { RESOURCE_KEY } from '../decorators/resource.decorator';
import { ACTION_KEY } from '../decorators/action.decorator';

@Injectable()
export class PermissionAuthGuard implements CanActivate {
    private readonly logger = new Logger(PermissionAuthGuard.name);
    constructor(
        private readonly jwtService: JwtService,
        private readonly reflector: Reflector,
        @Inject('TokenSecretResolver')
        private readonly tokenSecretResolver: TokenSecretResolver,
        private readonly cacheManager: RedisService,

    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        // const routePath = request.route.path;
        const handler = context.getHandler();       // function của method (ví dụ UsersController.findOne)
        const controller = context.getClass();
        const basePath = Reflect.getMetadata('path', controller);
        Logger.log('basePath:', basePath);
        // Logger.log('fullRoute:', fullRoute);

        // Logger.log('request__:', request.user);
        const session_id = request.user.session_id;
        if (!session_id) {
            throw new UnauthorizedException('No session_id provided');
        }
        const redisKey = buildRedisKeyQuery('auth', RedisContext.SESSION, {}, session_id);
        const cache = await this.cacheManager.get(redisKey);

        if (!cache) {
            throw new UnauthorizedException('Session expired or invalid');
        }

        const resource = this.reflector.getAllAndOverride<string>(RESOURCE_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        const action = this.reflector.getAllAndOverride<string>(ACTION_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        Logger.log('resource:', resource);
        Logger.log('action:', action);
        

        if (!resource || !action) return true;

        const hasPermission = cache.permissions?.[resource]?.[action] === true;
   
        if (!hasPermission) throw new ForbiddenException(`Forbidden: Missing permission [${resource}.${action}]`);

        return true
    }
}
