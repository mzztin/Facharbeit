import {
	BaseEntity,
	Column,
	Entity,
	PrimaryGeneratedColumn,
	ManyToOne,
	CreateDateColumn
} from "typeorm";
import RoomMessageEntity from "./room.message.entity";

@Entity()
export default class RoomEntity extends BaseEntity {
	@PrimaryGeneratedColumn("increment")
	id: number;

	@Column("int")
	ownerId: number;

	@CreateDateColumn()
	createdAt: Date;

	@Column("varchar")
	code: string;

	@ManyToOne(() => RoomMessageEntity, (msg) => msg.room)
	messages: RoomMessageEntity[];

	async createCode() {
		let code = Math.floor(Math.random() * 999999) + 100000;

		while ((await RoomEntity.find({ where: { code: code.toString() } })).length !== 0) {
			code = Math.floor(Math.random() * 999999) + 100000;
		}

		this.code = code.toString();
		return await this.save();
	}
}
