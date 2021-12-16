import { BaseEntity, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class RoomEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
}
