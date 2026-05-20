// dto/update-customer-profile.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

// Customer tự cập nhật — ít field hơn, không có reward_points và is_active
export class UpdateCustomerProfileDto {
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

  @ApiPropertyOptional({ example: 'bang@gmail.com' })
  @IsOptional()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email?: string;

  @ApiPropertyOptional({ example: 'CC001234' })
  @IsOptional()
  @IsString()
  id_card?: string;

  @ApiPropertyOptional({ example: 'Vietnamese' })
  @IsOptional()
  @IsString()
  nationality?: string;

  // ← Thêm sau khi setup AWS S3
  // @ApiPropertyOptional()
  // id_card_img_url?: string;

  // @ApiPropertyOptional()
  // id_card_img_back_url?: string;
}
