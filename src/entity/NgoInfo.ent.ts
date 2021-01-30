import { IsEmail, IsUUID, Length, MinLength } from "class-validator";
import { ArgsType, Field, ID, InputType, ObjectType } from "type-graphql";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Address } from "../model";
import { Pet } from "./Pet.ent";

@ObjectType()
export class NgoInfoHollow extends Address {
	@Field(() => ID)
	@PrimaryGeneratedColumn("uuid")
	ngoId: string;

	@Field(() => String)
	@Column({ type: "varchar" })
	name: string;

	@Field(() => String)
	@Column({ type: "varchar", unique: true })
	email: string;

	@Field(() => String, { nullable: true })
	@Column({ type: "varchar", length: 10, nullable: true })
	phone: string;
}

@ObjectType()
@Entity()
export class NgoInfo extends NgoInfoHollow {
	@Field(() => [Pet])
	@OneToMany(() => Pet, ({ associatedNgo }) => associatedNgo, { cascade: true })
	shelteredPets: Pet[];
}

@ArgsType()
export class NgoInfoArgs implements Partial<NgoInfoHollow> {
	@IsUUID()
	@Field(() => ID)
	ngoId: string;
}

@InputType()
export class NgoInfoInput extends Address implements Partial<NgoInfoHollow> {
	@MinLength(3)
	@Field(() => String)
	name: string;

	@IsEmail()
	@Field(() => String)
	email: string;

	@Length(10, 10)
	@Field(() => String, { nullable: true })
	phone: string;
}
