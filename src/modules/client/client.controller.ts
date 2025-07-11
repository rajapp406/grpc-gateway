import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ClientService } from './client.service';

@Controller('client')
export class ClientController {
  constructor(public readonly clientService: ClientService) { }

  @Get('fetchUser')
  @ApiOperation({ summary: 'Fetch user by ID' })
  @ApiResponse({ status: 200, description: 'User found.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async fetchUser() {
    try {
      if (!this.clientService) {
        throw new Error('gRPC service not initialized');
      }
      const result = await this.clientService.fetchUser({ userId: '61eb3e6c-4d44-47cf-bfe2-53cb16973579' });
      //const result = await this.authService.grpcService.Health({}).toPromise();
      return result;
    } catch (error) {
      return { status: 'error', error: (error && typeof error === 'object' && 'message' in error) ? (error as any).message : String(error) };
    }
  }

}
