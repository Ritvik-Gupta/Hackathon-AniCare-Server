import { registerEnumType } from "type-graphql";

export enum PetType {
	DOG = "DOG",
	CAT = "CAT",
	COW = "COW",
	PARROT = "PARROT",
}
registerEnumType(PetType, { name: "PetType" });

export enum Gender {
	MALE = "M",
	FEMALE = "F",
}
registerEnumType(Gender, { name: "Gender" });

export enum TimePeriod {
	MONTH_1 = "1 month",
	MONTH_2 = "2 months",
	MONTH_6 = "6 months",
	YEAR_1 = "1 year",
}
registerEnumType(TimePeriod, { name: "TimePeriod" });
