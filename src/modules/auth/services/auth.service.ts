import { LoginDto } from "@/modules/auth/DTO/login.dto";
import { LoginResponseDto } from "@/modules/auth/interface/login.interface";
import { RefreshTokenResponseDto } from "@/modules/auth/interface/refreshToken.interface";
import { PasswordService } from "@/modules/password/services/password.service";
import { UserService } from "@/modules/users/services/user.service";
import { UserNotActiveException } from "@/shared/exceptions/user-not-active.exception";
import { GoneException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from "@nestjs/sequelize";
import { config } from "dotenv";
import { UserModel } from "models/user.model";
import { RegisterDto } from "../DTO/register.dto";
import { EmailService } from "./mail.service";
import { VerifyOTPResponseDto } from "../interface/verifyOTP.interface";

config();
@Injectable()
export class AuthService {
    constructor(
        readonly userService: UserService,
        private readonly passwordService: PasswordService,
        private jwtService: JwtService,
        private readonly emailService: EmailService,
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
                const accessToken = await this.jwtService.signAsync(payload, { secret: process.env.ACCESS_TOKEN_SECRET, expiresIn: '1h' });
                const refreshToken = await this.jwtService.signAsync(payload, { secret: process.env.REFRESH_TOKEN_SECRET, expiresIn: '1y' });

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
            const tokenOld = this.jwtService.verify(refreshToken, { secret: process.env.REFRESH_TOKEN_SECRET });
            if (!tokenOld) {
                throw new UnauthorizedException("Invalid refresh token");
            }
            const user = await this.userService.findOne(tokenOld.id);

            if (!user) {
                throw new NotFoundException("User not found");
            }
            if (!user.is_active) {
                throw new UserNotActiveException(user.email);
            }
            if (user.deleted_at) {
                throw new GoneException("Account has been deleted");
            }

            const payload = { email: user.email, id: user.id };
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

    async register(body: RegisterDto): Promise<VerifyOTPResponseDto> {
        const { email } = body;
        const existingUser = await this.userService.findEmail(email);

        if (existingUser) {
            throw new UnauthorizedException("Email already exists");
        }

        // await this.emailService.sendRegistrationEmail(email);

        const payload = { email: email  }

        const OTPToken = await this.jwtService.signAsync(payload, { secret: process.env.OTP_TOKEN_SECRET, expiresIn: '5m' });

        return {
            success: true,
            otpToken: OTPToken
        };
    }


}