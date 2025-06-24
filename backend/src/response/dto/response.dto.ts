import { IsNotEmpty, IsInt, IsString, Min, Max } from 'class-validator';

export class CreateResponseDto {
  @IsString()
  @IsNotEmpty({ message: 'Response text is required.' })
  userResponse: string;

  @IsString()
  @IsNotEmpty({ message: 'Bot remarks are required.' })
  botRemarks: string;

  @IsInt({ message: 'Rating must be an integer.' })
  @Min(0, { message: 'Rating cannot be less than 0.' })
  @Max(10, { message: 'Rating cannot be more than 10.' })
  rating: number;

  @IsInt({ message: 'statementId must be a valid integer.' })
  statementId: number;

  @IsInt({ message: 'doctorId must be a valid integer.' })
  doctorId: number;
}
