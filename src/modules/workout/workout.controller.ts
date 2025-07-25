import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { WorkoutService } from './workout.service';
import { WorkoutRequestDto } from './dto/workout-request.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';

@ApiTags('workouts')
@ApiBearerAuth()
@Controller('workouts')
@UseGuards(AuthGuard)
export class WorkoutController {
  constructor(private readonly workoutService: WorkoutService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate a new workout plan' })
  @ApiResponse({ status: 201, description: 'Workout plan generated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async generateWorkoutPlan(@Body() workoutRequest: WorkoutRequestDto) {
    return this.workoutService.generateWorkoutPlan(workoutRequest);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a workout plan by ID' })
  @ApiResponse({ status: 200, description: 'Workout plan retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Workout plan not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getWorkoutPlan(@Param('id') id: string) {
    return this.workoutService.getWorkoutPlan(id);
  }
}
