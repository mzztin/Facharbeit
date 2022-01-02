import {
	BaseEntity,
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	ManyToOne
} from "typeorm";
import UserEntity from "../users/user.entity";

@Entity()
export default class MessageEntity extends BaseEntity {
	@PrimaryGeneratedColumn("increment")
	id: number;

	@ManyToOne(() => UserEntity, (user) => user.sentMessages)
	from: UserEntity;

	@ManyToOne(() => UserEntity, (user) => user.recievedMessages)
	to: UserEntity;

	@Column("text")
	content: string;

	@CreateDateColumn()
	createdAt: Date;
}
