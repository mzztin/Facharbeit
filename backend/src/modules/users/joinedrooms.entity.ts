import {
	BaseEntity,
	Column,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from "typeorm";
import UserEntity from "./user.entity";

@Entity()
export class JoinedRoomEntity extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => UserEntity, (user) => user.joinedRooms)
	user: UserEntity;

	@UpdateDateColumn()
	time: Date;

	@Column("varchar")
	roomCode: string;
}
