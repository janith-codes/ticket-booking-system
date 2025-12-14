import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEntity } from '../entities/event.entity';
import { DataSource, Repository } from 'typeorm';
import { SeatEntity } from '../entities/seat.entity';
import { SeatStatus } from '../enums/seat-status.enum';
import { BookingEntity } from '../entities/booking.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventEntity)
    private eventRepository: Repository<EventEntity>,

    @InjectRepository(SeatEntity)
    private seatRepository: Repository<SeatEntity>,

    @InjectRepository(BookingEntity)
    private bookingRepo: Repository<BookingEntity>,

    private dataSource: DataSource,
  ) {}

  async createEvent(name: string, totalSeats: number) {
    const event = this.eventRepository.create({
      name,
      date: new Date(),
      description: 'New Event',
    });
    const savedEvent = await this.eventRepository.save(event);

    const seats: SeatEntity[] = [];
    for (let i = 0; i <= totalSeats; i++) {
      seats.push(
        this.seatRepository.create({
          number: i,
          status: SeatStatus.AVAILABLE,
          event: savedEvent,
        }),
      );
    }

    await this.seatRepository.save(seats);
    return {
      ...savedEvent,
      message: `Event created with ${totalSeats} seats!`,
    };
  }

  async findAll() {
    return this.eventRepository.find({
      relations: ['seats'],
    });
  }

  async bookSeat(seatId: string, userId: string) {
    return await this.dataSource.transaction(async (manager) => {
      const seat = await manager.findOne(SeatEntity, {
        where: { id: seatId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!seat) {
        throw new BadRequestException('Seat not found');
      }

      if (seat.status !== SeatStatus.AVAILABLE) {
        throw new BadRequestException('Seat is already booked!');
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));

      seat.status = SeatStatus.RESERVED;
      await manager.save(seat);

      const booking = manager.create(BookingEntity, {
        seat: seat,
        userId: userId,
      });
      await manager.save(booking);

      return { message: 'Seat booked successfully', bookingId: booking.id };
    });
  }
}
