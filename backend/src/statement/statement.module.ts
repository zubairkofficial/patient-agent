import { Module } from '@nestjs/common';
import { StatementService } from './statement.service';

@Module({
  providers: [StatementService]
})
export class StatementModule {}
