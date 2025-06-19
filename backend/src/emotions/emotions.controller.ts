// src/emotions/emotions.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { EmotionsService } from './emotions.service';
import { CreateEmotionDto } from './dto/emotion.dto';
import { UpdateEmotionDto } from './dto/emotion.dto';
import { RolesGuard } from './auth/roles.guard';
import { Roles } from './auth/roles.decorator';

@Controller('emotions')
@UseGuards(RolesGuard)
export class EmotionsController {
  constructor(private readonly emotionsService: EmotionsService) {}

  @Post()
  @Roles('admin')
  create(@Body() dto: CreateEmotionDto) {
    return this.emotionsService.create(dto);
  }

  @Get()
  @Roles('admin')
  findAll() {
    return this.emotionsService.findAll();
  }

  @Get(':id')
  @Roles('admin')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.emotionsService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEmotionDto) {
    return this.emotionsService.update(id, dto);
  }
}
