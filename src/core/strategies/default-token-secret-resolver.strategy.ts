import { Injectable } from '@nestjs/common';
import { TokenSecretResolver } from '@modules/auth/interface/tokenSecret.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DefaultTokenSecretResolverStrategy implements TokenSecretResolver {
  private readonly secretMap: Record<string, string>;

  constructor(
    private readonly configService: ConfigService
  ) {
    this.secretMap = {
      access: this.configService.getOrThrow('ACCESS_TOKEN_SECRET'),
      refresh: this.configService.getOrThrow('REFRESH_TOKEN_SECRET'),
      otp: this.configService.getOrThrow('OTP_TOKEN_SECRET'),
    };
  }

  resolve(type: string): string {
    const secret = this.secretMap[type];
    if (!secret) throw new Error(`No secret found for type: ${type}`);
    return secret;
  }
}
