// dto/query-booking.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BookingStatus, BookingType } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class QueryBookingDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({
    example: 'pending',
    enum: BookingStatus,
    description: 'Lọc theo trạng thái',
  })
  @IsOptional()
  @IsEnum(BookingStatus, { message: 'status is not validate' })
  status?: BookingStatus;

  @ApiPropertyOptional({
    example: 'online',
    enum: BookingType,
    description: 'Lọc theo loại booking',
  })
  @IsOptional()
  @IsEnum(BookingType)
  booking_type?: BookingType;

  @ApiPropertyOptional({
    example: 'uuid-123',
    description: 'Lọc theo khách hàng',
  })
  @IsOptional()
  @IsUUID('4')
  customer_id?: string;

  @ApiPropertyOptional({
    example: '2026-06-01',
    description: 'Lọc từ ngày check-in',
  })
  @IsOptional()
  @IsDateString()
  from_date?: string;

  @ApiPropertyOptional({
    example: '2026-06-30',
    description: 'Lọc đến ngày check-out',
  })
  @IsOptional()
  @IsDateString()
  to_date?: string;

  @ApiPropertyOptional({
    example: 'Nguyen Bang',
    description: 'Tìm theo tên khách hàng',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    example: 'created_at',
    enum: ['created_at', 'check_in_date', 'check_out_date', 'status'],
  })
  @IsOptional()
  @IsIn(['created_at', 'check_in_date', 'check_out_date', 'status'])
  sortBy?: string = 'created_at';

  @ApiPropertyOptional({ example: 'desc', enum: ['asc', 'desc'] })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc' = 'desc';
}
