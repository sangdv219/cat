import { OTPService } from '@/modules/auth/services/OTP.service';
import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';
import * as nodemailer from 'nodemailer';

config();
@Injectable()
export class EmailService {
  constructor() {}
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
  async sendRegistrationEmail(email: string, otp: number): Promise<void> {
    await this.transporter.sendMail({
      from: `"Fintech App" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Mã OTP xác thực tài khoản',
      html: `<p>Mã OTP của bạn là: <b>${otp}</b>. Thời hạn là 5p. Vui lòng sử dụng mã này để xác thực tài khoản của bạn.</p>`,
    });
  }
}
