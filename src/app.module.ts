// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { EventEntity } from './entities/event.entity';
import { SeatEntity } from './entities/seat.entity';
import { BookingEntity } from './entities/booking.entity';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // .env file support (optional for now but good practice)
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5438,
      username: 'admin', // Docker compose eke dapu user
      password: 'password123', // Docker compose eke dapu password
      database: 'ticket_booking',
      entities: [EventEntity, SeatEntity, BookingEntity],
      synchronize: true, // Dev mode eke true thibba kama na (auto tables hadenawa)
    }),
    EventsModule,
  ],
})
export class AppModule {}
