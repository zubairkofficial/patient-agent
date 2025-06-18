import {
  Column,
  Model,
  Table,
  DataType,
  PrimaryKey,
  BelongsToMany,
} from 'sequelize-typescript';
import { IsNotEmpty } from 'class-validator';
import { joinstatementemotions } from './Jointablestatementemotion.model';
import { Statement } from './statement.model';

@Table({
  tableName: 'emotion',
  timestamps: true,
})
export class Emotions extends Model {
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
  declare name: string;

  @Column({
      type: DataType.TEXT,
      allowNull: true,
    })
  @IsNotEmpty()
  declare detail: string;

   @BelongsToMany(() => Statement, () => joinstatementemotions)
        statement: Statement[]
}
