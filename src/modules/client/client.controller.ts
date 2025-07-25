import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CreateOrUpdateUserProfileDto } from './dto/create-or-update-user-profile.dto';
import { ClientService } from './client.service';

@Controller('client')
export class ClientController {
  constructor(public readonly clientService: ClientService) { }

  @Get('fetchUser/:userId')
  @ApiOperation({ summary: 'Fetch user by ID' })
  @ApiResponse({ status: 200, description: 'User found.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async fetchUser(@Param('userId') userId: string) {
    try {
      if (!this.clientService) {
        throw new Error('gRPC service not initialized');
      }
      const result = await this.clientService.getUserProfile({ userId });
      //const result = await this.authService.grpcService.Health({}).toPromise();
      return result;
    } catch (error) {
      return { status: 'error', error: (error && typeof error === 'object' && 'message' in error) ? (error as any).message : String(error) };
    }
  }
  @Post('ping')
  getPing(@Body() body: {userId: string}) {
    console.log('>>>> HIT PING <<<<', body);
    return { ping: 'pong' };
  }

  @Post('users/profile')
  @ApiOperation({ summary: 'Create or update user profile using gRPC' })
  @ApiResponse({ status: 200, description: 'Profile created/updated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  async createOrUpdateUserProfile(
    @Body() profileData: {userId: string, age?: number, gender?: string, fitnessLevel?: string, goals?: string[], workoutFrequency?: string, preferredWorkouts?: string[]}
  ) {
    console.log('>>>> HIT REST CONTROLLER <<<<', profileData);
    try {
      if (!this.clientService.clientService) {
        throw new Error('gRPC service not initialized');
      }
      
      if (!profileData.userId) {
        throw new Error('userId is required');
      }
      
      const { userId, ...profileWithoutUserId } = profileData;
      
      // Create a flat structure for the gRPC call
      const requestData = {
        userId,
        ...profileWithoutUserId
      };
      
      const result = await this.clientService.clientService.createOrUpdateUserProfile(requestData);
      
      return result;
    } catch (error) {
      return { status: 'error', error: (error && typeof error === 'object' && 'message' in error) ? (error as any).message : String(error) };
    }
  }
}
