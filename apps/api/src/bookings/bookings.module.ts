import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      useFactory: () => {
        const n = Number(process.env.BOOKINGS_RATE_LIMIT);
        const limit = Number.isInteger(n) && n > 0 ? n : 20;
        return { throttlers: [{ ttl: 60_000, limit }] };
      },
    }),
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}