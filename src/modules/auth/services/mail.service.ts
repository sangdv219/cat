import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  constructor(
    private readonly configService: ConfigService
  ) { 
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: this.configService.getOrThrow('SMTP_USER'), // email
        pass: this.configService.getOrThrow('SMTP_PASS'), // app password
      },
      tls: {
        rejectUnauthorized: false, // tránh lỗi SSL trong dev
      },
    });
  }

  private transporter: nodemailer.Transporter;

  async sendRegistrationEmail(email: string, otp: number): Promise<void> {
    await this.transporter.sendMail({
      from: `"Fintech App" <${this.configService.getOrThrow('SMTP_USER')}>`,
      to: email,
      subject: 'Mã OTP xác thực tài khoản',
      html: `<p>Mã OTP của bạn là: <b>${otp}</b>. Thời hạn là 5p. Vui lòng sử dụng mã này để xác thực tài khoản của bạn.</p>`,
    });
  }
}
