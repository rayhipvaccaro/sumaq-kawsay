import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { BookingsService } from './bookings.service';
import type { ReserveInput } from './bookings.service';

@Controller('bookings')
@UseGuards(ThrottlerGuard)
export class BookingsController {
  constructor(private readonly bookings: BookingsService) {}

  @Post()
  create(@Body() body: ReserveInput) {
    return this.bookings.reserve(body);
  }
}