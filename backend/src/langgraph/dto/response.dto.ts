import { IsOptional, IsNotEmpty, IsNumber, IsArray } from 'class-validator';

export class ResponseDto {
  @IsNotEmpty()
  statementId: number;

  @IsNotEmpty()
  response: string;

}
