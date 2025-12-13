import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEntity } from '../entities/event.entity';
import { Repository } from 'typeorm';
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
      relations: ['seats'], // අර අපි කතා වුනු 'seats' මැජික් එක මෙතන වැඩ කරනවා
    });
  }

  // 👇 The UNSAFE Booking Method
  async bookSeat(seatId: string, userId: string) {
    // 1. Seat එක Database එකෙන් ගන්නවා (READ)
    const seat = await this.seatRepository.findOne({ where: { id: seatId } });

    if (!seat) {
      throw new BadRequestException('Seat not found');
    }

    // 2. Seat එක Available ද කියලා බලනවා (CHECK)
    if (seat.status !== SeatStatus.AVAILABLE) {
      throw new BadRequestException('Seat is already booked!');
    }

    // ☠️ DANGER ZONE: RACE CONDITION HAPPENS HERE ☠️
    // හිතන්න මෙතන පොඩි delay එකක් තියෙනවා කියලා.
    // User A සහ User B දෙන්නම උඩ පියවරේදී දැක්කා Seat එක Available කියලා.
    // ඒ නිසා දෙන්නම මේ පේළියට එනවා.

    // 3. Seat එකේ status එක වෙනස් කරනවා (UPDATE)
    seat.status = SeatStatus.RESERVED;
    await this.seatRepository.save(seat);

    // 4. Booking record එකක් දානවා
    const booking = this.bookingRepo.create({
      seat: seat,
      userId: userId,
    });
    await this.bookingRepo.save(booking);

    return { message: 'Seat booked successfully', bookingId: booking.id };
  }
}
