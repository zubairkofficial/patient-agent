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

    async create(sectionDto: SectionDto, role: 'admin') {
        const section = await this.sectionModel.create({
            title: sectionDto.title,
            description: sectionDto.description,
        });
        if (sectionDto.skillIds && sectionDto.skillIds.length > 0) {

            sectionDto.skillIds.forEach(async (skillId: number) => {
                await JoinSectionSkills.create({
                    sectionId: section.id,
                    skillId: skillId
                })
            });
        }
        return section;
    }

    async findAll() {
        return await this.sectionModel.findAll({ include: [Skills] });
    }

    async update(id: number, sectionDto: any, role: string) {
        if (role !== 'admin') throw new ForbiddenException('Only admin can update');
        const section = await this.sectionModel.findByPk(id);
        if (!section) throw new NotFoundException('Section not found');

        await section.update(sectionDto);
        if (sectionDto.skillIds) {
            const skills = await this.skillsModel.findAll({ where: { id: sectionDto.skillId } });
            await section.$set('skillList', skills);
        }
        return section;
    }

    async delete(id: number, role: string) {
        if (role !== 'admin') throw new ForbiddenException('Only admin can delete');
        const section = await this.sectionModel.findByPk(id);
        if (!section) throw new NotFoundException('Section not found');
        await section.destroy();
        return { message: 'Section deleted successfully' };
    }
}