import {
  Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Put, Query, Req, UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import type { TokenUser } from '../auth/area.util';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OpsService } from './ops.service';
import type { AssetInput, RouteInput, StartInput } from './ops.service';

type AuthedReq = Request & { user: TokenUser };
type Id = number;

@Controller()
@UseGuards(JwtAuthGuard)
export class OpsController {
  constructor(private readonly ops: OpsService) {}

  @Get('activities/:id/board')
  board(@Param('id', ParseIntPipe) id: Id, @Query('date') date: string | undefined, @Req() req: AuthedReq) {
    return this.ops.board(id, date, req.user);
  }

  @Patch('activities/:id')
  setConfig(@Param('id', ParseIntPipe) id: Id, @Body() b: { resourceLabel?: string | null }, @Req() req: AuthedReq) {
    return this.ops.setConfig(id, b, req.user);
  }

  @Post('activities/:id/assets')
  createAsset(@Param('id', ParseIntPipe) id: Id, @Body() b: AssetInput, @Req() req: AuthedReq) {
    return this.ops.createAsset(id, b, req.user);
  }

  @Put('activities/:id/routes')
  setRoutes(@Param('id', ParseIntPipe) id: Id, @Body() b: { routes: RouteInput[] }, @Req() req: AuthedReq) {
    return this.ops.setRoutes(id, b?.routes, req.user);
  }

  @Post('activities/:id/days')
  openDays(@Param('id', ParseIntPipe) id: Id, @Body() b: { from: string; to: string }, @Req() req: AuthedReq) {
    return this.ops.openDays(id, b?.from, b?.to, req.user);
  }

  @Put('activities/:id/absent')
  absent(
    @Param('id', ParseIntPipe) id: Id,
    @Body() b: { date: string; userId?: number; absent: boolean },
    @Req() req: AuthedReq,
  ) {
    return this.ops.absent(id, b, req.user);
  }

  @Patch('resources/:id')
  updateAsset(@Param('id', ParseIntPipe) id: Id, @Body() b: AssetInput, @Req() req: AuthedReq) {
    return this.ops.updateAsset(id, b, req.user);
  }

  @Put('resources/:id/day')
  setDay(@Param('id', ParseIntPipe) id: Id, @Body() b: { date: string; trips?: number | null }, @Req() req: AuthedReq) {
    return this.ops.setDay(id, b, req.user);
  }

  @Post('resources/:id/take')
  take(@Param('id', ParseIntPipe) id: Id, @Body() b: { date: string }, @Req() req: AuthedReq) {
    return this.ops.take(id, b, req.user);
  }

  @Post('runs/start')
  start(@Body() b: StartInput, @Req() req: AuthedReq) {
    return this.ops.start(b, req.user);
  }

  @Post('runs/skip')
  skip(@Body() b: { bookingId: number; reason: string }, @Req() req: AuthedReq) {
    return this.ops.skip(b, req.user);
  }

  @Post('runs/:id/finish')
  finish(@Param('id', ParseIntPipe) id: Id, @Body() b: { notDone?: boolean; reason?: string }, @Req() req: AuthedReq) {
    return this.ops.finish(id, b, req.user);
  }
}