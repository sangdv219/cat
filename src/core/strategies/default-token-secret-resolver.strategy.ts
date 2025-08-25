import { Injectable } from "@nestjs/common";
import { TokenSecretResolver } from "../../modules/auth/interface/tokenSecret.interface";

@Injectable()
export class DefaultTokenSecretResolverStrategy implements TokenSecretResolver {
    private readonly secretMap: Record<string, string> = {
        'access': process.env.ACCESS_TOKEN_SECRET || (() => { throw new Error('Missing ACCESS_TOKEN_SECRET') })(),
        'refresh': process.env.REFRESH_TOKEN_SECRET || (() => { throw new Error('Missing REFRESH_TOKEN_SECRET') })(),
        'otp': process.env.OTP_TOKEN_SECRET || (() => { throw new Error('Missing EMAIL_TOKEN_SECRET') })(),
    }
    resolve(type: string): string {
        const secret = this.secretMap[type];
        if (!secret) {
            throw new Error(`No secret found for type: ${type}`);
        }
        return secret;
    }
}