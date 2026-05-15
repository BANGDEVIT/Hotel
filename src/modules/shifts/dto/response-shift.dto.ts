import { ApiProperty } from '@nestjs/swagger';
import { DayOfWeek, ShiftName } from '@prisma/client';

export class ResponseShiftDto {
  @ApiProperty({ example: 'uuid-123' })
  id: string;

  @ApiProperty({
    example: 'morning',
    enum: ShiftName,
  })
  name: ShiftName;

  @ApiProperty({
    example: 'monday',
    enum: DayOfWeek,
  })
  day_of_week: DayOfWeek;

  @ApiProperty({ example: '07:00', description: 'Giờ bắt đầu (HH:mm)' })
  start_time: string;

  @ApiProperty({ example: '11:00', description: 'Giờ kết thúc (HH:mm)' })
  end_time: string;
}

export class ShiftResponseDto {
  @ApiProperty({ example: 'uuid-123' })
  id: string;

  @ApiProperty({ example: 'morning', enum: ShiftName })
  name: ShiftName;

  @ApiProperty({ example: 'monday', enum: DayOfWeek })
  day_of_week: DayOfWeek;

  @ApiProperty({ example: '07:00' })
  start_time: string;

  @ApiProperty({ example: '11:00' })
  end_time: string;

  @ApiProperty({ example: 3, description: 'Số nhân viên được phân công' })
  total_employees: number;
}

export class PaginatedShiftResponseDto {
  @ApiProperty({ type: [ShiftResponseDto] })
  data: ShiftResponseDto[];

  @ApiProperty({ example: 10 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 1 })
  totalPages: number;
}

// Employee trong ca làm việc
export class EmployeeInShiftDto {
  @ApiProperty({ example: 'uuid-123' })
  id: string;

  @ApiProperty({ example: 'Nguyen Bang' })
  full_name: string;

  @ApiProperty({ example: 'nva@gmail.com' })
  email: string;

  @ApiProperty({ example: '0909123456' })
  phone: string;

  @ApiProperty({ example: 'receptionist' })
  position: string;

  @ApiProperty({ example: 'male' })
  gender: string;

  @ApiProperty({
    example: 'https://s3.amazonaws.com/bucket/avatar.jpg',
    nullable: true,
  })
  avatar_url: string | null;
}

// Chi tiết ca làm việc
export class ShiftDetailResponseDto {
  @ApiProperty({ example: 'uuid-123' })
  id: string;

  @ApiProperty({ example: 'morning', enum: ShiftName })
  name: ShiftName;

  @ApiProperty({ example: 'monday', enum: DayOfWeek })
  day_of_week: DayOfWeek;

  @ApiProperty({ example: '07:00' })
  start_time: string;

  @ApiProperty({ example: '11:00' })
  end_time: string;

  @ApiProperty({ example: 3 })
  total_employees: number;

  @ApiProperty({ type: [EmployeeInShiftDto] })
  employees: EmployeeInShiftDto[];
}
