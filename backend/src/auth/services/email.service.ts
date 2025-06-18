import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    console.log("asdf", process.env.MAIL_HOST)
    this.transporter = nodemailer.createTransport({
      host: `${process.env.MAIL_HOST}`,
      port: Number(process.env.MAIL_PORT),
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  async sendVerificationEmail(to: string, token: string) {
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    await this.transporter.sendMail({
      from: process.env.MAIL_USER,
      to,
      subject: 'Verify Your Email',
      html: `
        <h1>Welcome!</h1>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${verificationLink}">Verify Email</a>
      `,
    });
  }

  async sendPasswordResetEmail(to: string, token: string) {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await this.transporter.sendMail({
      from: process.env.MAIL_USER,
      to,
      subject: 'Reset Your Password',
      html: `
        <h1>Password Reset Request</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });
  }

  async sendOtpEmail(to: string, otp: string) {
    await this.transporter.sendMail({
      from: process.env.MAIL_USER,
      to,
      subject: 'Your OTP Code',
      html: `
        <h1>Your OTP Code</h1>
        <p>Here is your OTP code for verification:</p>
        <h2>${otp}</h2>
        <p>This code will expire in 10 minutes.</p>
      `,
    });
  }
}
