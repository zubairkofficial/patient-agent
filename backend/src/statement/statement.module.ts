import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Statement } from '../model/statement.model';
import { StatementService } from './statement.service';
import { StatementController } from './statement.controller';

@Module({
  imports: [SequelizeModule.forFeature([Statement])],
  providers: [StatementService],
  controllers: [StatementController],
})
export class StatementModule {}
