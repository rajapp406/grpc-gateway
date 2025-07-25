import { ApiProperty } from '@nestjs/swagger';

export class CreateOrUpdateUserProfileDto {
  @ApiProperty({ description: 'User ID (from URL parameter)', required: false })
  userId!: string;

  @ApiProperty({ description: 'User age', required: false })
  age!: number;

  @ApiProperty({ description: 'User gender', required: false })
  gender!: string;

  @ApiProperty({ description: 'Fitness level', required: false })
  fitnessLevel!: string;

  @ApiProperty({ description: 'Fitness goals', type: [String], required: false })
  goals!: string[];

  @ApiProperty({ description: 'Workout frequency', required: false })
  workoutFrequency!: string;

  @ApiProperty({ description: 'Preferred workouts', type: [String], required: false })
  preferredWorkouts!: string[];
}
