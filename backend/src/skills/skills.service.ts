import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Skills } from '../model/skills.model';
import {CreateSkillDto, UpdateSkillDto} from "./dto/skills.dto"

@Injectable()
export class SkillsService {
  constructor(
    @InjectModel(Skills)
    private readonly skillsModel: typeof Skills,
  ) {}

  async create(dto: CreateSkillDto) {
    return this.skillsModel.create({ ...dto });
  }

  async findAll() {
    return this.skillsModel.findAll();
  }

  async findById(id: number) {
    const skill = await this.skillsModel.findByPk(id);
    if (!skill) throw new NotFoundException('Skill not found');
    return skill;
  }

  async update(id: number, dto: UpdateSkillDto) {
    const skill = await this.findById(id);
    return skill.update(dto);
  }

  async delete(id: number) {
    const skill = await this.findById(id);
    return skill.destroy();
  }
}
