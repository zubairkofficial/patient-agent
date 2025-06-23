import { IsOptional, IsNotEmpty, IsNumber, IsArray } from 'class-validator';

export class Response {
  @IsNotEmpty()
  statementId: number;

  @IsNotEmpty()
  response: string;

}
