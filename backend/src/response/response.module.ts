import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Response } from '../model/response.model';
import { ResponseService } from './response.service';
import { ResponseController } from './response.controller';
import { Doctor } from '../model/doctorprofile.model';
import { Statement } from '../model/statement.model';

@Module({
  imports: [SequelizeModule.forFeature([Response, Doctor, Statement])],
  controllers: [ResponseController],
  providers: [ResponseService],
})
export class ResponseModule {}
