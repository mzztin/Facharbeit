import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	JoinTable,
	ManyToMany,
	PrimaryGeneratedColumn
} from "typeorm";
import RoomMessageEntity from "./room.message.entity";

@Entity()
export default class RoomEntity extends BaseEntity {
	@PrimaryGeneratedColumn("increment")
	id: number;

	@Column("varchar")
	name: string;

	@Column("int")
	ownerId: number;

	@CreateDateColumn()
	createdAt: Date;

	@Column("varchar")
	code: string;

	@ManyToMany(() => RoomMessageEntity, msg => msg.room, {
		eager: true
	})
	@JoinTable()
	messages: RoomMessageEntity[];

	async genCodeAndSave() {
		let code = Math.floor(Math.random() * 999999) + 100000;

		while ((await RoomEntity.find({ where: { code: code.toString() } })).length !== 0) {
			code = Math.floor(Math.random() * 999999) + 100000;
		}

		this.code = code.toString();
		return await this.save();
	}
}
