import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ResponseService } from './response.service';
import { CreateResponseDto } from './dto/response.dto';

@Controller('responses')
export class ResponseController {
  constructor(private readonly responseService: ResponseService) {}

  // ✅ User creates a response
  @Post()
  create(@Body() dto: CreateResponseDto) {
    return this.responseService.create(dto);
  }

  // ✅ User reads responses by doctorId
  @Get('doctor/:doctorId')
  findByDoctorId(@Param('doctorId', ParseIntPipe) doctorId: number) {
    return this.responseService.findByDoctorId(doctorId);
  }
}
