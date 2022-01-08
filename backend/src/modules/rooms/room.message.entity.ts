import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import RoomEntity from "./room.entity";

@Entity()
export default class RoomMessageEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column("int")
	senderId: number;

	@Column("text")
	content: string;

	@CreateDateColumn()
	createdAt: Date;

	@ManyToOne(() => RoomEntity, (entity) => entity.messages)
	room: RoomEntity;
}
