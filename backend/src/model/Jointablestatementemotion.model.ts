import {
    Column,
    Model,
    Table,
ForeignKey,
} from 'sequelize-typescript';
import { Emotions } from './emotions.model';
import { Statement } from './statement.model';
import { Section } from './section.model';


@Table({ tableName: 'join_statement_emotions' })
export class joinstatementemotions extends Model {
  @ForeignKey(() => Emotions)
  @Column
  emotionId: number;

  @ForeignKey(() => Statement)
  @Column
  statementId: number;

  @ForeignKey(() => Section)
  @Column
  sectionId : number;
}
