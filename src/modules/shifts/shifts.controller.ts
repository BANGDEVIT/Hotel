import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Query,
} from '@nestjs/common';
import { ShiftsService } from './shifts.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { Roles } from '../../common/decorators/role-decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  PaginatedShiftResponseDto,
  ResponseShiftDto,
  ShiftDetailResponseDto,
} from './dto/response-shift.dto';
import { QueryShiftDTO } from './dto/query-shift.dto';

@ApiTags('shifts')
@ApiBearerAuth('JWT-auth')
@Controller('shifts')
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  @Post()
  @HttpCode(201)
  @Roles('manager', 'admin')
  @ApiOperation({
    summary: 'Tạo ca làm mới',
    description: 'Tạo ca làm mới. Chỉ có managerment mới có quyền',
  })
  @ApiResponse({
    status: 201,
    description: 'Tạo ca mới thành công',
    type: ResponseShiftDto,
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  @ApiResponse({ status: 409, description: 'Ca làm việc đã tồn tại' })
  create(@Body() createShiftDto: CreateShiftDto): Promise<ResponseShiftDto> {
    return this.shiftsService.create(createShiftDto);
  }

  @Get()
  @HttpCode(200)
  @Roles('manager', 'admin')
  @ApiOperation({
    summary: 'Lấy tất cả các ca làm',
    description: 'Hỗ trợ filter theo tên ca và ngày trong tuần',
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy tất cả các ca làm',
    type: PaginatedShiftResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  async findAll(
    @Query() query: QueryShiftDTO,
  ): Promise<PaginatedShiftResponseDto> {
    return this.shiftsService.findAll(query);
  }

  @Get(':id')
  @HttpCode(200)
  @Roles('manager', 'admin')
  @ApiOperation({
    summary: 'Xem chi tiết ca làm',
    description: 'Xem chi tiết ca làm. Chỉ có manager mới có quyền',
  })
  @ApiParam({
    name: 'id',
    description: 'uuid shift',
    example: 'uuid123',
  })
  @ApiResponse({
    status: 200,
    description: 'Chi tiết ca làm',
    type: ShiftDetailResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  findOne(@Param('id') id: string): Promise<ShiftDetailResponseDto> {
    return this.shiftsService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(200)
  @Roles('manager', 'admin')
  @ApiOperation({
    summary: 'Cập nhật ca làm',
    description: 'Chỉnh sửa ca làm. Chỉ có manager mới có quyền',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID của ca làm việc',
    example: 'uuid-123',
  })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật ca làm',
    type: ResponseShiftDto,
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  @ApiResponse({ status: 409, description: 'Trùng ca làm' })
  update(
    @Param('id') id: string,
    @Body() updateShiftDto: UpdateShiftDto,
  ): Promise<ResponseShiftDto> {
    return this.shiftsService.update(id, updateShiftDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @Roles('manager', 'admin')
  @ApiOperation({
    summary: 'Xóa ca làm việc',
    description: 'Chỉ manager mới có quyền xóa',
  })
  @ApiResponse({ status: 204, description: 'Xóa ca làm thành công' })
  @ApiResponse({
    status: 400,
    description:
      'Vẫn còn nhân viên trong ca làm không thế xóa, cần phải xóa nhân viên trước',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy ca làm việc' })
  remove(@Param('id') id: string) {
    return this.shiftsService.remove(id);
  }
}
