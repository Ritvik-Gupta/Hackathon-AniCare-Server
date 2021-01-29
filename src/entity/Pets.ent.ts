import { IsUrl, Length } from "class-validator";
import { Field, ID, InputType, ObjectType } from "type-graphql";
import { PetType } from "../service/customEnums";

@ObjectType()
export class Pets {
	@Field(() => ID)
	petId: string;

	@Field(() => PetType)
	type: PetType;

	@Field(() => String)
	name: string;

	@Field(() => String)
	photoUrl: string;
}

@InputType()
export class PetsInput implements Partial<Pets> {
	@Field(() => PetType)
	type: PetType;

	@Length(3, 30)
	@Field(() => String)
	name: string;

	@IsUrl()
	@Field(() => String)
	photoUrl: string;
}
