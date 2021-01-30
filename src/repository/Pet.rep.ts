import { Service } from "typedi";
import { EntityRepository } from "typeorm";
import { Pet } from "../entity";
import { customRepository } from "../service";

@Service()
@EntityRepository(Pet)
export class PetRepository extends customRepository<Pet>({
	ifDefined: "Pet already exists",
	ifNotDefined: "No such Pets exists",
}) {}
