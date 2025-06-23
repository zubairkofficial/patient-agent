import {
  Column,
  Model,
  Table,
  DataType,
  PrimaryKey,
  BelongsToMany,
  HasMany,
} from 'sequelize-typescript';
import { IsNotEmpty } from 'class-validator';
import { Skills } from './skills.model';
import { JoinSectionSkills } from './JointableSectionSkill.model';
import { Statement } from './statement.model';

@Table({
  tableName: 'section',
  timestamps: true,
})
export class Section extends Model {
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare title: string;

  @Column({
      type: DataType.TEXT,
      allowNull: true,
    })
  @IsNotEmpty()
  declare description: string;

  @HasMany(() => Statement)
  statementList: Statement[]

  @BelongsToMany(() => Skills, () => JoinSectionSkills)
  skillList: Skills[];
    skills: any;
    skillId: any;
}
