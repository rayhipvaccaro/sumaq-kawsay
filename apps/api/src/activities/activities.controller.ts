import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import type {
  CreateActivityInput,
  CreateResourcesInput,
  CreateSlotInput,
} from './activities.service';

@Controller()
export class ActivitiesController {
  constructor(private readonly activities: ActivitiesService) {}

  @Post('activities')
  createActivity(@Body() body: CreateActivityInput) {
    return this.activities.createActivity(body);
  }

  @Get('activities')
  listActivities() {
    return this.activities.listActivities();
  }

  @Post('activities/:id/resources')
  addResources(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateResourcesInput,
  ) {
    return this.activities.addResources(id, body);
  }

  @Delete('resources/:id')
  removeResource(@Param('id', ParseIntPipe) id: number) {
    return this.activities.removeResource(id);
  }

  @Post('activities/:id/slots')
  createSlot(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateSlotInput,
  ) {
    return this.activities.createSlot(id, body);
  }

  @Get('activities/:id/slots')
  listSlots(@Param('id', ParseIntPipe) id: number) {
    return this.activities.listSlots(id);
  }

  @Delete('slots/:id')
  removeSlot(@Param('id', ParseIntPipe) id: number) {
    return this.activities.removeSlot(id);
  }
}