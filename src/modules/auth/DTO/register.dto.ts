import { IsEmail, IsNotEmpty } from "class-validator";

export class RegisterDto {
    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Email must be a valid email address' })
    email: string;
}