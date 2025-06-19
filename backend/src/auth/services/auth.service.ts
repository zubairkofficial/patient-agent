import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { EmailService } from './email.service';
import {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyEmailDto,
  VerifyOtpDto,
} from '../dto/auth.dto';
import { Op } from 'sequelize';
import { User } from '../../model/user.model';
import { Doctor } from 'src/model/doctorprofile.model';

@Injectable()
export class AuthService {
  private logger = new Logger()
  constructor(
    private jwtService: JwtService,
    private emailService: EmailService,
  ) { }

  async register(registerDto: RegisterDto) {
    const existingUser = await User.findOne({ where: { email: registerDto.email } });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = await User.create({
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      email: registerDto.email,
      password: hashedPassword,
      role: "user",
      verificationToken,
      isEmailVerified: false,
    }).then(async (user) => {
      await Doctor.create({
        userId: user.id
      })
      this.logger.log("created doctor")
    })


    // await this.emailService.sendVerificationEmail(user.email, verificationToken);

    return { message: 'Registration successful. Please check your email for verification.' };
  }

  async login(loginDto: LoginDto) {
    const email = loginDto.email?.trim();
    const password = loginDto.password;

    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    const user = await User.findOne({
      where: { email: { [Op.eq]: email } },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Please verify your email first');
    }

    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const user = await User.findOne({ where: { verificationToken: verifyEmailDto.token } });

    if (!user) {
      throw new BadRequestException('Invalid verification token');
    }

    if (user.isEmailVerified) {
      return { message: 'Email already verified' };
    }

    user.isEmailVerified = true;
    user.verificationToken = null;
    await user.save();

    return { message: 'Email verified successfully' };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await User.findOne({ where: { email: forgotPasswordDto.email } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    await this.emailService.sendPasswordResetEmail(user.email, resetToken);

    return { message: 'Password reset instructions sent to your email' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await User.findOne({
      where: {
        resetPasswordToken: resetPasswordDto.token,
        resetPasswordExpires: { [Op.gt]: new Date() },
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    user.password = await bcrypt.hash(resetPasswordDto.newPassword, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return { message: 'Password reset successful' };
  }

  async generateOtp(email: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = await bcrypt.hash(otp, 10);
    user.otpExpires = new Date(Date.now() + 600000); // 10 minutes
    await user.save();

    await this.emailService.sendOtpEmail(email, otp);

    return { message: 'OTP sent to your email' };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const user = await User.findOne({
      where: {
        email: verifyOtpDto.email,
        otpExpires: { [Op.gt]: new Date() },
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    const isOtpValid = await bcrypt.compare(verifyOtpDto.otp, `${user.otp}`);
    if (!isOtpValid) {
      throw new UnauthorizedException('Invalid OTP');
    }

    user.otp = null;
    user.otpExpires = null;
    await user.save();

    return { message: 'OTP verified successfully' };
  }
}
