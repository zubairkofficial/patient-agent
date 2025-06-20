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
import { CreateEmotionDto, UpdateEmotionDto } from './dto/emotion.dto';
import { RolesGuard } from './auth/roles.guard';
import { Roles } from './auth/roles.decorator';
import { Role } from 'src/utils/roles.enum';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('emotions')
@UseGuards(JwtAuthGuard, RolesGuard) // ✅ apply guards at controller level
export class EmotionsController {
  constructor(private readonly emotionsService: EmotionsService) {}

  @Post('/')
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateEmotionDto) {
    return this.emotionsService.create(dto);
  }

  @Get('getall')
  @Roles(Role.ADMIN)
  findAll() {
    return this.emotionsService.findAll();
  }

  @Get('get/:id')
  @Roles(Role.USER)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.emotionsService.findOne(id);
  }

  @Patch('update/:id')
  @Roles(Role.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEmotionDto) {
    return this.emotionsService.update(id, dto);
  }
}
