import { IsPositive, IsUrl, IsUUID, Length } from "class-validator";
import { ArgsType, Field, ID, InputType, Int, ObjectType } from "type-graphql";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Gender, PetType } from "../service/customEnums";
import { Donation } from "./Donation.ent";
import { NgoInfo } from "./NgoInfo.ent";

@ObjectType()
export class PetHollow {
	@Field(() => ID)
	@PrimaryGeneratedColumn("uuid")
	petId: string;

	@Field(() => ID)
	@Column({ type: "uuid" })
	associatedNgoId: string;

	@Field(() => PetType)
	@Column({ type: "enum", enum: PetType })
	type: PetType;

	@Field(() => String)
	@Column({ type: "varchar" })
	breed: string;

	@Field(() => String)
	@Column({ type: "varchar", length: 30 })
	name: string;

	@Field(() => Int)
	@Column({ type: "integer" })
	age: number;

	@Field(() => Gender)
	@Column({ type: "enum", enum: Gender })
	gender: Gender;

	@Field(() => String)
	@Column({ type: "varchar" })
	photoUrl: string;
}

@ObjectType()
@Entity()
export class Pet extends PetHollow {
	@Field(() => NgoInfo)
	@ManyToOne(() => NgoInfo, ({ shelteredPets }) => shelteredPets)
	@JoinColumn({ name: "associatedNgoId", referencedColumnName: "ngoId" })
	associatedNgo: NgoInfo;

	@Field(() => [Donation])
	@OneToMany(() => Donation, ({ donatedToPet }) => donatedToPet, { cascade: true })
	donationsReceived: Donation[];
}

@ArgsType()
export class PetArgs implements Partial<PetHollow> {
	@IsUUID()
	@Field(() => ID)
	petId: string;
}

@InputType()
export class PetInput implements Partial<PetHollow> {
	@IsUUID()
	@Field(() => String)
	associatedNgoId: string;

	@Field(() => PetType)
	type: PetType;

	@Length(3, 30)
	@Field(() => String)
	breed: string;

	@Length(3, 30)
	@Field(() => String)
	name: string;

	@IsPositive()
	@Field(() => Int)
	age: number;

	@Field(() => Gender)
	gender: Gender;

	@IsUrl()
	@Field(() => String)
	photoUrl: string;
}
