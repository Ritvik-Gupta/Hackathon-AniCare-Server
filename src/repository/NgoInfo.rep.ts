import { Service } from "typedi";
import { EntityRepository } from "typeorm";
import { NgoInfo } from "../entity";
import { customRepository } from "../service";

@Service()
@EntityRepository(NgoInfo)
export class NgoInfoRepository extends customRepository<NgoInfo>({
	ifDefined: "NGO Information already exists",
	ifNotDefined: "No such NGO Information exists",
}) {}
