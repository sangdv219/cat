import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class VerifyOtpDto {
    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Email must be a valid email address' })
    email: string;
    @IsNotEmpty({ message: 'OTP is required' })
    @MinLength(6, { message: 'OTP must be at least 6 characters long' })
    otp: string;
}