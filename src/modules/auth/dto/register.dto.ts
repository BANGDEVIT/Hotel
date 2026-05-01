import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterDTO {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: '"Password must be at least 8 characters long' })
  @Matches(/^(?=.[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password muut contain at least one uppercase letter, one lowercase letter, one number and one special character ',
  })
  password: string;

  @IsNotEmpty({ message: 'First name is required' })
  @IsString()
  firstName: string;

  @IsNotEmpty({ message: 'Last name is required' })
  @IsString()
  lastName: string;

  // @IsNotEmpty({ message: 'Phone name is required' })
  // @IsString()
  // Phone: string;
}
