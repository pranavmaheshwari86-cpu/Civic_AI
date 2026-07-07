import { Controller, Post, Body, Res, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsString, IsPhoneNumber } from 'class-validator';
import { Response } from 'express';

class RequestOtpDto {
  @IsString()
  phone: string;
}

class VerifyOtpDto {
  @IsString()
  phone: string;

  @IsString()
  otp: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('otp/request')
  @HttpCode(200)
  async requestOtp(@Body() dto: RequestOtpDto) {
    await this.authService.requestOtp(dto.phone);
    return { message: 'OTP sent' };
  }

  @Post('otp/verify')
  @HttpCode(200)
  async verifyOtp(@Body() dto: VerifyOtpDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.verifyOtp(dto.phone, dto.otp);
    res.cookie('refreshToken', result.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    return { accessToken: result.access_token };
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refreshToken');
    return { message: 'logged out' };
  }
}
