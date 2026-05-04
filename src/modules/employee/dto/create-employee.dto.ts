import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateEmployeeDto {
  @ApiProperty({ example: 'bcb@gmail.com', description: 'Email đăng nhập' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @ApiProperty({ example: 'Password@123', description: 'Mật khẩu' })
  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;

  // Employee info
  @ApiProperty({ example: 'Nguyen', description: 'Họ' })
  @IsString()
  @IsNotEmpty({ message: 'Họ không được để trống' })
  first_name: string;

  @ApiProperty({ example: 'Bang', description: 'Tên' })
  @IsString()
  @IsNotEmpty({ message: 'Tên không được để trống' })
  last_name: string;

  @ApiPropertyOptional({ example: '0909123456', description: 'Số điện thoại' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'receptionist', description: 'Vị trí' })
  @IsString()
  @IsNotEmpty({ message: 'Vị trí không được để trống' })
  position: string;

  @ApiPropertyOptional({ example: 5000000, description: 'Lương' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  salary?: number;

  @ApiProperty({ example: '2024-01-01', description: 'Ngày vào làm' })
  @IsDateString()
  @IsNotEmpty({ message: 'Ngày vào làm không được để trống' })
  hired_date: string;

  @ApiProperty({
    example: 'male',
    description: 'Giới tính',
    enum: ['male', 'female', 'other'],
  })
  @IsString()
  @IsIn(['male', 'female'], { message: 'Giới tính không hợp lệ' })
  gender: string;

  @ApiProperty({
    example: 'staff',
    description: 'Role',
    enum: ['staff', 'manager'],
  })
  @IsString()
  @IsIn(['staff', 'manager'], { message: 'Role phải là staff hoặc manager' })
  role: string;
}
