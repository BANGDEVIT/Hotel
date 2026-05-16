import { ApiProperty } from '@nestjs/swagger';
import { DayOfWeek, ShiftName } from '@prisma/client';
import { IsDateString, IsNotEmpty, IsUUID, IsArray } from 'class-validator';

export class AssignEmployeeDto {
  @ApiProperty({
    example: ['uuid-123', 'uuid-456', 'uuid-789'],
    description: 'Danh sách UUID của nhân viên',
    type: [String],
  })
  @IsArray({ message: 'employee_ids phải là array' })
  @IsUUID('4', { each: true, message: 'Employee ID không hợp lệ' })
  @IsNotEmpty({ message: 'Danh sách nhân viên không được để trống' })
  employee_ids: string[];

  @ApiProperty({
    example: '2026-05-12',
    description: 'Ngày làm việc (YYYY-MM-DD)',
  })
  @IsNotEmpty({ message: 'Ngày làm việc không được để trống' })
  @IsDateString(
    {},
    { message: 'Ngày làm việc không đúng định dạng YYYY-MM-DD' },
  )
  work_date: string;
}

export class AssignedEmployeeDto {
  @ApiProperty({ example: 'uuid-123' })
  id: string;

  @ApiProperty({ example: 'Nguyen Bang' })
  full_name: string;

  @ApiProperty({ example: 'receptionist' })
  position: string;

  @ApiProperty({ example: '2026-05-12' })
  work_date: string;
}

export class AssignEmployeeResponseDto {
  @ApiProperty({ example: 'uuid-123', description: 'ID của ca làm việc' })
  shift_id: string;

  @ApiProperty({ example: 'morning', enum: ShiftName })
  shift_name: ShiftName;

  @ApiProperty({ example: 'monday', enum: DayOfWeek })
  day_of_week: DayOfWeek;

  @ApiProperty({ example: '07:00' })
  start_time: string;

  @ApiProperty({ example: '11:00' })
  end_time: string;

  @ApiProperty({ example: '2026-05-12' })
  work_date: string;

  @ApiProperty({
    example: 3,
    description: 'Số nhân viên được phân công thành công',
  })
  total_assigned: number;

  @ApiProperty({ type: [AssignedEmployeeDto] })
  employees: AssignedEmployeeDto[];
}
