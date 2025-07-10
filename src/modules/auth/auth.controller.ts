import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(public readonly authService: AuthService) {}

  @Get('health')
  async health() {
    try {
      if (!this.authService.validateService) {
        throw new Error('gRPC service not initialized');
      }
      const result = await this.authService.validateService.fetchUser({ userId: 'test123' }).toPromise();
      //const result = await this.authService.grpcService.Health({}).toPromise();
      return result;
    } catch (error) {
      return { status: 'error', error: (error && typeof error === 'object' && 'message' in error) ? (error as any).message : String(error) };
    }
  }
  @ApiOperation({ summary: 'Register a new user' })
@ApiResponse({ status: 201, description: 'User registered successfully.' })
@ApiResponse({ status: 400, description: 'Validation failed.' })
@ApiBody({ type: RegisterDto })
@Post('register')
async register(@Body() body: RegisterDto) {
  try {
    return await this.authService.register(body);
  } catch (error) {
    return { status: 'error', error: (error && typeof error === 'object' && 'message' in error) ? (error as any).message : String(error) };
  }
}

@ApiOperation({ summary: 'Login a user' })
@ApiResponse({ status: 200, description: 'User logged in successfully.' })
@ApiResponse({ status: 400, description: 'Validation failed.' })
@ApiBody({ type: LoginDto })
@Post('login')
async login(@Body() body: LoginDto) {
  try {
    return await this.authService.login(body);
  } catch (error) {
    return { status: 'error', error: (error && typeof error === 'object' && 'message' in error) ? (error as any).message : String(error) };
  }
}

}
