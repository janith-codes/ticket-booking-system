import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from '../entities/event.entity';
import { SeatEntity } from '../entities/seat.entity';
import { BookingEntity } from '../entities/booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventEntity, SeatEntity, BookingEntity])],
  providers: [EventsService],
  controllers: [EventsController],
})
export class EventsModule {}
