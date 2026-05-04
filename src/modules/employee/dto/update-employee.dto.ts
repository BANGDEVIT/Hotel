import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { CreateEmployeeDto } from './create-employee.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateEmployeeDto extends PartialType(
  OmitType(CreateEmployeeDto, ['role', 'password'] as const),
) {
  @ApiPropertyOptional({
    example: true,
    description: 'Kích hoạt/khóa tài khoản',
  })
  @IsOptional()
  @IsBoolean()
  is_active: boolean;
}
