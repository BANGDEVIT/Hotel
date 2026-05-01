import { Body, Controller, HttpCode, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dto/register.dto';
import { RegisterResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { GetAccount } from '../../common/decorators/get-account.decorator';
import { Public } from '../../common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body() registerdto: RegisterDTO,
  ): Promise<RegisterResponseDto> {
    return this.authService.register(registerdto);
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.login(loginDto);

    res.cookie('refresh-token', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });

    // nếu ko có passthrough: true  Phải tự gửi response thủ công
    // res.json({ accessToken }); // ← phải làm thế này

    return {
      accessToken: tokens.accessToken,
    };
  }

  @Public()
  @Post('refresh')
  @HttpCode(200)
  async refresh(@Req() req: Request) {
    // ← Lấy refresh token từ cookie
    const refreshToken = req.cookies['refresh_token'];

    const { accessToken } = await this.authService.refreshToken(refreshToken);

    return { accessToken };
  }

  @Post('logout')
  @HttpCode(204)
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
