import { Column, Model, Table, ForeignKey, Unique, DataType } from 'sequelize-typescript';
import { Emotions } from './emotions.model';
import { Statement } from './statement.model';
import { Section } from './section.model';

@Table({ tableName: 'join_statement_emotions' })
export class joinstatementemotions extends Model {
  @Unique('statment-emotion')
  @ForeignKey(() => Emotions)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  emotionId: number;

  @Unique('statment-emotion')
  @ForeignKey(() => Statement)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  statementId: number;

  @ForeignKey(() => Section)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  sectionId: number;
}
