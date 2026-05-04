import { Body, Controller, HttpCode, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dto/register.dto';
import { RegisterResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { GetAccount } from '../../common/decorators/get-account.decorator';
import { Public } from '../../common/decorators/public.decorator';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(201)
  @ApiOperation({
    summary: 'Đăng ký tài khoản',
    description: 'Tạo tài khoản mới cho khách hàng',
  })
  @ApiResponse({
    status: 201,
    description: 'Đăng ký thành công',
    type: RegisterResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 409, description: 'Email đã tồn tại' })
  @ApiResponse({ status: 500, description: 'Lỗi server' })
  async register(
    @Body() registerdto: RegisterDTO,
  ): Promise<RegisterResponseDto> {
    return this.authService.register(registerdto);
  }

  @Public()
  @Post('login')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Đăng nhập',
    description:
      'Đăng nhập và nhận access token. Refresh token được lưu trong HttpOnly Cookie',
  })
  @ApiResponse({
    status: 200,
    description: 'Đăng nhập thành công — trả về accessToken',
  })
  @ApiResponse({ status: 401, description: 'Email hoặc mật khẩu không đúng' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, account } =
      await this.authService.login(loginDto);

    res.cookie('refresh-token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });

    // nếu ko có passthrough: true  Phải tự gửi response thủ công
    // res.json({ accessToken }); // ← phải làm thế này

    return {
      accessToken: accessToken,
      account: account,
    };
  }

  @Public()
  @Post('refresh')
  @HttpCode(200)
  @ApiCookieAuth('refresh-token')
  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Lấy access token mới từ refresh token trong cookie',
  })
  @ApiResponse({ status: 200, description: 'Trả về accessToken mới' })
  @ApiResponse({
    status: 401,
    description: 'Refresh token không hợp lệ hoặc hết hạn',
  })
  async refresh(@Req() req: Request) {
    // ← Lấy refresh token từ cookie
    const refreshToken = req.cookies['refresh_token'];

    const { accessToken } = await this.authService.refreshToken(refreshToken);

    return { accessToken };
  }

  @Post('logout')
  @HttpCode(204)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Đăng xuất',
    description: 'Đăng xuất và thu hồi refresh token',
  })
  @ApiResponse({ status: 204, description: 'Đăng xuất thành công' })
  @ApiResponse({
    status: 401,
    description: 'Chưa đăng nhập hoặc token hết hạn',
  })
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @GetAccount('sub') accountId: string,
  ) {
    const refreshToken = req.cookies['refresh-token'];

    await this.authService.logout(accountId, refreshToken);

    res.clearCookie('refresh-token');
  }
}
