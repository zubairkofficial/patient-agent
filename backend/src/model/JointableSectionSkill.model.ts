import { Column, Model, Table, ForeignKey, Unique } from 'sequelize-typescript';
import { Section } from './section.model';
import { Skills } from './skills.model';

@Table({ tableName: 'join_section_skills' })
export class JoinSectionSkills extends Model {
  @ForeignKey(() => Section)
  @Unique('section-skills')
  @Column
  sectionId: number;

  @ForeignKey(() => Skills)
  @Unique('section-skills')
  @Column
  skillId: number;
}
