import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import RoomMessageEntity from './room.message.entity';

@Entity()
export default class RoomEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column("int")
  ownerId: number;
    
  @ManyToOne(() => RoomMessageEntity, msg => msg.room)
  messages: RoomMessageEntity[];
}