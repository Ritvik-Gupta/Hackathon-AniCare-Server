import { IsEmail, IsUrl, IsUUID, Length, MinLength } from "class-validator";
import { ArgsType, Field, ID, InputType, ObjectType } from "type-graphql";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Address } from "../model";
import { Donation } from "./Donation.ent";

@ObjectType()
export class UserHollow extends Address {
	@Field(() => ID)
	@PrimaryGeneratedColumn("uuid")
	userId: string;

	@Field(() => String)
	@Column({ type: "varchar" })
	name: string;

	@Field(() => String)
	@Column({ type: "varchar", unique: true })
	email: string;

	@Field(() => String, { nullable: true })
	@Column({ type: "varchar", length: 10, nullable: true })
	phone: string;

	@Field(() => String)
	@Column({ type: "varchar" })
	photoUrl: string;
}

@ObjectType()
@Entity()
export class User extends UserHollow {
	@Field(() => [Donation])
	@OneToMany(() => Donation, ({ donatedByUser }) => donatedByUser, { cascade: true })
	donationsMade: Donation[];
}

@ArgsType()
export class UserArgs implements Partial<UserHollow> {
	@IsUUID()
	@Field(() => ID, { nullable: true })
	userId?: string;

	@IsEmail()
	@Field(() => String, { nullable: true })
	email?: string;
}

@InputType()
export class UserInput extends Address implements Partial<UserHollow> {
	@MinLength(3)
	@Field(() => String)
	name: string;

	@IsEmail()
	@Field(() => String)
	email: string;

	@Length(10, 10)
	@Field(() => String, { nullable: true })
	phone: string;

	@IsUrl()
	@Field(() => String)
	photoUrl: string;
}
