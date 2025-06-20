import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { AdminProfileService } from './admin.service';
import { AdminGuard } from './auth/admin.guard'; // Adjust path if needed
import { Roles } from 'src/emotions/auth/roles.decorator';
import { Role } from 'src/utils/roles.enum';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/role.guard';

@Controller('admin/profile')
@UseGuards(AdminGuard)
export class AdminProfileController {
  constructor(private readonly adminProfileService: AdminProfileService) {}

  @Get('get')
  @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
  async getOpenAIKey() {
    return this.adminProfileService.getKey();
  }

  @Put('update')
  @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
  async upsertOpenAIKey(@Body('openaikey') openaikey: string) {
    return this.adminProfileService.upsertKey(openaikey);
  }
}
