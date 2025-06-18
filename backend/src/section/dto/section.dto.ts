import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SectionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  skillIds?: number[];
}
