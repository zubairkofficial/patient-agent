import {
  Column,
  Model,
  Table,
  DataType,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  Default,
  HasOne,
} from 'sequelize-typescript';
import { IsNotEmpty } from 'class-validator';
import { User } from './user.model';
import { Response } from './response.model';

@Table({
  tableName: 'doctor-profile',
  timestamps: true,
})
export class Doctor extends Model {
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
  })
  declare id: number;

  // ✅ Foreign key to User
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare userId: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  @IsNotEmpty()
  declare description: string;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare level: number;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @IsNotEmpty()
  declare rating: number;

  // ✅ Relationship to User
  @BelongsTo(() => User)
  user: User;

    @HasOne(() => Response)
    response: Response;
}
