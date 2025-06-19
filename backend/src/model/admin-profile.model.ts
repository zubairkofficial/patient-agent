import {
  Column,
  Model,
  Table,
  DataType,
  PrimaryKey,
} from 'sequelize-typescript';

@Table({
  tableName: 'admin-profile',
  timestamps: true,
})

export class AdminProfile extends Model {
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
  declare openaikey:  string;
}