import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class DirectMessageEntity extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column("int")
    from: number;

    @Column("int")
    to: number;

    @Column("varchar")
    content: string;

    @CreateDateColumn()
    createdAt: Date;
}