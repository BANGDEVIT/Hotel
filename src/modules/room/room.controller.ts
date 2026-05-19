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
  HttpStatus,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import {
  PaginatedRoomResponseDto,
  RoomResponseDto,
} from './dto/room-response.dto';
import { Roles } from '../../common/decorators/role-decorator';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { QueryRoomDto } from './dto/query-room.dto';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @HttpCode(201)
  @Roles('manager', 'admin')
  // ← Sau khi setup AWS S3 thì thêm vào
  // @UseInterceptors(FileInterceptor('file'))
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       room_number: { type: 'string', example: 'A01' },
  //       room_type_id: { type: 'string', example: 'uuid-123' },
  //       floor: { type: 'number', example: 1 },
  //       file: { type: 'string', format: 'binary' },
  //     },
  //   },
  // })
  @ApiOperation({
    summary: 'Tạo phòng mới',
    description: 'Chỉ manager và admin mới có quyền tạo phòng',
  })
  @ApiResponse({
    status: 201,
    description: 'Tạo phòng thành công',
    type: RoomResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Loại phòng đã bị xóa' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy loại phòng' })
  @ApiResponse({ status: 409, description: 'Số phòng đã tồn tại' })
  async create(
    @Body() createRoomDto: CreateRoomDto,
    // @UploadedFile() file?: Express.Multer.File, ← thêm sau khi setup AWS S3
  ): Promise<RoomResponseDto> {
    return this.roomService.create(createRoomDto);
  }

  @Get()
  @HttpCode(200)
  @Roles('staff', 'manager', 'admin')
  @ApiResponse({
    status: 200,
    description: 'Trả về danh sách phòng',
    type: PaginatedRoomResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy loại phòng' })
  async findAll(@Query() query: QueryRoomDto) {
    return this.roomService.findAll(query);
  }

  @Get(':id')
  @HttpCode(200)
  @Roles('staff', 'manager', 'admin')
  @ApiResponse({
    status: 200,
    description: 'Trả về chi tiết phòng',
    type: RoomResponseDto,
  })
  @ApiParam({
    name: 'id',
    description: 'uuid room',
    example: 'uuid123',
  })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy loại phòng' })
  findOne(@Param('id') id: string) {
    return this.roomService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Roles('staff', 'manager', 'admin')
  @ApiOperation({
    summary: 'Cập nhật phòng',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID của phòng',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật phòng thành công',
    type: RoomResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dữ liệu không hợp lệ hoặc room type không active',
  })
  @ApiResponse({
    status: 401,
    description: 'Chưa đăng nhập',
  })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền truy cập',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy phòng hoặc loại phòng',
  })
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomService.update(id, updateRoomDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Roles('manager', 'admin')
  @ApiOperation({
    summary: 'Xóa mềm phòng',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID của phòng',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Xóa phòng thành công',
    schema: {
      example: {
        message: 'Room deleted successfully',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Phòng đã bị vô hiệu hóa trước đó',
  })
  @ApiResponse({
    status: 401,
    description: 'Chưa đăng nhập',
  })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền truy cập',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy phòng',
  })
  async remove(@Param('id') id: string) {
    await this.roomService.remove(id);

    return {
      message: 'Room deleted successfully',
    };
  }
}
