import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/client';

// ← Tách class riêng cho account
export class AccountInEmployeeDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'user@gmail.com' })
  email: string;

  @ApiProperty({ example: true })
  is_active: boolean;
}

export class EmployeeResponseDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Bui Cong Bang' })
  full_name: string;

  @ApiProperty({ example: 'bcb@gmail.com' })
  email: string;

  @ApiProperty({ example: '0909123456' })
  phone: string;

  @ApiProperty({ example: 'receptionist' })
  position: string;

  @ApiProperty({ example: 5000000 })
  salary: Decimal;

  @ApiProperty({ example: '2024-01-01' })
  hired_date: Date;

  @ApiProperty({ example: 'male' })
  gender: string;

  @ApiProperty({ type: AccountInEmployeeDto })
  account: AccountInEmployeeDto;
}

export class PaginatedEmployeeResponseDto {
  @ApiProperty({ type: [EmployeeResponseDto] })
  data: EmployeeResponseDto[];

  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 10 })
  totalPages: number;
}
