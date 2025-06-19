import {
    Column,
    Model,
    Table,
ForeignKey,
Unique,
} from 'sequelize-typescript';
import { Section } from './section.model';
import { Skills } from './skills.model';


@Table({ tableName: 'join_section_skills' })
export class JoinSectionSkills extends Model {
  @ForeignKey(() => Section)
  @Column
  @Unique
  sectionId: number;

  @ForeignKey(() => Skills)
  @Column
  @Unique
  skillId: number;
}
