import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Section } from 'src/model/section.model';
import { Skills } from 'src/model/skills.model';
import { SectionDto } from './dto/section.dto';
import { JoinSectionSkills } from 'src/model/JointableSectionSkill.model';

@Injectable()
export class SectionService {
    constructor(
        @InjectModel(Section) private sectionModel: typeof Section,
        @InjectModel(Skills) private skillsModel: typeof Skills,
    ) { }

    async create(sectionDto: SectionDto) {
        const section = await this.sectionModel.create({
            title: sectionDto.title,
            description: sectionDto.description,
        });
        console.log('array bro', sectionDto.skills)
        if (sectionDto.skills && sectionDto.skills.length > 0) {
            console.log('here i cone')
            sectionDto.skills.forEach(async (skillId: number) => {
                console.log('creat kills join', skillId)
                await JoinSectionSkills.create({
                    sectionId: section.id,
                    skillId: skillId
                })
            });
        }
        console.log('ullu ka patha')
        return section;
    }  

async getSkillsBySection(sectionId: number) {
  const section = await this.sectionModel.findByPk(sectionId, {
    include: [{ model: Skills, through: { attributes: [] } }],
  });

  if (!section) throw new NotFoundException('Section not found');

  return section.skillId;
}

    async findAll() {
        return await this.sectionModel.findAll({
            include: [{
                model: Skills
            }]
        });
    }

    async update(id: number, sectionDto: any) {
        const section = await this.sectionModel.findByPk(id);
        if (!section) throw new NotFoundException('Section not found');

        await section.update(sectionDto);
        if (sectionDto.skillIds) {
            const skills = await this.skillsModel.findAll({ where: { id: sectionDto.skillId } });
            await section.$set('skillList', skills);
        }
        return section;
    }

    async delete(id: number) {
        const section = await this.sectionModel.findByPk(id);
        if (!section) throw new NotFoundException('Section not found');
        await section.destroy();
        return { message: 'Section deleted successfully' };
    }
}