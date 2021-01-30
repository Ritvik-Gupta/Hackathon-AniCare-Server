import { Args, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { NgoInfo, NgoInfoArgs } from "../entity";
import { NgoInfoRepository } from "../repository";
import { FieldPath, normalizedFieldPaths } from "../service";

@Service()
@Resolver()
export class NgoInfoResolver {
	constructor(@InjectRepository() private readonly ngoInfoRepo: NgoInfoRepository) {}

	@Query(() => [NgoInfo])
	allNGOs(@FieldPath() fieldPath: normalizedFieldPaths): Promise<NgoInfo[]> {
		return this.ngoInfoRepo.getPopulatedQuery(fieldPath).getMany();
	}

	@Query(() => NgoInfo, { nullable: true })
	NGO(
		@FieldPath() fieldPath: normalizedFieldPaths,
		@Args(() => NgoInfoArgs) { ngoId }: NgoInfoArgs
	): Promise<NgoInfo | undefined> {
		return this.ngoInfoRepo
			.getPopulatedQuery(fieldPath)
			.where(`${fieldPath.parent}.ngoId = :ngoId`, { ngoId })
			.getOne();
	}
}
