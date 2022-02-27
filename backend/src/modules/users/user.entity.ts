import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn
} from "typeorm";
import { JoinedRoomEntity } from "./joinedrooms.entity";

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

	@OneToMany(() => JoinedRoomEntity, (jr) => jr.user)
	joinedRooms: JoinedRoomEntity[];
}
