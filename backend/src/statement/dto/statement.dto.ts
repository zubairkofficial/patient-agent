import { IsOptional, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateStatementDto {
  @IsNotEmpty()
  statement: string;

  @IsNumber()
  sectionId: number;
}


export class UpdateStatementDto {
  @IsOptional()
  @IsNotEmpty()
  statement?: string;

  @IsOptional()
  @IsNumber()
  sectionId?: number;
}