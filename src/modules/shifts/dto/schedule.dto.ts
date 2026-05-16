import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class QueryScheduleDto {
  @ApiPropertyOptional({
    example: 'Nguyen Bang',
    description: 'Tìm theo tên nhân viên',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    example: '2026-05-12',
    description: 'Lọc theo ngày cụ thể (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString()
  work_date?: string;

  @ApiPropertyOptional({
    example: '2026-05-12',
    description: 'Xem lịch cả tuần (truyền vào 1 ngày bất kỳ trong tuần)',
  })
  @IsOptional()
  @IsDateString()
  week?: string;
}
