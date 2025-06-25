import { Column, Model, Table, ForeignKey, Unique, DataType } from 'sequelize-typescript';
import { Section } from './section.model';
import { Skills } from './skills.model';
import { All } from '@nestjs/common';

@Table({ tableName: 'join_section_skills' })
export class JoinSectionSkills extends Model {
  @Unique('section-skills')
  @ForeignKey(() => Section)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  sectionId: number;

  @Unique('section-skills')
  @ForeignKey(() => Skills)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  skillId: number;
}
