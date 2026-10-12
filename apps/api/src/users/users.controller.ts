import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AdminGuard } from '../auth/admin.guard';
import type { TokenUser } from '../auth/area.util';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import type { CreateRoleInput, CreateUserInput } from './users.service';

type AuthedReq = Request & { user: TokenUser };

@Controller()
@UseGuards(JwtAuthGuard, AdminGuard)
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('users')
  listUsers() {
    return this.users.listUsers();
  }

  @Post('users')
  createUser(@Body() body: CreateUserInput, @Req() req: AuthedReq) {
    return this.users.createUser(body, req.user.sub, req.ip);
  }

  @Post('users/:id/reset-password')
  resetPassword(@Param('id', ParseIntPipe) id: number, @Req() req: AuthedReq) {
    return this.users.resetPassword(id, req.user.sub, req.ip);
  }

  @Patch('users/:id/active')
  setActive(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { active: boolean },
    @Req() req: AuthedReq,
  ) {
    return this.users.setActive(id, body?.active, req.user.sub, req.ip);
  }

  @Get('roles')
  listRoles() {
    return this.users.listRoles();
  }

  @Post('roles')
  createRole(@Body() body: CreateRoleInput, @Req() req: AuthedReq) {
    return this.users.createRole(body, req.user.sub, req.ip);
  }
}