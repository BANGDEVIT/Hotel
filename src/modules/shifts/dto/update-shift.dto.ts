import { ApiPropertyOptional } from '@nestjs/swagger';
import { DayOfWeek, ShiftName } from '@prisma/client';
import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';

export class UpdateShiftDto {
  @ApiPropertyOptional({ example: 'morning', enum: ShiftName })
  @IsOptional()
  @IsEnum(ShiftName)
  name?: ShiftName;

  @ApiPropertyOptional({ example: 'monday', enum: DayOfWeek })
  @IsOptional()
  @IsEnum(DayOfWeek)
  day_of_week?: DayOfWeek;

  @ApiPropertyOptional({ example: '07:00' })
  @IsOptional()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  start_time?: string;

  @ApiPropertyOptional({ example: '11:00' })
  @IsOptional()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  end_time?: string;
}
