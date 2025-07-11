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
    description: 'User full name',
    minLength: 2,
    example: 'John Doe',
    required: true
  })
  @IsString()
  @MinLength(2)
  name!: string;
}
