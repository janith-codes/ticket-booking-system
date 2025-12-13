import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { SeatEntity } from './seat.entity';

@Entity()
export class EventEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  date: Date;

  @OneToMany(() => SeatEntity, (seatEntity: SeatEntity) => seatEntity.event)
  seats: SeatEntity[];
}
