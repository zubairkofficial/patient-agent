import {
    Column,
    Model,
    Table,
ForeignKey,
Unique,
} from 'sequelize-typescript';
import { Emotions } from './emotions.model';
import { Statement } from './statement.model';
import { Section } from './section.model';


@Table({ tableName: 'join_statement_emotions' })
export class joinstatementemotions extends Model {
  @ForeignKey(() => Emotions)
  @Unique
  @Column
  emotionId: number;

  @ForeignKey(() => Statement)
  @Unique
  @Column
  statementId: number;

  @ForeignKey(() => Section)
  @Unique
  @Column
  sectionId : number;
}
