import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaService } from '../../prisma/prisma.service';
import {
  PaginatedRoomResponseDto,
  RoomResponseDto,
} from './dto/room-response.dto';
import { QueryRoomDto } from './dto/query-room.dto';
import { Prisma } from '@prisma/client';
import { Amenity } from '../room-type/dto/create-room-type.dto';
import { UpdateRoomStatusDto } from './dto/update-room-status.dto';

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}
  async create(createRoomDto: CreateRoomDto): Promise<RoomResponseDto> {
    const { room_number, room_type_id, floor } = createRoomDto;

    // 1. Check room_type tồn tại và active
    const existingRoomType = await this.prisma.roomType.findUnique({
      where: { id: room_type_id },
    });

    if (!existingRoomType) {
      throw new NotFoundException('Room Type not found');
    }

    if (!existingRoomType.is_active) {
      throw new BadRequestException('Room type was deleted');
    }

    // 2. Check room_number trùng
    const existingRoom = await this.prisma.room.findUnique({
      where: { room_number },
    });

    if (existingRoom) {
      throw new ConflictException(`Number ${room_number} has already existed`);
    }

    // 3. Tạo phòng
    const newRoom = await this.prisma.room.create({
      data: {
        room_type_id,
        room_number,
        floor,
        // images: [], ← thêm sau khi setup AWS S3
      },
      select: {
        id: true,
        room_number: true,
        floor: true,
        status: true,
        created_at: true,
        updated_at: true,
        // images: true,
        room_type: {
          select: {
            id: true,
            name: true,
            base_price: true,
            capacity: true,
            bed_type: true,
            amenities: true,
          },
        },
      },
    });

    return {
      ...newRoom,
      room_type: {
        ...newRoom.room_type,
        base_price: Number(newRoom.room_type.base_price),
        amenities: newRoom.room_type.amenities as Amenity[],
      },
    };
  }

  async findAll(query: QueryRoomDto): Promise<PaginatedRoomResponseDto> {
    const {
      page = 1,
      limit = 10,
      status,
      room_type_id,
      floor,
      sortBy = 'room_number',
      order = 'asc',
      search,
    } = query;
    const skip = (page - 1) * limit;
    const where: Prisma.RoomWhereInput = {
      status: { not: 'inactive' },
    };

    if (status) {
      where.status = status;
    }

    if (floor) {
      where.floor = floor;
    }

    if (room_type_id) {
      const existingRoomType = await this.prisma.roomType.findUnique({
        where: { id: room_type_id },
      });

      if (!existingRoomType) {
        throw new NotFoundException('Room Type does not exist');
      }

      if (existingRoomType.is_active === false) {
        throw new BadRequestException('Room Type not active');
      }

      where.room_type_id = room_type_id;
    }

    // Search theo room_number hoặc tên room_type
    if (search) {
      where.OR = [{ room_number: { contains: search, mode: 'insensitive' } }];
    }

    const validSortFields = ['room_number', 'floor', 'status', 'created_at'];
    const orderBy: Prisma.RoomOrderByWithRelationInput =
      validSortFields.includes(sortBy)
        ? { [sortBy]: order }
        : { room_number: 'asc' };

    const [roomsRaw, total] = await Promise.all([
      this.prisma.room.findMany({
        where,
        take: limit,
        skip,
        select: {
          id: true,
          room_number: true,
          floor: true,
          status: true,
          created_at: true,
          updated_at: true,
          // images : true,
          room_type: {
            select: {
              id: true,
              name: true,
              base_price: true,
              capacity: true,
              bed_type: true,
              amenities: true,
            },
          },
        },
        orderBy,
      }),

      this.prisma.room.count({ where }),
    ]);

    const rooms = roomsRaw.map((r) => ({
      ...r,
      room_type: {
        ...r.room_type,
        base_price: Number(r.room_type.base_price),
        amenities: r.room_type.amenities as Amenity[],
      },
    }));

    return {
      data: rooms,
      total: total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<RoomResponseDto> {
    const room = await this.prisma.room.findUnique({
      where: { id },
      select: {
        id: true,
        room_number: true,
        floor: true,
        status: true,
        updated_at: true,
        created_at: true,
        // images : true,
        room_type: {
          select: {
            id: true,
            name: true,
            base_price: true,
            capacity: true,
            bed_type: true,
            amenities: true,
            is_active: true,
            created_at: true,
            updated_at: true,
          },
        },
      },
    });

    if (!room) {
      throw new NotFoundException('Room does not exist');
    }

    return this.transformRoom(room);
  }

  async update(id: string, updateRoomDto: UpdateRoomDto) {
    const { room_type_id, floor } = updateRoomDto;
    const room = await this.prisma.room.findUnique({
      where: { id },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    if (room_type_id) {
      await this.validateRoomType(room_type_id);
    }

    const updateRoom = await this.prisma.room.update({
      where: { id },
      data: {
        ...(room_type_id && { room_type_id }),
        ...(floor != undefined && { floor }),
      },
      select: this.roomSelect(),
    });

    return this.transformRoom(updateRoom);
  }
  async remove(id: string): Promise<void> {
    const room = await this.prisma.room.findUnique({
      where: { id },

      select: {
        id: true,
        status: true,
      },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    if (room.status === 'inactive') {
      throw new BadRequestException('Room already inactive');
    }

    if (room.status === 'occupied') {
      throw new BadRequestException('Không thể xóa phòng đang có khách');
    }

    await this.prisma.room.update({
      where: { id },

      data: {
        status: 'inactive',
      },
    });
  }

  private roomSelect() {
    return {
      id: true,
      room_number: true,
      floor: true,
      status: true,
      created_at: true,
      updated_at: true,
      // images: true,
      room_type: {
        select: {
          id: true,
          name: true,
          base_price: true,
          capacity: true,
          bed_type: true,
          amenities: true,
        },
      },
    };
  }

  private transformRoom(room: any): RoomResponseDto {
    return {
      ...room,
      room_type: {
        ...room.room_type,
        base_price: Number(room.room_type.base_price),
        amenities: room.room_type.amenities as Amenity[],
      },
    };
  }

  private async validateRoomType(roomTypeId: string) {
    const roomType = await this.prisma.roomType.findUnique({
      where: { id: roomTypeId },
      select: {
        id: true,
        is_active: true,
      },
    });

    if (!roomType) {
      throw new NotFoundException('Room type not found');
    }

    if (!roomType.is_active) {
      throw new BadRequestException('Room type is not active');
    }

    return roomType;
  }

  available   → cleaning ✅
available   → maintenance ✅
available   → occupied ❌ (hệ thống tự đổi khi check-in)
cleaning    → available ✅
maintenance → available ✅
occupied    → cleaning ✅ (sau check-out)
occupied    → available ❌ (phải qua cleaning trước)
inactive    → bất kỳ ❌ (đã xóa mềm)
  async updateStatus(id: string, dto: UpdateRoomStatusDto) {
    const { status: newStatus } = dto;
    const room = await this.prisma.room.findUnique({
      where: { id },
      select: { id: true, status: true },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const validTransitions: Record<string, string[]> = {
      available: ['cleaning', 'maintenance'],
      cleaning: ['available'],
      maintenance: ['available'],
      occupied: ['cleaning'],
      inactive: [],
    };

    const allowedStatus = validTransitions[room.status] ?? [];

    if (!allowedStatus.includes(newStatus)) {
      throw new BadRequestException(
        `Do not allow to transalte from ${room.status} to ${newStatus}`,
      );
    }

    const updateRoom = await this.prisma.room.update({
      where: { id },
      data: { status: newStatus },
      select: this.roomSelect(),
    });

    return this.transformRoom(updateRoom);
  }
}
