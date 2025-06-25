import { Column, Model, Table, ForeignKey, Unique } from 'sequelize-typescript';
import { Emotions } from './emotions.model';
import { Statement } from './statement.model';
import { Section } from './section.model';

@Table({ tableName: 'join_statement_emotions' })
export class joinstatementemotions extends Model {
  @Unique('statment-emotion')
  @ForeignKey(() => Emotions)
  @Column
  emotionId: number;

  @Unique('statment-emotion')
  @ForeignKey(() => Statement)
  @Column
  statementId: number;

  @Unique('statment-emotion')
  @ForeignKey(() => Section)
  @Column
  sectionId: number;
}
