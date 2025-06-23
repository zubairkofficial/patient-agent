// src/emotions/emotions.module.ts
import { Module } from '@nestjs/common';
import { EmotionsService } from './emotions.service';
import { EmotionsController } from './emotions.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Emotions } from '../model/emotions.model';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Statement } from 'src/model/statement.model';

@Module({
  imports: [SequelizeModule.forFeature([Emotions, Statement])],
  controllers: [EmotionsController],
  providers: [EmotionsService, JwtService],
})
export class EmotionsModule {}
