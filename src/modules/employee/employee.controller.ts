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
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaginatedEmployeeResponseDto } from './dto/employee-response';
import { QueryEmployeeDTO } from './dto/query-employee.dto';

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
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(+id);
  }

  @Post()
  @Roles('manager')
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
