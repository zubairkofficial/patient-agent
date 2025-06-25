import {
  Body,
  UseGuards,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { SectionService } from './section.service';
import { Roles } from 'src/emotions/auth/roles.decorator';
import { Role } from 'src/utils/roles.enum';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/role.guard';

@Controller('section')
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @Post('/')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(@Body() body: any) {
    return this.sectionService.create(body);
  } 

  @Get(':id/section')
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findSectionById(@Param('id') id: number) {
    return this.sectionService.findSectionById(Number(id));
  }

  // @Get(':id/skills')
  // @Roles(Role.ADMIN, Role.USER)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // getSkillsBySection(@Param('id') id: number) {
  //   return this.sectionService.getSkillsBySection(id);
  // }

  @Get('/')
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findAll() {
    return this.sectionService.findAll();
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async update(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.sectionService.update(+id, body);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async delete(@Param('id') id: string, @Req() req: any) {
    return this.sectionService.delete(+id);
  }
}
