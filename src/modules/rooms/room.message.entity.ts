import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	ManyToMany,
	PrimaryGeneratedColumn
} from "typeorm";
import RoomEntity from "./room.entity";

@Entity()
export default class RoomMessageEntity extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column("int")
	senderId: number;

	@Column("text")
	content: string;

	@ManyToMany(() => RoomEntity, (room) => room.messages)
	room: RoomEntity;

	@CreateDateColumn()
	createdAt: Date;
}
