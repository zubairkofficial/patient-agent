// admin.controller.ts
import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common'
import { AdminProfileService } from './admin.service'
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard'
import { RolesGuard } from 'src/guards/role.guard'
import { Roles } from 'src/emotions/auth/roles.decorator'
import { Role } from 'src/utils/roles.enum'

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminProfileController {
  constructor(private readonly adminProfileService: AdminProfileService) {}

  @Get('/get')
  @Roles(Role.ADMIN)
  async getOpenAIKey() {
    return this.adminProfileService.getKey()
  }

  @Put('/update')
  @Roles(Role.ADMIN)
  async upsertOpenAIKey(@Body('openaikey') openaikey: string) {
    return this.adminProfileService.upsertKey(openaikey)
  }
}
