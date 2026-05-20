import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AccountInCustomerDto {
  @ApiProperty({ example: 'uuid123' })
  id: string;

  @ApiProperty({ example: 'customer@gmail.com' })
  email: string;

  @ApiProperty({ example: true })
  is_active: boolean;
}

export class CustomerResponseDto {
  @ApiProperty({ example: 'uuid123' })
  id: string;

  @ApiProperty({ example: 'Bui Cong Bang' })
  full_name: string;

  @ApiPropertyOptional({ example: '0909123456' })
  phone: string | null;

  @ApiPropertyOptional({ example: 'CC001234' })
  id_card: string | null;

  @ApiPropertyOptional({
    example: 'https://s3.amazonaws.com/bucket/id-card.jpg',
    description: 'URL ảnh CMND mặt trước',
  })
  // id_card_img_url: string | null; ← thêm sau khi setup AWS S3
  @ApiPropertyOptional({
    example: 'https://s3.amazonaws.com/bucket/id-card-back.jpg',
    description: 'URL ảnh CMND mặt sau',
  })
  // id_card_img_back_url: string | null; ← thêm sau khi setup AWS S3
  @ApiPropertyOptional({ example: 'Vietnamese' })
  nationality: string | null;

  @ApiProperty({ example: 100 })
  reward_points: number;

  @ApiProperty({ type: AccountInCustomerDto })
  account: AccountInCustomerDto;

  @ApiProperty({ example: '2026-05-12T00:00:00.000Z' })
  updated_at: Date;
}

export class PaginatedCustomerResponseDto {
  @ApiProperty({ type: [CustomerResponseDto] })
  data: CustomerResponseDto[];

  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 10 })
  totalPages: number;
}
