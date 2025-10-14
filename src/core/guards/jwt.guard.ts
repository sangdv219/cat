import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { TokenSecretResolver } from '@modules/auth/interface/tokenSecret.interface';

@Injectable()
export class JWTAuthGuard implements CanActivate {
  private readonly logger = new Logger(JWTAuthGuard.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    @Inject('TokenSecretResolver')
    private readonly tokenSecretResolver: TokenSecretResolver,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    
    const TOKEN_TYPE_KEY = 'tokenType';
    const tokenType = this.reflector.get<string>(TOKEN_TYPE_KEY, context.getHandler()) ?? 'access';
    const secret = this.tokenSecretResolver.resolve(tokenType);
    try {
      request.user = await this.jwtService.verifyAsync(token, { secret });
      return true;
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expired');
      }
      throw new UnauthorizedException(error);
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
