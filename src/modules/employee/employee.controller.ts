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
import { UpdateEmployeeDto, UpdateProfileDto } from './dto/update-employee.dto';
import { Roles } from '../../common/decorators/role-decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  EmployeeProfileResponseDto,
  EmployeeResponseDto,
  PaginatedEmployeeResponseDto,
} from './dto/employee-response';
import { QueryEmployeeDTO } from './dto/query-employee.dto';
import { GetAccount } from '../../common/decorators/get-account.decorator';

@ApiTags('employees')
@ApiBearerAuth('jwt-auth')
@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  @HttpCode(200)
  @Roles('admin', 'manager')
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

  @Get('profile')
  @HttpCode(200)
  @Roles('staff', 'admin', 'manager')
  @ApiOperation({
    summary: 'Xem thông tin trang cá nhân',
    description: 'Xem thông tin cá nhân',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về thông tin tràng cá nhân của nhân viên',
    type: EmployeeProfileResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy nhân viên' })
  async getProfile(
    @GetAccount('sub') accountId: string,
  ): Promise<EmployeeProfileResponseDto> {
    return this.employeeService.getProfile(accountId);
  }

  @Get(':id')
  @HttpCode(200)
  @Roles('admin', 'manager')
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
  @Roles('admin', 'manager')
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
  @HttpCode(200)
  @Roles('manager', 'admin')
  @ApiOperation({
    summary: 'Cập nhật thông tin nhân viên',
    description: 'Chi manager mới có quyền cập nhật.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID của nhân viên',
    example: 'uuid-123',
  })
  @ApiResponse({
    status: 200,
    description: 'Câp nhật thành công',
    type: UpdateEmployeeDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dữ liệu không hơp lệ',
  })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền câp nhật' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy nhân viên' })
  @ApiResponse({ status: 409, description: 'Email đã tồn tại' })
  async update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeeService.update(id, updateEmployeeDto);
  }

  @Patch(':id/reset-password')
  @HttpCode(200)
  @Roles('manager', 'admin')
  @ApiOperation({
    summary: 'Reset mật khẩu nhân viên',
    description: 'Reset về mật khẩu mặc định — nhân viên tự đổi sau khi login',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID của nhân viên',
    example: 'uuid-123',
  })
  @ApiResponse({ status: 200, description: 'Reset mật khẩu thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy nhân viên' })
  async resetPassword(@Param('id') id: string) {
    await this.employeeService.resetPassword(id);
    return { message: 'Reset mật khẩu thành công' };
  }

  @Delete(':id')
  @HttpCode(204)
  @Roles('manager', 'admin')
  @ApiOperation({
    summary: 'Xóa mềm tài khoản nhân viên',
    description: 'Chỉ manager và admin mới có quyền xóa',
  })
  @ApiResponse({ status: 204, description: 'Xóa mềm tài khoản thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy nhân viên' })
  async remove(@Param('id') id: string) {
    await this.employeeService.remove(id);
    return;
  }

  @Patch('profile')
  @HttpCode(200)
  @Roles('staff', 'admin', 'manager')
  @ApiOperation({
    summary: 'Cập nhật thông tin cá nhân',
    description: 'Cập nhật thông tin + ảnh đại diện cùng lúc',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        first_name: { type: 'string', example: 'Bang' },
        last_name: { type: 'string', example: 'Bui' },
        phone: { type: 'string', example: '0909123456' },
        gender: { type: 'string', example: 'male' },
        // file: { type: 'string', format: 'binary' }, // ← file upload
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật thành công',
    type: EmployeeProfileResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy nhân viên' })
  async updateProfile(
    @GetAccount('sub') accountId: string,
    @Body() updateProfile: UpdateProfileDto,
  ): Promise<EmployeeProfileResponseDto> {
    return this.employeeService.update(accountId, updateProfile);
  }
}
