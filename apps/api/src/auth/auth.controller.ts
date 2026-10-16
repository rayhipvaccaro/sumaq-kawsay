import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AllowMustChange } from './allow-must-change.decorator';
import type { TokenUser } from './area.util';
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

type AuthedReq = Request & { user: TokenUser };

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  @HttpCode(200)
  login(@Body() body: LoginBody, @Req() req: Request) {
    return this.auth.login(body?.username, body?.password, req.ip);
  }

  @Get('me')
  @AllowMustChange()
  @UseGuards(JwtAuthGuard)
  me(@Req() req: AuthedReq) {
    const u = req.user;
    return {
      id: u.sub,
      username: u.username,
      role: u.role,
      isAdmin: u.isAdmin,
      area: u.area,
      areaId: u.areaId,
      fullName: u.fullName,
      discountPct: u.discountPct ?? 0,
      docType: u.docType ?? null,
      docNumber: u.docNumber ?? null,
      permissions: u.permissions,
      mustChangePassword: u.mustChange,
    };
  }

  @Post('change-password')
  @HttpCode(200)
  @AllowMustChange()
  @UseGuards(JwtAuthGuard)
  changePassword(@Body() body: ChangePasswordBody, @Req() req: AuthedReq) {
    return this.auth.changePassword(
      req.user.sub,
      body?.currentPassword,
      body?.newPassword,
      req.ip,
    );
  }
}