import { Service } from "typedi";
import { EntityRepository } from "typeorm";
import { Donation } from "../entity";
import { customRepository } from "../service";

@Service()
@EntityRepository(Donation)
export class DonationRepository extends customRepository<Donation>({
	ifDefined: "Donation Information already exists",
	ifNotDefined: "No such Donation Information exists",
}) {}
