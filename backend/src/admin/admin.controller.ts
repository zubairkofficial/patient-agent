import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { AdminProfileService } from './admin.service';
import { AdminGuard } from './auth/admin.guard'; // Adjust path if needed

@Controller('admin/profile')
@UseGuards(AdminGuard)
export class AdminProfileController {
  constructor(private readonly adminProfileService: AdminProfileService) {}

  @Get('get')
  async getOpenAIKey() {
    return this.adminProfileService.getKey();
  }

  @Put('update')
  async upsertOpenAIKey(@Body('openaikey') openaikey: string) {
    return this.adminProfileService.upsertKey(openaikey);
  }
}
