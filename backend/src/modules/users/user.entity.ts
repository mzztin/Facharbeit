import {
	BaseEntity,
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	OneToMany
} from "typeorm";
import MessageEntity from "../messages/message.entity";

@Entity()
export default class UserEntity extends BaseEntity {
	@PrimaryGeneratedColumn("increment")
	id: number;

	@Column("varchar", { length: 16 })
	username: string;

	@Column("text")
	password: string;

	@CreateDateColumn()
	createdAt: Date;

	@OneToMany(() => MessageEntity, (msg) => msg.from)
	sentMessages: MessageEntity[];

	@OneToMany(() => MessageEntity, (msg) => msg.to)
	recievedMessages: MessageEntity[];
}
