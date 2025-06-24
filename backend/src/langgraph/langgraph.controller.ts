// ✅ langgraph.controller.ts (UPDATED)
import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { LanggraphService } from './langgraph.service';
import { ResponseDto } from './dto/response.dto';
import { Roles } from 'src/emotions/auth/roles.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/role.guard';

@Controller('langgraph')
export class LanggraphController {
  constructor(private readonly langgraphService: LanggraphService) {}

  @Post('ask')
  @Roles('user')
  @UseGuards(JwtAuthGuard, RolesGuard)
  runGraphAgent(@Body() dto: ResponseDto, @Req() req: any) {
    console.log('dto, req', dto, req);
    // Assuming dto has a property called 'prompt'
    return this.langgraphService.runGraphAgent(dto, req);
  }
  // @Get('confirm')
  // async confirmExecution(
  //   @Query('prompt') prompt: string,
  //   @Query('confirm') confirm: string,
  // ) {
  //   const response = await this.langgraphService.runGraphAgent();
  //   return { response };
  // }
}
