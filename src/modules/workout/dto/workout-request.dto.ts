import { IsString, IsNumber, IsOptional } from 'class-validator';

export class WorkoutRequestDto {
  @IsString()
  user_id!: string;

  @IsString()
  fitness_level!: string;

  @IsString()
  goal!: string;

  @IsNumber()
  day!: number;

  @IsOptional()
  @IsString()
  focus_area!: string;
}
