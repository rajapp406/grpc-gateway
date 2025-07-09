import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../common/guards/auth.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User as UserDecorator } from '../../common/decorators/user.decorator';
import { UserService } from './user.service';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(public readonly userService: UserService) {}

  @Get('health')
  async health() {
    try {
      if (!this.userService.grpcService) {
        throw new Error('gRPC service not initialized');
      }
      const result = await this.userService.grpcService.Health({}).toPromise();
      return result;
    } catch (error) {
      return { status: 'error', error: (error && typeof error === 'object' && 'message' in error) ? (error as any).message : String(error) };
    }
  }
  @ApiOperation({ summary: 'Get user by ID' })
@ApiResponse({ status: 200, description: 'User found.' })
@ApiResponse({ status: 404, description: 'User not found.' })
@Get(':id')
async getUserById(@Param('id') id: string) {
  try {
    return await this.userService.getUser({ id });
  } catch (error) {
    return { status: 'error', error: (error && typeof error === 'object' && 'message' in error) ? (error as any).message : String(error) };
  }
}

@ApiOperation({ summary: 'Get user by email' })
@ApiResponse({ status: 200, description: 'User found.' })
@ApiResponse({ status: 404, description: 'User not found.' })
@Get('by-email/:email')
async getUserByEmail(@Param('email') email: string) {
  try {
    return await this.userService.getUser({ email });
  } catch (error) {
    return { status: 'error', error: (error && typeof error === 'object' && 'message' in error) ? (error as any).message : String(error) };
  }
}

}
