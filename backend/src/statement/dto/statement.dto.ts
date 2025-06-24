import { IsOptional, IsNotEmpty, IsNumber, IsArray } from 'class-validator';

export class CreateStatementDto {
  @IsNotEmpty()
  statement: string;

  @IsNumber()
  sectionId: number;
  
    @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  emotionIds?: number[];
}


export class UpdateStatementDto {
  @IsOptional()
  @IsNotEmpty()
  statement?: string;

  @IsOptional()
  @IsNumber()
  sectionId?: number;

   @IsOptional()
   @IsArray()
   @IsNumber({}, { each: true })
   emotionIds?: number[];
}