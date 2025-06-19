import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SectionService } from './section.service';
import { SectionController } from './section.controller';
import { Section } from 'src/model/section.model';
import { Skills } from 'src/model/skills.model';

@Module({
  imports: [SequelizeModule.forFeature([Section, Skills])],
  providers: [SectionService],
  controllers: [SectionController],
  exports: [SectionService],
})
export class SectionModule {}
