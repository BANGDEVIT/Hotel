import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterDTO {
  @ApiProperty({
    example: 'user@gmail.com',
    description: 'Email đăng ký',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    example: 'Password@123',
    description:
      'Mật khẩu — tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt',
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: '"Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password muut contain at least one uppercase letter, one lowercase letter, one number and one special character ',
  })
  password: string;

  @ApiProperty({
    example: 'Bang',
    description: 'Tên',
  })
  @IsNotEmpty({ message: 'First name is required' })
  @IsString()
  firstName: string;

  @ApiProperty({
    example: 'Bui',
    description: 'Họ',
  })
  @IsNotEmpty({ message: 'Last name is required' })
  @IsString()
  lastName: string;

  @ApiPropertyOptional({
    example: '0909123456',
    description: 'Dùng để tự động link với walk-in record',
  })
  @IsOptional()
  @IsString()
  phone?: string;
}
