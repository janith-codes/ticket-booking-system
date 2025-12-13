import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Body('name') name: string, @Body('seats') seats: number) {
    return this.eventsService.createEvent(name, seats);
  }

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Post(':id/book')
  bookSeat(
    @Param('id') seatId: string, // URL eken seatId eka gannawa
    @Body('userId') userId: string, // Body eken userId eka gannawa
  ) {
    return this.eventsService.bookSeat(seatId, userId);
  }
}
