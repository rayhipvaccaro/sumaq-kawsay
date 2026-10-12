import { Body, Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

export interface LoginBody {
  username: string;
  password: string;
}

export interface ChangePasswordBody {
  currentPassword: string;
  newPassword: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  @HttpCode(200)
  login(@Body() body: LoginBody, @Req() req: Request) {
    return this.auth.login(body?.username, body?.password, req.ip);
  }

  @Post('change-password')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  changePassword(@Body() body: ChangePasswordBody, @Req() req: Request) {
    const userId = (req as any).user.sub as number;
    return this.auth.changePassword(
      userId,
      body?.currentPassword,
      body?.newPassword,
      req.ip,
    );
  }
}