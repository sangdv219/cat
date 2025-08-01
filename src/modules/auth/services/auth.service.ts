import { GoneException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { UserService } from "@/modules/users/services/user.service";
import { LoginDto } from "@/modules/auth/DTO/login.dto";
import { LoginResponseDto } from "@/modules/auth/interface/login.interface";
import { Cron } from '@nestjs/schedule';
import { UserNotActiveException } from "@/shared/exceptions/user-not-active.exception";
import { PasswordService } from "@/modules/password/services/password.service";
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenResponseDto } from "@/modules/auth/interface/refreshToken.interface";
import { config } from "dotenv";

config();
@Injectable()
export class AuthService {
    constructor(
        readonly userService: UserService,
        private readonly passwordService: PasswordService,
        private jwtService: JwtService,
    ) { }

    async login(body: LoginDto): Promise<LoginResponseDto> {
        const { email, password } = body;

        const user = await this.userService.findEmail(email);
        const userData = user?.get({ plain: true });
        if (userData.locked_until && new Date() > new Date(userData.locked_until)) {
            await this.userService.resetFailedLogins(userData.id);
        }
        if (userData.locked_until && new Date() < new Date(userData.locked_until)) {
            throw new GoneException(`Account locked until 3 minutes from last failed login attempt`);
        }
        if (userData) {
            if (!userData.is_active) {
                throw new UserNotActiveException(email);
            }
            if (userData.deleted_at) {
                throw new GoneException("Account has been deleted");
            }
            const isPasswordValid = await this.passwordService.comparePassword(password, userData.password_hash);
            if (isPasswordValid) {
                await this.userService.resetFailedLogins(userData.id);
                const payload = { email: userData.email, id: userData.id }
                const accessToken = await this.jwtService.signAsync(payload, { secret: process.env.ACCESS_TOKEN_SECRET, expiresIn: '15m' });
                const refreshToken = await this.jwtService.signAsync(payload, { secret: process.env.REFRESH_TOKEN_SECRET, expiresIn: '7d' });

                const response = new LoginResponseDto();
                response.success = true;
                response.accessToken = accessToken;
                response.refreshToken = refreshToken;
                return response;

            } else {
                this.userService.incrementFailedLogins(userData.id);
                throw new UnauthorizedException("Password is not correct");
            }
        } else {
            this.userService.incrementFailedLogins(userData.id);
            throw new NotFoundException("User not found");
        }
    }

    async refreshToken(refreshToken: string): Promise<RefreshTokenResponseDto> {
        try {
            const tokenOld = this.jwtService.verify(refreshToken);
            if (!tokenOld) {
                throw new UnauthorizedException("Invalid refresh token");
            }

            const user = await this.userService.findOne(tokenOld.id);
            const userData = user?.get({ plain: true });

            if (!userData) {
                throw new NotFoundException("User not found");
            }
            if (!userData.is_active) {
                throw new UserNotActiveException(userData.email);
            }
            if (userData.deleted_at) {
                throw new GoneException("Account has been deleted");
            }

            const payload = { email: userData.email, id: userData.id };
            const newAccessToken = await this.jwtService.signAsync(payload, { expiresIn: '15m' });
            const decoded = this.jwtService.decode(newAccessToken) as { exp: number };

            const response = new RefreshTokenResponseDto();
            response.success = true;
            response.accessToken = newAccessToken;
            response.expires = new Date(decoded.exp * 1000);

            return response;

        } catch (error) {
            console.log("error: ", error);

            if (error.name === 'TokenExpiredError') {
                throw new UnauthorizedException('Token expired');
            }
            throw new UnauthorizedException('Invalid token');
        }
    }

    @Cron('0 0 * * *') // Runs every day at midnight
    async handleCron() {
        // Implement any periodic tasks here if needed
    }
}