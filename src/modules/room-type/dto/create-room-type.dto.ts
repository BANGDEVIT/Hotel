import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BedType } from '@prisma/client';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export enum Amenity {
  WIFI = 'wifi',
  TV = 'tv',
  AIR_CONDITIONING = 'air_conditioning',
  MINIBAR = 'minibar',
  BALCONY = 'balcony',
  POOL = 'pool',
  GYM = 'gym',
  BREAKFAST = 'breakfast',
  PARKING = 'parking',
  SAFE = 'safe', // két sắt
  HAIR_DRYER = 'hair_dryer',
}

export class CreateRoomTypeDto {
  @ApiProperty({
    example: 'Vip',
    description: 'Tên loại phòng',
  })
  @IsNotEmpty({ message: 'Tên lọa phòng không được để trống' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'double',
    enum: BedType,
    description: 'Loại giường',
  })
  @IsNotEmpty()
  @IsEnum(BedType, { message: 'Loại giường không hợp lệ' })
  bed_type: BedType;

  @ApiProperty({
    example: 500000,
    description: 'Giá cơ bản',
  })
  @IsNotEmpty({ message: 'Giá không được để trống' })
  @IsNumber()
  @Min(0, { message: 'Giá cơ bản không được âm' })
  base_price: number;

  @ApiProperty({
    example: 2,
    description: 'Sức chứa (số người)',
  })
  @IsNotEmpty({ message: 'Sức chứa không được để trống' })
  @IsInt({ message: 'Sức chứa phải là số nguyên' })
  @Min(1, { message: 'Sức chứa phải lớn hơn 0' })
  capacity: number;

  @ApiPropertyOptional({
    example: ['wifi', 'tv', 'air_conditioning'],
    description: 'Danh sách tiện nghi',
    enum: Amenity,
    isArray: true,
  })
  @IsOptional()
  @IsArray({ message: 'Tiện nghi phải là array' })
  @IsEnum(Amenity, {
    each: true,
    message: 'Tiện nghi không hợp lệ',
  })
  amenities?: Amenity[] = [];
}
