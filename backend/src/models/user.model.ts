import { Column, Model, Table, DataType } from 'sequelize-typescript';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model {  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @IsNotEmpty()
  firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @IsNotEmpty()
  lastName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isEmailVerified: boolean;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  verificationToken: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  resetPasswordToken: string | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  resetPasswordExpires: Date | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  otp: string | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  otpExpires: Date | null;
}
