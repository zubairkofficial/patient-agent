import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Statement } from '../model/statement.model';
import { StatementService } from './statement.service';
import { StatementController } from './statement.controller';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Emotions } from 'src/model/emotions.model';

@Module({
  imports: [SequelizeModule.forFeature([Statement , Emotions])],
  providers: [StatementService , JwtService ],
  controllers: [StatementController],
})
export class StatementModule {}
