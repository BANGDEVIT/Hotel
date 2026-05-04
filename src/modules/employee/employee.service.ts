import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { QueryEmployeeDTO } from './dto/query-employee.dto';
import { PaginatedEmployeeResponseDto } from './dto/employee-response';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EmployeeService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(
    query: QueryEmployeeDTO,
  ): Promise<PaginatedEmployeeResponseDto> {
    const { page = 1, limit = 10, search, position, gender } = query;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { first_name: { contains: search, mode: 'insensitive' } },
        { last_name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (position) {
      where.position = { contains: { position }, mode: 'insensitve' };
    }

    if (gender) {
      where.gender = { contains: { position }, mode: 'insensitive' };
    }

    const [employeesRaw, total] = await Promise.all([
      this.prisma.employee.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          phone: true,
          position: true,
          salary: true,
          hired_date: true,
          gender: true,
          account: {
            select: {
              id: true,
              email: true,
              is_active: true,
            },
          },
        },
        orderBy: { first_name: 'asc', last_name: 'asc' },
      }),

      this.prisma.employee.count({ where }),
    ]);

    const employees = employeesRaw.map((em) => {
      const { first_name, last_name, ...rest } = em;
      return {
        ...rest,
        full_name: `${last_name} + ${first_name}`,
      };
    });

    return {
      data: employees,
      total: total,
      page: page,
      limit: limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} employee`;
  }

  create(createEmployeeDto: CreateEmployeeDto) {
    return 'This action adds a new employee';
  }

  update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    return `This action updates a #${id} employee`;
  }

  remove(id: number) {
    return `This action removes a #${id} employee`;
  }
}
