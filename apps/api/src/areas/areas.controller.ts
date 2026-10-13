import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { AdminGuard } from '../auth/admin.guard';
import type { TokenUser } from '../auth/area.util';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AreasService } from './areas.service';
import type { CreateAreaInput } from './areas.service';

type AuthedReq = Request & { user: TokenUser };

@Controller('areas')
@UseGuards(JwtAuthGuard)
export class AreasController {
  constructor(private readonly areas: AreasService) {}

  @Get()
  list() {
    return this.areas.list();
  }

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() body: CreateAreaInput, @Req() req: AuthedReq) {
    return this.areas.create(body, req.user.sub, req.ip);
  }
}