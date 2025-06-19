import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Response } from '../model/response.model';
import { CreateResponseDto } from './dto/response.dto';

@Injectable()
export class ResponseService {
  constructor(
    @InjectModel(Response)
    private responseModel: typeof Response,
  ) {}

  async create(dto: CreateResponseDto): Promise<Response> {
    return this.responseModel.create({... dto});
  }

  async findByDoctorId(doctorId: number): Promise<Response[]> {
    return this.responseModel.findAll({
      where: { doctorId },
      include: ['statement'], // Optional
    });
  }
}
