import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SectionService } from './section.service';
import { SectionController } from './section.controller';
import { Section } from 'src/model/section.model';
import { Skills } from 'src/model/skills.model';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [SequelizeModule.forFeature([Section, Skills])],
  providers: [SectionService, JwtService],
  controllers: [SectionController],
  exports: [SectionService],
})
export class SectionModule {}
