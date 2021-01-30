import { IsUUID } from "class-validator";
import { ArgsType, Field, ID, InputType, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { TimePeriod } from "../service";
import { Pet } from "./Pet.ent";
import { User } from "./User.ent";

@ObjectType()
export class DonationHollow {
	@Field(() => ID)
	@PrimaryColumn({ type: "uuid" })
	petId: string;

	@Field(() => ID)
	@PrimaryColumn({ type: "uuid" })
	userId: string;

	@Field(() => Date)
	@CreateDateColumn()
	donationDate: Date;

	@Field(() => TimePeriod)
	@Column({ type: "enum", enum: TimePeriod })
	duration: TimePeriod;
}

@ObjectType()
@Entity()
export class Donation extends DonationHollow {
	@Field(() => Pet)
	@ManyToOne(() => Pet, ({ donationsReceived }) => donationsReceived)
	@JoinColumn({ name: "petId", referencedColumnName: "petId" })
	donatedToPet: Pet;

	@Field(() => User)
	@ManyToOne(() => User, ({ donationsMade }) => donationsMade)
	@JoinColumn({ name: "userId", referencedColumnName: "userId" })
	donatedByUser: User;
}

@ArgsType()
export class DonationArgs implements Partial<DonationHollow> {
	@IsUUID()
	@Field(() => String)
	petId: string;

	@IsUUID()
	@Field(() => String)
	userId: string;
}

@InputType()
export class DonationInput implements Partial<DonationHollow> {
	@IsUUID()
	@Field(() => String)
	petId: string;

	@IsUUID()
	@Field(() => String)
	userId: string;

	@Field(() => TimePeriod)
	duration: TimePeriod;
}
