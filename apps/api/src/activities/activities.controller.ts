import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AdminGuard } from '../auth/admin.guard';
import type { TokenUser } from '../auth/area.util';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ActivitiesService } from './activities.service';
import type {
  CreateActivityInput,
  CreateResourcesInput,
  CreateSlotInput,
} from './activities.service';

type AuthedReq = Request & { user: TokenUser };

@Controller()
export class ActivitiesController {
  constructor(private readonly activities: ActivitiesService) {}

  @Post('activities')
  @UseGuards(JwtAuthGuard, AdminGuard)
  createActivity(@Body() body: CreateActivityInput) {
    return this.activities.createActivity(body);
  }

  @Get('activities')
  listActivities() {
    return this.activities.listActivities();
  }
    @Get('me/activities')
  @UseGuards(JwtAuthGuard)
  myActivities(@Req() req: AuthedReq) {
    return this.activities.listMine(req.user);
  }

  @Get('me/bookings')
  @UseGuards(JwtAuthGuard)
  myBookings(
    @Req() req: AuthedReq,
    @Query('activityId') activityId?: string,
    @Query('limit') limit?: string,
  ) {
    return this.activities.listMyBookings(
      req.user,
      activityId ? Number(activityId) : undefined,
      limit ? Number(limit) : undefined,
    );
  }
  @Post('activities/:id/resources')
  @UseGuards(JwtAuthGuard)
  addResources(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateResourcesInput,
    @Req() req: AuthedReq,
  ) {
    return this.activities.addResources(id, body, req.user);
  }

  @Delete('resources/:id')
  @UseGuards(JwtAuthGuard)
  removeResource(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthedReq,
  ) {
    return this.activities.removeResource(id, req.user);
  }

  @Post('activities/:id/slots')
  @UseGuards(JwtAuthGuard)
  createSlot(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateSlotInput,
    @Req() req: AuthedReq,
  ) {
    return this.activities.createSlot(id, body, req.user);
  }
    @Get('activities/:id/availability')
  availability(
    @Param('id', ParseIntPipe) id: number,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.activities.availability(id, from, to);
  }
  @Get('activities/:id/slots')
  listSlots(@Param('id', ParseIntPipe) id: number) {
    return this.activities.listSlots(id);
  }

  @Delete('slots/:id')
  @UseGuards(JwtAuthGuard)
  removeSlot(@Param('id', ParseIntPipe) id: number, @Req() req: AuthedReq) {
    return this.activities.removeSlot(id, req.user);
  }
}