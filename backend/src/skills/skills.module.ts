// src/skills/skills.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Skills } from '../model/skills.model';
import { SkillsService } from './skills.service';
import { SkillsController } from './skills.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [SequelizeModule.forFeature([Skills])],
  controllers: [SkillsController],
  providers: [SkillsService, JwtService],
  exports: [SkillsService], // 🔁 Exported in case other modules use it
})
export class SkillsModule {}
