// dto/query-profile-shift.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class QueryProfileShiftDto {
  @ApiPropertyOptional({
    example: '2026-05-12',
    description: 'Xem lịch cả tuần — truyền 1 ngày bất kỳ trong tuần',
  })
  @IsOptional()
  @IsDateString()
  week?: string;

  @ApiPropertyOptional({
    example: '2026-05-12',
    description: 'Lọc theo ngày cụ thể (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString()
  work_date?: string;
}
