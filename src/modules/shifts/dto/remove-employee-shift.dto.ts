import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class RemoveEmployeeQueryDto {
  @ApiProperty({ example: '2036-12-12' })
  @IsNotEmpty({ message: 'Ngày làm việc không được để trống' })
  @IsDateString({}, { message: 'Ngày không đúng định dạng YYYY-MM-DD' })
  work_date: string;
}
