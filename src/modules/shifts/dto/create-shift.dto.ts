import { ApiProperty } from '@nestjs/swagger';
import { DayOfWeek, ShiftName } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateShiftDto {
  @ApiProperty({
    example: 'morning',
    enum: ShiftName,
    description: 'Tên ca: morning, afternoon, evening, night',
  })
  @IsNotEmpty({ message: 'Tên ca không được để trống' })
  @IsEnum(ShiftName, { message: 'Tên ca không hợp lệ' })
  name: ShiftName;

  @ApiProperty({
    example: 'monday',
    enum: DayOfWeek,
    description: 'Ngày trong tuần',
  })
  @IsNotEmpty({ message: 'Ngày làm việc không được để trống' })
  @IsEnum(DayOfWeek, { message: 'Ngày không hợp lệ' })
  day_of_week: DayOfWeek;

  @ApiProperty({ example: '07:00', description: 'Giờ bắt đầu (HH:mm)' })
  @IsNotEmpty({ message: 'Thời gian bắt đầu không được để trống' })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Thời gian phải có định dạng HH:mm',
  })
  start_time: string;

  @ApiProperty({ example: '11:00', description: 'Giờ kết thúc (HH:mm)' })
  @IsNotEmpty({ message: 'Thời gian kết thúc không được để trống' })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Thời gian phải có định dạng HH:mm',
  })
  end_time: string;
}
