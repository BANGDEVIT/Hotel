// customer.controller.ts
import {
  Controller,
  Get,
  Patch,
  Param,
  Delete,
  Query,
  Body,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';

import {
  PaginatedCustomerResponseDto,
  CustomerResponseDto,
} from './dto/customer-response.dto';
import { Roles } from '../../common/decorators/role-decorator';
import { GetAccount } from '../../common/decorators/get-account.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { QueryCustomerDto } from './dto/query-customers.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { UpdateCustomerProfileDto } from './dto/update-customer-profile.dto';
import { ChangePasswordDto } from './dto/chang-password-customer.dto';
import { CreateGuestDto } from './dto/create-guest.dto';
import { RegisterDTO } from '../auth/dto/register.dto';

@Controller('customers')
@ApiTags('customers')
@ApiBearerAuth('JWT-auth')
export class CustomersController {
  constructor(private readonly customerService: CustomersService) {}

  // ==================== GET PROFILE ====================
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @Roles('customer')
  @ApiOperation({
    summary: 'Xem thông tin cá nhân',
    description: 'Khách hàng xem thông tin cá nhân của mình',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Trả về thông tin cá nhân',
    type: CustomerResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Chưa đăng nhập',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Không có quyền truy cập',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy khách hàng',
  })
  async getProfile(
    @GetAccount('sub') accountId: string,
  ): Promise<CustomerResponseDto> {
    return this.customerService.getProfile(accountId);
  }

  // ==================== UPDATE PROFILE ====================
  @Patch('profile')
  @HttpCode(HttpStatus.OK)
  @Roles('customer')
  @ApiOperation({
    summary: 'Cập nhật thông tin cá nhân',
    description:
      'Khách hàng tự cập nhật thông tin cá nhân (không bao gồm reward_points và is_active)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cập nhật thông tin thành công',
    type: CustomerResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Email đã tồn tại hoặc dữ liệu không hợp lệ',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Chưa đăng nhập',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Không có quyền truy cập',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy khách hàng',
  })
  async updateProfile(
    @GetAccount('sub') accountId: string,
    @Body() updateCustomerProfileDto: UpdateCustomerProfileDto,
  ): Promise<CustomerResponseDto> {
    return this.customerService.updateProfile(
      accountId,
      updateCustomerProfileDto,
    );
  }

  // ==================== CHANGE PASSWORD ====================
  @Patch('profile/password')
  @HttpCode(HttpStatus.OK)
  @Roles('customer')
  @ApiOperation({
    summary: 'Đổi mật khẩu',
    description: 'Khách hàng đổi mật khẩu (yêu cầu mật khẩu hiện tại)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Đổi mật khẩu thành công',
    schema: {
      example: {
        message: 'Password changed successfully',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Mật khẩu hiện tại không đúng hoặc mật khẩu mới trùng mật khẩu cũ',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Chưa đăng nhập',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Không có quyền truy cập',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy tài khoản',
  })
  async changePassword(
    @GetAccount('sub') accountId: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.customerService.changePassword(accountId, changePasswordDto);

    return {
      message: 'Password changed successfully',
    };
  }

  // Staff tạo khách vãng lai
  // ==================== CREATE GUEST ====================
  @Post('guest')
  @HttpCode(201)
  @Roles('staff', 'manager', 'admin')
  @ApiOperation({
    summary: 'Tạo khách vãng lai',
    description: 'Staff tạo hồ sơ khách walk-in tại quầy',
  })
  @ApiResponse({
    status: 201,
    description: 'Tạo khách thành công',
    type: CustomerResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Số điện thoại đã tồn tại' })
  async createGuest(
    @Body() createGuestDto: CreateGuestDto,
  ): Promise<CustomerResponseDto> {
    return this.customerService.createGuest(createGuestDto);
  }

  // ==================== GET ALL CUSTOMERS ====================
  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles('staff', 'manager', 'admin')
  @ApiOperation({
    summary: 'Lấy danh sách khách hàng',
    description:
      'Hỗ trợ filter theo quốc tịch và tìm kiếm theo tên, email, số điện thoại',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Trả về danh sách khách hàng',
    type: PaginatedCustomerResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Chưa đăng nhập',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Không có quyền truy cập',
  })
  async findAll(
    @Query() query: QueryCustomerDto,
  ): Promise<PaginatedCustomerResponseDto> {
    return this.customerService.findAll(query);
  }

  // ==================== GET CUSTOMER BY ID ====================
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Roles('manager', 'admin', 'staff')
  @ApiOperation({
    summary: 'Xem chi tiết khách hàng',
    description: 'Xem thông tin chi tiết của 1 khách hàng',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID của khách hàng',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Trả về chi tiết khách hàng',
    type: CustomerResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Chưa đăng nhập',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Không có quyền truy cập',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy khách hàng',
  })
  async findById(@Param('id') id: string): Promise<CustomerResponseDto> {
    return this.customerService.findById(id);
  }

  // Staff liên kết tài khoản cho guest
  // ====================LINK ACCOUNT====================
  @Post(':id/link-account')
  @HttpCode(200)
  @Roles('staff', 'manager', 'admin')
  @ApiOperation({
    summary: 'Liên kết tài khoản cho khách vãng lai',
    description:
      'Khi khách walk-in muốn đăng ký tài khoản — liên kết với hồ sơ cũ',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID của customer (walk-in)',
    example: 'uuid-123',
  })
  @ApiResponse({ status: 200, description: 'Liên kết thành công' })
  @ApiResponse({ status: 400, description: 'Khách hàng đã có tài khoản rồi' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy khách hàng' })
  @ApiResponse({ status: 409, description: 'Email đã được sử dụng' })
  async linkAccount(
    @Param('id') customerId: string,
    @Body() registerDto: RegisterDTO,
  ): Promise<{ message: string }> {
    return this.customerService.linkAccount(customerId, registerDto);
  }

  // ==================== UPDATE CUSTOMER ====================
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Roles('manager', 'admin')
  @ApiOperation({
    summary: 'Cập nhật thông tin khách hàng',
    description:
      'Cho phép manager/admin cập nhật thông tin và trạng thái khách hàng',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID của khách hàng',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cập nhật khách hàng thành công',
    type: CustomerResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dữ liệu không hợp lệ',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Chưa đăng nhập',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Không có quyền truy cập',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy khách hàng',
  })
  async update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<CustomerResponseDto> {
    return this.customerService.update(id, updateCustomerDto);
  }

  // ==================== DELETE CUSTOMER ====================
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Roles('manager', 'admin')
  @ApiOperation({
    summary: 'Vô hiệu hóa khách hàng',
    description: 'Soft delete - chỉ vô hiệu hóa tài khoản, không xóa dữ liệu',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID của khách hàng',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Vô hiệu hóa khách hàng thành công',
    schema: {
      example: {
        message: 'Customer deactivated successfully',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Khách hàng đã bị vô hiệu hóa trước đó',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Chưa đăng nhập',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Không có quyền truy cập',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy khách hàng',
  })
  async remove(@Param('id') id: string) {
    await this.customerService.remove(id);

    return {
      message: 'Customer deactivated successfully',
    };
  }
}
