// src/emotions/emotions.module.ts
import { Module } from '@nestjs/common';
import { EmotionsService } from './emotions.service';
import { EmotionsController } from './emotions.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Emotions } from '../model/emotions.model';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    SequelizeModule.forFeature([Emotions]),
    
    // 👇 Make sure JwtModule is imported
    JwtModule.register({ 
      secret: process.env.JWT_SECRET || 'your_jwt_secret', // Set your actual secret here
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [EmotionsController],
  providers: [EmotionsService],
})
export class EmotionsModule {}
