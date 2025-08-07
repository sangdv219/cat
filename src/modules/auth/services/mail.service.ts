import { Injectable } from "@nestjs/common";
import Redis from 'ioredis';
import { InjectModel } from "@nestjs/sequelize";
import * as nodemailer from 'nodemailer';
import { config } from "dotenv";
import { OTPService } from "@/modules/auth/services/OTP.service";
import { VerifyOTPResponseDto } from "../interface/verifyOTP.interface";
config();
@Injectable()
export class EmailService {
    constructor(
        private readonly OTPService: OTPService,
    ) { }
    private transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER, // email
            pass: process.env.SMTP_PASS, // app password
        },
        tls: {
            rejectUnauthorized: false, // tránh lỗi SSL trong dev
        },
    });
    async sendRegistrationEmail(email: string): Promise<VerifyOTPResponseDto> {
        const redis = new Redis();
        const otp = this.OTPService.gennerateOtp()

        const info = {
            otp,
            email,
        }

        await redis.set('otp', JSON.stringify(info), 'EX', 300);

        // Logic to send registration email
        try {
            const info = await this.transporter.sendMail({
                from: `"Fintech App" <${process.env.SMTP_USER}>`,
                to: email,
                subject: 'Mã OTP xác thực tài khoản',
                html: `<p>Mã OTP của bạn là: <b>${otp}</b>. Vui lòng sử dụng mã này để xác thực tài khoản của bạn.</p>`,
            });
        } catch (error) {
            console.log("--error send email--: ", error);
        }

        return {
            success: true,
            otpToken: otp, 
        };
    }
}