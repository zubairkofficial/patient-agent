import {
  Column,
  Model,
  Table,
  DataType,
  PrimaryKey,
  ForeignKey
} from 'sequelize-typescript';
import { IsNotEmpty } from 'class-validator';
import { Doctor } from './doctorprofile.model';
import { Statement } from './statement.model';
import { string } from 'zod';

@Table({
  tableName: 'response',
  timestamps: true,
})
export class Response extends Model {
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
  @IsNotEmpty()
  declare response: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare rating: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare botRemarks: string;

  @ForeignKey(() => Statement)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare statementId: number;

  @ForeignKey(() => Doctor)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare doctorId: number;
}
