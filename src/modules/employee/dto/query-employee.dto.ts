import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class QueryEmployeeDTO {
  @ApiPropertyOptional({ example: 1, description: 'Số trang' })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, description: 'Số lượng mỗi trang' })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ example: 'Bui', description: 'Tim theo họ hoặc tên' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    example: 'receptionist',
    description: 'Lọc theo vị trí',
  })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiPropertyOptional({ example: 'male', description: 'Lọc theo giới tính' })
  @IsOptional()
  @IsString()
  gender?: string;
}
