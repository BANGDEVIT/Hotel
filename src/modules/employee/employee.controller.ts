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
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Roles } from '../../common/decorators/role-decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  EmployeeResponseDto,
  PaginatedEmployeeResponseDto,
} from './dto/employee-response';
import { QueryEmployeeDTO } from './dto/query-employee.dto';

@ApiTags('employees')
@ApiBearerAuth('jwt-auth')
@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  @HttpCode(200)
  @Roles('manager')
  @ApiOperation({
    summary: 'Lấy danh sách nhân viên',
    description: 'Hỗ trợ filter theo tên, vị trí và phân trang',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về danh sách nhân viên',
    type: PaginatedEmployeeResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  findAll(
    @Query() query: QueryEmployeeDTO,
  ): Promise<PaginatedEmployeeResponseDto> {
    return this.employeeService.findAll(query);
  }

  @Get(':id')
  @HttpCode(200)
  @Roles('manager')
  @ApiOperation({
    summary: 'Lấy thông tin nhân viên theo ID',
    description: 'Chỉ manager mới xem được thông tin chi tiết của nhân viên',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID của nhân viên',
    example: 'uuid-123',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về thông tin nhân viên',
    type: EmployeeResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy nhân viên' })
  findOne(@Param('id') id: string): Promise<EmployeeResponseDto> {
    return this.employeeService.findOne(id);
  }

  @Post()
  @HttpCode(201)
  @Roles('manager')
  @ApiOperation({
    summary: 'Tạo nhân viên mới',
    description:
      'Tạo tài khoản + thông tin nhân viên. Chỉ manager mới có quyền',
  })
  @ApiResponse({
    status: 201,
    description: 'Tạo nhân viên thành công',
    type: EmployeeResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  @ApiResponse({ status: 409, description: 'Email đã tồn tại' })
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeeService.update(+id, updateEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeService.remove(+id);
  }
}
