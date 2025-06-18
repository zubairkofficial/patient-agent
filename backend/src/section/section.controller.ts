import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import { SectionService } from './section.service';

@Controller('section')
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @Post()
  async create(@Body() body: any, @Req() req: any) {
    return this.sectionService.create(body, req.user.role);
  }

  @Get()
  async findAll() {
    return this.sectionService.findAll();
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.sectionService.update(+id, body, req.user.role);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: any) {
    return this.sectionService.delete(+id, req.user.role);
  }
}
