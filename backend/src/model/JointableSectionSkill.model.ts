import { Column, Model, Table, ForeignKey, Unique } from 'sequelize-typescript';
import { Section } from './section.model';
import { Skills } from './skills.model';

@Table({ tableName: 'join_section_skills' })
export class JoinSectionSkills extends Model {
  @Unique('section-skills')
  @ForeignKey(() => Section)
  @Column
  sectionId: number;

  @Unique('section-skills')
  @ForeignKey(() => Skills)
  @Column
  skillId: number;
}
