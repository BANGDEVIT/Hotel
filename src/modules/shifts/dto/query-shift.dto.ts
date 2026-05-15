import { ApiPropertyOptional } from '@nestjs/swagger';
import { DayOfWeek, ShiftName } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

export class QueryShiftDTO {
  @ApiPropertyOptional({ example: 1, description: 'Số trang' })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 10, description: 'số lượng ca mỗi trang' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  limit?: number;

  @ApiPropertyOptional({ example: 'morning', enum: ShiftName })
  @IsOptional()
  @IsEnum(ShiftName)
  name?: ShiftName;

  @ApiPropertyOptional({ example: 'monday', enum: DayOfWeek })
  @IsOptional()
  @IsEnum(DayOfWeek)
  day_of_week: DayOfWeek;
}
