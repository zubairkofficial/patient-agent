import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { StatementService } from './statement.service';
import { CreateStatementDto } from './dto/statement.dto';
import { UpdateStatementDto } from './dto/statement.dto';
import { AdminGuard } from './auth/admin.guard';
import { RolesGuard } from './auth/role.guard';
import { Roles } from './auth/role.decoder';

@Controller('statement')
export class StatementController {
  constructor(private readonly statementService: StatementService) {}

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() dto: CreateStatementDto) {
    return this.statementService.create(dto);
  }

  @Get()
  @UseGuards(AdminGuard)
  findAll() {
    return this.statementService.findAll();
  }

  @Get('by-id/:id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'user')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.statementService.findById(id);
  }

  @Get('by-section/:sectionId')
  @UseGuards(RolesGuard)
  @Roles('user')
  findBySection(@Param('sectionId', ParseIntPipe) sectionId: number) {
    return this.statementService.findBySectionId(sectionId);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateStatementDto) {
    return this.statementService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.statementService.delete(id);
  }
}
