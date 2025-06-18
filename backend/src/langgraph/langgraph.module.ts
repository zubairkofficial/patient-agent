// src/langgraph/langgraph.module.ts
import { Module } from '@nestjs/common';
import { LanggraphService } from './langgraph.service';
import { LanggraphController } from './langgraph.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [LanggraphService],
  controllers: [LanggraphController],
  exports: [LanggraphService], // Optional if you want to use the service elsewhere
})
export class LanggraphModule {}
