import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class UpdateBookingDto {
  @ApiPropertyOptional({
    example: '2026-06-02',
    description: 'đôi ngày check in',
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'The check-in date is not in the correct format.' },
  )
  check_in_date?: string;

  @ApiPropertyOptional({
    example: '2026-06-03',
    description: 'đổi ngày check-out',
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'The check-out date is not in the correct format.' },
  )
  check_out_date?: string;

  // @ApiPropertyOptional({
  //   example: 'Cần thêm giường phụ',
  //   description: 'Yêu cầu đặc biệt',
  // })
  // @IsOptional()
  // @IsString()
  // special_requests?: string;
}
