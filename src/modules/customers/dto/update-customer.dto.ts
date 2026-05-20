// dto/update-customer.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

// Manager cập nhật thông tin khách
export class UpdateCustomerDto {
  @ApiPropertyOptional({ example: 'Bang' })
  @IsOptional()
  @IsString()
  first_name?: string;

  @ApiPropertyOptional({ example: 'Nguyen' })
  @IsOptional()
  @IsString()
  last_name?: string;

  @ApiPropertyOptional({ example: '0909123456' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'CC001234' })
  @IsOptional()
  @IsString()
  id_card?: string;

  @ApiPropertyOptional({ example: 'Vietnamese' })
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiPropertyOptional({
    example: 100,
    description: 'Điều chỉnh reward points',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  reward_points?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Kích hoạt/khóa tài khoản',
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  // ← Thêm sau khi setup AWS S3
  // @ApiPropertyOptional()
  // id_card_img_url?: string;

  // @ApiPropertyOptional()
  // id_card_img_back_url?: string;
}
