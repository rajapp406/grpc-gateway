import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user1@example.com',
    required: true
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'User password',
    minLength: 6,
    example: '123456',
    required: true
  })
  @IsString()
  @MinLength(6)
  password!: string;
}
