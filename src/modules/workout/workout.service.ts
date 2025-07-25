import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { WorkoutRequestDto } from './dto/workout-request.dto';

@Injectable()
export class WorkoutService {
  private readonly workoutServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.workoutServiceUrl = this.configService.get<string>('WORKOUT_SERVICE_URL', 'http://localhost:8000');
  }

  async generateWorkoutPlan(workoutRequest: WorkoutRequestDto): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.workoutServiceUrl}/api/workouts/generate`, workoutRequest)
      );
      return response.data;
    } catch (error) {
      console.error('Error calling workout service:', error);
      throw new Error('Failed to generate workout plan');
    }
  }

  async getWorkoutPlan(workoutId: string): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.workoutServiceUrl}/api/workouts/${workoutId}`)
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching workout plan:', error);
      throw new Error('Failed to fetch workout plan');
    }
  }
}
