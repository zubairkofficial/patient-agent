import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { ResponseService } from './response.service';
import { CreateResponseDto } from './dto/response.dto';

@Controller('responses')
export class ResponseController {
  constructor(private readonly responseService: ResponseService) {}

  @Post('create')
  async create(@Body() dto: CreateResponseDto) {
    return this.responseService.create(dto);
  }

  @Get('doctor/:doctorId')
  async getByDoctorId(@Param('doctorId') doctorId: number) {
    return this.responseService.findByDoctorId(Number(doctorId));
  }
}
