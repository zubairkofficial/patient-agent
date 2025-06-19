// src/emotions/dto/create-emotion.dto.ts
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEmotionDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  detail?: string;
}

export class UpdateEmotionDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  detail?: string;
}
