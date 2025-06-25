import {
  Column,
  Model,
  Table,
  DataType,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
  HasOne,
  BeforeUpdate,
} from 'sequelize-typescript';
import { Section } from './section.model';
import { Emotions } from './emotions.model';
import { joinstatementemotions } from './Jointablestatementemotion.model';
import { Response } from './response.model';
import { Op } from 'sequelize';

@Table({
  tableName: 'statement',
  timestamps: true,
})
export class Statement extends Model {
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare statement: string;

  // ✅ Foreign key to Section
  @ForeignKey(() => Section)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare sectionId: number;

  // ✅ Relationship to Section
  @BelongsTo(() => Section)
  section: Section;

  @BelongsToMany(() => Emotions, () => joinstatementemotions)
  emotion: Emotions[]

  @HasOne(() => Response)
  response: Response;


}
