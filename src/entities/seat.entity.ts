import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  VersionColumn,
} from 'typeorm';
import { SeatStatus } from '../enums/seat-status.enum';
import { EventEntity } from './event.entity';

@Entity()
export class SeatEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  number: number;

  @Column({
    type: 'enum',
    enum: SeatStatus,
    default: SeatStatus.AVAILABLE,
  })
  status: SeatStatus;

  @VersionColumn()
  version: number;

  @ManyToOne(() => EventEntity, (event) => event.seats)
  event: EventEntity;
}
