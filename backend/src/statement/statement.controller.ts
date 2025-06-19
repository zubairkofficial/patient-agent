import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { StatementService } from './statement.service';
import { CreateStatementDto } from './dto/statement.dto';
import { UpdateStatementDto } from './dto/statement.dto';
import { RolesGuard } from '../guards/role.guard';
import { Roles } from './auth/role.decoder';
import { Role } from 'src/utils/roles.enum';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('statement')
export class StatementController {
  constructor(private readonly statementService: StatementService) { }

  @Post('/')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() dto: CreateStatementDto) {
    return this.statementService.create(dto);
  }

  @Get('get')
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAll() {
    return this.statementService.findAll();
  }

  @Get('get/:id')
  @Roles(Role.USER, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.statementService.findById(id);
  }

  @Get('section/:sectionId')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findBySection(@Param('sectionId', ParseIntPipe) sectionId: number) {
    return this.statementService.findBySectionId(sectionId);
  }

  @Put('update/:id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateStatementDto) {
    return this.statementService.update(id, dto);
  }

  @Delete('delete/:id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.statementService.delete(id);
  }
}
