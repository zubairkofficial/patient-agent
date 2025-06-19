import { Column, Model, Table, ForeignKey, Unique } from 'sequelize-typescript';
import { Section } from './section.model';
import { Skills } from './skills.model';

@Table({ tableName: 'join_section_skills' })
export class JoinSectionSkills extends Model {
  @ForeignKey(() => Section)
  @Unique
  @Column
  sectionId: number;

  @ForeignKey(() => Skills)
  @Unique
  @Column
  skillId: number;
}
