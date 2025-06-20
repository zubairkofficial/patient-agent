import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { EmailService } from './services/email.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { User } from '../model/user.model';
import { Doctor } from 'src/model/doctorprofile.model';

@Module({
  imports: [
    SequelizeModule.forFeature([User , Doctor]),
    PassportModule,
   
    ConfigModule
  ],
  controllers: [AuthController],
  providers: [AuthService, EmailService, JwtService],
  exports: [AuthService],
})
export class AuthModule {}
