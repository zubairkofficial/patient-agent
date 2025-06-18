import { Module } from '@nestjs/common';
import { EmotionsService } from './emotions.service';

@Module({
  providers: [EmotionsService]
})
export class EmotionsModule {}
