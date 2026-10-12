import { Body, Controller, Post } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import type { ReserveInput } from './bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookings: BookingsService) {}

  @Post()
  create(@Body() body: ReserveInput) {
    return this.bookings.reserve(body);
  }
}