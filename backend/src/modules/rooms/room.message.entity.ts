import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
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

	@ManyToMany(() => RoomEntity, (entity) => entity.messages, {
		cascade: true
	})
	room: RoomEntity;
}
