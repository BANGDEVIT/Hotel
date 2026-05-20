import { ApiPropertyOptional } from '@nestjs/swagger';
import { RoomStatus } from '@prisma/client';
import {
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class QueryRoomDto {
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
    example: 'available',
    enum: RoomStatus,
    description: 'Lọc theo trạng thái (mặc định ẩn inactive)',
  })
  @IsOptional()
  @IsEnum(RoomStatus, { message: 'Trạng thái không hợp lệ' })
  status?: RoomStatus;

  @ApiPropertyOptional({ example: 'uuid-123', description: 'UUID loại phòng' })
  @IsOptional()
  @IsUUID('4')
  room_type_id?: string;

  @ApiPropertyOptional({ example: 1, description: 'Tầng' })
  @IsOptional()
  @IsInt()
  @Min(1)
  floor?: number;

  @ApiPropertyOptional({
    example: 'room_number',
    enum: ['room_number', 'floor', 'status', 'created_at'],
    description: 'Trường sắp xếp',
  })
  @IsIn(['room_number', 'floor', 'status', 'created_at'])
  @IsOptional()
  sortBy?: string = 'room_number';

  @ApiPropertyOptional({
    example: 'asc',
    enum: ['asc', 'desc'],
    description: 'Thứ tự sắp xếp',
  })
  @IsIn(['asc', 'desc'])
  @IsOptional()
  order?: 'asc' | 'desc' = 'asc';

  @ApiPropertyOptional({
    example: 'Deluxe',
    description: 'Tìm kiếm theo tên phòng',
  })
  @IsString()
  @IsOptional()
  search?: string;
}
