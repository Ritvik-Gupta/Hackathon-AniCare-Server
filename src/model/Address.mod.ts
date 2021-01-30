import { Length } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";
import { Column } from "typeorm";

@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
export abstract class Address {
	@Field(() => String)
	@Column({ type: "varchar", length: 50 })
	@Length(5, 50)
	country: string;

	@Field(() => String)
	@Column({ type: "varchar", length: 30 })
	@Length(5, 50)
	city: string;
}
