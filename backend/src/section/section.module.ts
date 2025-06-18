import { Module } from '@nestjs/common';
import { SectionService } from './section.service';

@Module({
  providers: [SectionService]
})
export class SectionModule {}
