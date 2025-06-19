import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Put,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/skills.dto';
import { UpdateSkillDto } from './dto/skills.dto';
import { AdminGuard } from '../guards/admin.guard'; // implement this separately
import { Roles } from 'src/statement/auth/role.decoder';
import { Role } from 'src/utils/roles.enum';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/role.guard';

@Controller('skills')
// @UseGuards(AdminGuard) // 🔐 Only Admins
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post('/')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() dto: CreateSkillDto) {
    return this.skillsService.create(dto);
  }

  @Get('get')
  findAll() {
    return this.skillsService.findAll();
  }

  @Get('get/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.skillsService.findById(id);
  }

  @Put('update/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSkillDto,
  ) {
    return this.skillsService.update(id, dto);
  }

  @Delete('delete/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.skillsService.delete(id);
  }
}
