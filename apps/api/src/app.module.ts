import { AreasModule } from './areas/areas.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health/health.controller';
import { PrismaModule } from './prisma/prisma.module';
import { BookingsModule } from './bookings/bookings.module';
import { ActivitiesModule } from './activities/activities.module';

@Module({
  imports: [PrismaModule, BookingsModule, ActivitiesModule, AuthModule, UsersModule, AreasModule],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}