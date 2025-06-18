import {
  Column,
  Model,
  Table,
  DataType,
  PrimaryKey,
  HasOne
} from 'sequelize-typescript';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Doctor } from './doctorprofile.model';

@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model {
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
  @IsNotEmpty()
  declare firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @IsNotEmpty()
  declare lastName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  @IsEmail()
  @IsNotEmpty()
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @IsNotEmpty()
  @MinLength(8)
  declare password: string;

  @Column({
    type: DataType.ENUM('admin', 'user'),
    allowNull: false,
    defaultValue: 'user',
  })
  declare role: 'admin' | 'user';

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare isEmailVerified: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare verificationToken: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare resetPasswordToken: string | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare resetPasswordExpires: Date | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare otp: string | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare otpExpires: Date | null;

  // ✅ One-to-One: User has one Doctor profile
  @HasOne(() => Doctor)
  doctorProfile: Doctor;
}
