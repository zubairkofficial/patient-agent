// src/response/response.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Response } from '../model/response.model';
import { CreateResponseDto } from './dto/response.dto';

@Injectable()
export class ResponseService {
  constructor(
    @InjectModel(Response)
    private readonly responseModel: typeof Response,
  ) {}

  async create(dto: CreateResponseDto): Promise<Response> {
  try {
    const created = await this.responseModel.create({
      response: dto.userResponse,
      botRemarks: dto.botRemarks,
      rating: dto.rating,
      statementId: dto.statementId,
      doctorId: dto.doctorId || null,
    });
    return created;
  } catch (error) {
    throw new BadRequestException(
      error?.message || 'Failed to create response'
    );
  }
}

  async findByDoctorId(doctorId: number): Promise<Response[]> {
    try {
      const responses = await this.responseModel.findAll({
        where: { doctorId },
        include: ['statement'], // Ensure association exists in model
      });

      if (!responses.length) {
        throw new NotFoundException('No responses found for this doctor');
      }

      return responses;
    } catch (error) {
      throw new BadRequestException(
        error?.message || 'Failed to fetch responses',
      );
    }
  }
}
