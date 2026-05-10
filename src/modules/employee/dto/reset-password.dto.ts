import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ example: 'NewPassword@123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  new_password: string;
}

export class UpdatePasswordDto {
  @ApiProperty({
    example: 'employee@email.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    example: 'Pasword@123',
  })
  @IsNotEmpty({ message: 'password is required' })
  @IsString()
  password: string;

  @ApiProperty({
    example: 'Password@123',
  })
  @IsString()
  @IsNotEmpty({ message: 'password is required' })
  @MinLength(8, { message: 'password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password muut contain at least one uppercase letter, one lowercase letter, one number and one special character ',
  })
  newPassword: string;
}
