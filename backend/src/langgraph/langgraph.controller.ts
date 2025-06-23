// ✅ langgraph.controller.ts (UPDATED)
import { Controller, Get, Post, Query , Body } from '@nestjs/common';
import { LanggraphService } from './langgraph.service';
import { Response } from './dto/response.dto';

@Controller('langgraph')
export class LanggraphController {
  constructor(private readonly langgraphService: LanggraphService) {}

  @Post('ask')
    runGraphAgent(@Body() dto: Response){
      // Assuming dto has a property called 'prompt'
      return this.langgraphService.runGraphAgent(dto);
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
