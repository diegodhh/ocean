import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Ship extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    length: 100,
    nullable: true,
  })
  firstName?: string;

  @Column({
    length: 100,

    nullable: true,
  })
  displayName?: string;

  @Column({ length: 100, nullable: true })
  googleId?: string;
}
