import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class QueryCustomerDto {
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
    example: 'Nguyen Bang',
    description: 'Tìm theo tên, email, số điện thoại',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    example: 'Vietnamese',
    description: 'Lọc theo quốc tịch',
  })
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiPropertyOptional({
    example: 'created_at',
    enum: ['first_name', 'last_name', 'reward_points', 'created_at'],
    description: 'Trường sắp xếp',
  })
  @IsOptional()
  @IsIn(['first_name', 'last_name', 'reward_points', 'created_at'])
  orderby?: string = 'created_at';

  @ApiPropertyOptional({
    example: 'asc',
    enum: ['asc', 'desc'],
    description: 'Thứ tự sắp xếp',
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc' = 'desc';
}
