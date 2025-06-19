import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Statement } from '../model/statement.model';
import { StatementService } from './statement.service';
import { StatementController } from './statement.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [SequelizeModule.forFeature([Statement])],
  providers: [StatementService , JwtService],
  controllers: [StatementController],
})
export class StatementModule {}
