import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';

import {
  PaginatedShiftResponseDto,
  ResponseShiftDto,
  ShiftDetailResponseDto,
} from './dto/response-shift.dto';
import { QueryShiftDTO } from './dto/query-shift.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ShiftsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateShiftDto): Promise<ResponseShiftDto> {
    const { name, day_of_week, start_time, end_time } = dto;

    const existingShift = await this.prisma.shift.findFirst({
      where: {
        name,
        day_of_week,
      },
    });

    if (existingShift) {
      throw new ConflictException(
        `Shift ${name} and ${day_of_week} have already exists`,
      );
    }

    if (start_time > end_time) {
      throw new BadRequestException('Start time is required small end_time ');
    }

    // ← Convert string "07:00" → Date
    const startDate = new Date(`1970-01-01T${start_time}:00`);
    const endDate = new Date(`1970-01-01T${end_time}:00`);

    const shift = await this.prisma.shift.create({
      data: {
        name,
        start_time: startDate,
        day_of_week,
        end_time: endDate,
      },
      select: {
        id: true,
        name: true,
        start_time: true,
        day_of_week: true,
        end_time: true,
      },
    });

    return {
      ...shift,
      start_time: shift.start_time.toTimeString().slice(0, 5), // → "07:00"
      end_time: shift.end_time.toTimeString().slice(0, 5), // → "11:00"
    };
  }

  async findAll(query: QueryShiftDTO): Promise<PaginatedShiftResponseDto> {
    const { page = 1, limit = 10, name, day_of_week: dayOfweek } = query;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (name) {
      where.name = name;
    }

    if (dayOfweek) {
      where.day_of_week = dayOfweek;
    }

    const [shiftsRaw, totalShift] = await Promise.all([
      this.prisma.shift.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          day_of_week: true,
          start_time: true,
          end_time: true,
          _count: {
            select: { employee_shifts: true }, // ← chỉ đếm số nhân viên
          },
        },
      }),
      this.prisma.shift.count({ where }),
    ]);

    const shifts = shiftsRaw.map((s) => ({
      ...s,
      start_time: s.start_time.toTimeString().slice(0, 5),
      end_time: s.end_time.toTimeString().slice(0.5),
      total_employees: s._count.employee_shifts,
    }));

    //   typescript// _count có thể đếm nhiều relation cùng lúc
    // _count: {
    //   select: {
    //     employee_shifts: true,  // ← đếm số nhân viên
    //     // có thể thêm nhiều relation khác
    //   }
    // }

    // // Kết quả trả về
    // s._count = {
    //   employee_shifts: 3  // ← object, không phải số trực tiếp
    // }

    // s._count              = { employee_shifts: 3 }  ← object
    // s._count.employee_shifts = 3                    ← số thực tế

    return {
      data: shifts,
      total: totalShift,
      page: page,
      limit: limit,
      totalPages: Math.ceil(totalShift / limit),
    };
  }

  async findOne(id: string): Promise<ShiftDetailResponseDto> {
    const shift = await this.prisma.shift.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        day_of_week: true,
        start_time: true,
        end_time: true,
        employee_shifts: {
          select: {
            employee: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                avatar_url: true,
                phone: true,
                position: true,
                gender: true,
              },
            },
          },
        },
      },
    });

    if (!shift) {
      throw new NotFoundException(`Không tìm thấy ca làm việc với id: ${id}`);
    }

    // Format employees
    const employees = shift.employee_shifts.map((es) => {
      const { first_name, last_name, ...rest } = es.employee;
      return {
        ...rest,
        full_name: `${last_name} ${first_name}`,
      };
    });

    return {
      id: shift.id,
      name: shift.name,
      day_of_week: shift.day_of_week,
      start_time: shift.start_time.toTimeString().slice(0, 5),
      end_time: shift.end_time.toTimeString().slice(0, 5),
      total_employees: employees.length,
      employees,
    };
  }

  async update(
    id: string,
    updateShiftDto: UpdateShiftDto,
  ): Promise<ResponseShiftDto> {
    const { name, day_of_week, start_time, end_time } = updateShiftDto;

    const shift = await this.prisma.shift.findUnique({
      where: { id },
    });

    if (!shift) {
      throw new NotFoundException('Shift dose not exist');
    }

    if (name || day_of_week) {
      const existing = await this.prisma.shift.findFirst({
        where: {
          name: name ?? shift.name,
          day_of_week: day_of_week ?? shift.day_of_week,
          NOT: { id },
        },
      });

      if (existing) {
        throw new ConflictException(
          `shift ${name ?? shift.name} at ${day_of_week ?? shift.day_of_week} has already Exist`,
        );
      }
    }

    const updatedShift = await this.prisma.shift.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(day_of_week && { day_of_week }),
        ...(start_time && {
          start_time: new Date(`1970-01-01T${start_time}:00`),
        }),
        ...(end_time && { end_time: new Date(`1970-01-01T${end_time}:00`) }),
      },
      select: {
        id: true,
        name: true,
        day_of_week: true,
        start_time: true,
        end_time: true,
      },
    });

    return {
      ...updatedShift,
      start_time: updatedShift.start_time.toTimeString().slice(0, 5),
      end_time: updatedShift.end_time.toTimeString().slice(0, 5),
    };
  }

  remove(id: number) {
    return `This action removes a #${id} shift`;
  }
}
