import { ApiProperty } from '@nestjs/swagger';
import { RoomStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateRoomStatusDto {
  @ApiProperty({
    example: 'cleaning',
    enum: ['available', 'cleaning', 'maintenance'],
    description: 'Trạng thái mới của phòng',
  })
  @IsNotEmpty({ message: ' Trạng thái không được để trống' })
  @IsEnum(
    {
      available: 'available',
      cleaning: 'cleaning',
      maintenance: 'maintenance',
    },
    { message: 'Trạng thái không hợp lệ' },
  )
  status: RoomStatus;
}
