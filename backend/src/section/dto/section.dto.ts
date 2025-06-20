import { IsNotEmpty, IsOptional, IsString, IsArray, IsNumber } from 'class-validator';

export class SectionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  skills?: number[];
}
