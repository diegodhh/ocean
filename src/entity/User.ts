import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid") id!: string;

  @Column({
    length: 100,
    nullable: true,
  })
  firstName?: string;

  @Column({
    length: 100,

    nullable: true,
  })
  lastName?: string;

  @Column({ length: 100, nullable: true })
  googleId?: string;

  @Column({ length: 100, nullable: true })
  phone?: string;

  @Column({
    length: 120,
    unique: true,
  })
  email!: string;
}
