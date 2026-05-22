import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BookingStatus, BookingType } from '@prisma/client';

export class CustomerInBookingDto {
  @ApiProperty({
    example: 'uuid-123',
  })
  id: string;

  @ApiProperty({ example: 'Bui Cong Bang' })
  full_name: string;

  @ApiProperty({ example: '0123456789' })
  phone: string;

  @ApiProperty({ example: 'buicongbang@gmail.com' })
  email: string;
}

export class RoomInBookingDto {
  @ApiProperty({ example: 'uuid-123' })
  id: string;

  @ApiProperty({ example: 'A306' })
  room_number: string;

  @ApiProperty({ example: 'Vip' })
  room_type_name: string;

  @ApiProperty({ example: 500000 })
  price_per_night: number;

  @ApiProperty({ example: 1 })
  floor: number;
}

export class InvoiceInBookingDto {
  @ApiProperty({ example: 'uuid-123' })
  id: string;

  @ApiProperty({ example: 1000000 })
  total_amount: number;

  @ApiProperty({ example: 100 })
  discount: number;

  @ApiProperty({ example: 0 })
  final_amount: number;

  @ApiProperty({ example: 'unpaid' })
  status: string;
}

export class BookingResponseDto {
  @ApiProperty({ example: 'uuid-123' })
  id: string;

  @ApiProperty({ example: 'online', enum: BookingType })
  booking_type: BookingType;

  @ApiProperty({ example: 'pending', enum: BookingStatus })
  status: BookingStatus;

  @ApiProperty({ example: '2026-06-01' })
  check_in_date: Date;

  @ApiProperty({ example: '2026-06-03' })
  check_out_date: Date;

  @ApiPropertyOptional({ example: '2026-06-01T14:00:00.000Z' })
  actual_check_in: Date | null;

  @ApiPropertyOptional({ example: '2026-06-03T12:00:00.000Z' })
  actual_check_out: Date | null;

  // @ApiPropertyOptional({ example: 'Cần phòng tầng cao' })
  // special_requests: string | null;

  @ApiProperty({ example: 2, description: 'Số đêm' })
  nights: number;

  @ApiProperty({ example: 1000000, description: 'Tổng tiền phòng' })
  total_room_price: number;

  @ApiProperty({ type: CustomerInBookingDto })
  customer: CustomerInBookingDto;

  @ApiProperty({ type: [RoomInBookingDto] })
  rooms: RoomInBookingDto[];

  @ApiPropertyOptional({ type: InvoiceInBookingDto })
  invoice: InvoiceInBookingDto | null;

  @ApiProperty({ example: '2026-05-12T00:00:00.000Z' })
  created_at: Date;

  @ApiProperty({ example: '2026-05-12T00:00:00.000Z' })
  updated_at: Date;
}

export class PaginatedBookingResponseDto {
  @ApiProperty({ type: [BookingResponseDto] })
  data: BookingResponseDto[];

  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 10 })
  totalPages: number;
}
