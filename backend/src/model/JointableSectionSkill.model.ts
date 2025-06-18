import {
    Column,
    Model,
    Table,
ForeignKey
} from 'sequelize-typescript';
import { Section } from './section.model';
import { Skills } from './skills.model';


@Table({ tableName: 'join_section_skills' })
export class JoinSectionSkills extends Model {
  @ForeignKey(() => Section)
  @Column
  sectionId: number;

  @ForeignKey(() => Skills)
  @Column
  skillId: number;
}
