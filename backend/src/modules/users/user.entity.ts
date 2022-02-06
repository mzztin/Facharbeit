import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity, PrimaryGeneratedColumn
} from "typeorm";

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
}
