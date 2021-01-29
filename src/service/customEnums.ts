import { registerEnumType } from "type-graphql";

export enum PetType {
	DOG = "DOG",
	CAT = "CAT",
	COW = "COW",
	PARROT = "PARROT",
}
registerEnumType(PetType, { name: "PetType" });
