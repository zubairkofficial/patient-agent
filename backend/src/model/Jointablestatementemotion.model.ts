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
  @Column
  @Unique
  emotionId: number;

  @ForeignKey(() => Statement)
  @Column
  @Unique
  statementId: number;

  @ForeignKey(() => Section)
  @Column
  @Unique
  sectionId : number;
}
