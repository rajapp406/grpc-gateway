import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    required: true
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'User password (min 6 characters)',
    minLength: 6,
    example: 'securepassword123',
    required: true
  })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({
    description: 'User first name',
    minLength: 2,
    example: 'John',
    required: true
  })
  @IsString()
  @MinLength(2)
  firstName!: string;

  @ApiProperty({
    description: 'User last name',
    minLength: 2,
    example: 'Doe',
    required: true
  })
  @IsString()
  @MinLength(2)
  lastName!: string;
}

export class GoogleAuthDto {
  @ApiProperty({
    description: 'User id token',
    minLength: 2,
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... ',
    required: true
  })
    @IsString()
    idToken!: string;
}