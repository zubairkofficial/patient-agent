// ✅ langgraph.controller.ts (UPDATED)
import { Controller, Get, Query } from '@nestjs/common';
import { LanggraphService } from './langgraph.service';

@Controller('langgraph')
export class LanggraphController {
  constructor(private readonly langgraphService: LanggraphService) {}

  @Get('ask')
  async askQuestion(
    @Query('prompt') prompt: string,
  ) {
    const response = await this.langgraphService.runGraphAgent(prompt);
    return { response };
  }

  @Get('confirm')
  async confirmExecution(
    @Query('prompt') prompt: string,
    @Query('confirm') confirm: string,
  ) {
    const response = await this.langgraphService.runGraphAgent(prompt, confirm);
    return { response };
  }
}
