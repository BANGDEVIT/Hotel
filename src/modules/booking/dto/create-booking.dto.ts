import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BookingType } from '@prisma/client';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({
    example: 'uuid-123',
    description: 'UUID khách hàng',
  })
  @IsNotEmpty({ message: 'Customer_id is not emmty' })
  @IsUUID('4', { message: 'customer_id is no valid' })
  customer_id: string;

  @ApiProperty({
    example: ['uuid-room-1', 'uuid-room-2', 'uuid-room-3'],
    description: 'UUID các phòng được đặt',
    type: [String],
  })
  @IsArray({ message: 'room_ids must array' })
  @IsUUID('4', { each: true, message: 'room_id is no valid' })
  @IsNotEmpty({ message: 'Must book at least 1 room' })
  room_ids: string[];

  @ApiProperty({
    example: '2026=06-01',
    description: 'Ngày check-in (YYYY-MM-DD)',
  })
  @IsNotEmpty({ message: 'check in date is not empty' })
  @IsDateString({}, { message: 'Format check in date must be YYYY-MM-DD' })
  check_in_date: string;

  @ApiProperty({
    example: '2026-06-03',
    description: 'Ngày check out (YYYY-MM-DD)',
  })
  @IsNotEmpty({ message: 'Check out date is not empty' })
  @IsDateString({}, { message: 'Format check out date must be YYYY-MM-DD' })
  check_out_date: string;

  @ApiProperty({
    example: 'online',
    enum: BookingType,
    description: 'Loại phòng : online | walk_in',
  })
  @IsNotEmpty({ message: 'Room Type must have' })
  @IsEnum(BookingType, { message: 'Room type is not validate' })
  booking_type: BookingType;

  @ApiPropertyOptional({
    example: { 'uuid-room-1': 450000, 'uuid-room-2': 600000 },
    description: 'Override price room (key: room_id , value : price_per_night)',
  })
  @IsOptional()
  @IsObject()
  override_price?: Record<string, number>;

  // @ApiPropertyOptional({
  //   example: 'Cần phòng tầng cao, view biển',
  //   description: 'Yêu cầu đặc biệt',
  // })
  // @IsOptional()
  // @IsString()
  // special_requests?: string;
}
