// dto/create-guest.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsEmail } from 'class-validator';

export class CreateGuestDto {
  @ApiProperty({ example: 'Nguyen', description: 'Họ' })
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @ApiProperty({ example: 'Bang', description: 'Tên' })
  @IsNotEmpty()
  @IsString()
  last_name: string;

  @ApiProperty({ example: '0909123456', description: 'Số điện thoại' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiPropertyOptional({ example: 'bang@gmail.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'CC001234', description: 'Số CMND/CCCD (bắt buộc)' })
  @IsNotEmpty()
  @IsString()
  id_card: string; // bỏ ? và thêm @IsNotEmpty()

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Ảnh mặt trước CMND (upload file)',
  })
  @IsOptional()
  id_card_img_url?: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Ảnh mặt sau CMND',
  })
  @IsOptional()
  id_card_img_back_url?: string;

  @ApiPropertyOptional({ example: 'Vietnamese' })
  @IsOptional()
  @IsString()
  nationality?: string;
}
