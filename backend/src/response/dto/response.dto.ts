import { IsNotEmpty, IsInt } from 'class-validator';

export class CreateResponseDto {
  @IsNotEmpty()
  response: string;

  @IsInt()
  rating: number;

  @IsInt()
  statementId: number;

  @IsInt()
  doctorId: number;
}
