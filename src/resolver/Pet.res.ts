import { Arg, Args, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Pet, PetArgs, PetHollow, PetInput } from "../entity";
import { NgoInfoRepository, PetRepository } from "../repository";
import { FieldPath, normalizedFieldPaths, PetType } from "../service";

@Service()
@Resolver()
export class PetResolver {
	constructor(
		@InjectRepository() private readonly petsRepo: PetRepository,
		@InjectRepository() private readonly ngoInfoRepo: NgoInfoRepository
	) {}

	@Query(() => [Pet])
	allPets(@FieldPath() fieldPath: normalizedFieldPaths): Promise<Pet[]> {
		return this.petsRepo.getPopulatedQuery(fieldPath).getMany();
	}

	@Query(() => [Pet])
	filterPets(
		@FieldPath() fieldPath: normalizedFieldPaths,
		@Arg("petType", () => PetType) petType: PetType
	): Promise<Pet[]> {
		return this.petsRepo
			.getPopulatedQuery(fieldPath)
			.where(`${fieldPath.parent}.type = :petType`, { petType })
			.getMany();
	}

	@Query(() => Pet, { nullable: true })
	pet(
		@FieldPath() fieldPath: normalizedFieldPaths,
		@Args(() => PetArgs) { petId }: PetArgs
	): Promise<Pet | undefined> {
		return this.petsRepo
			.getPopulatedQuery(fieldPath)
			.where(`${fieldPath.parent}.petId = :petId`, { petId })
			.getOne();
	}

	@Mutation(() => PetHollow)
	async addPet(
		@Arg("pet", () => PetInput) { associatedNgoId, ...petInp }: PetInput
	): Promise<PetHollow> {
		await this.ngoInfoRepo.ifDefined({ ngoId: associatedNgoId });
		return this.petsRepo.create({ ...petInp, associatedNgoId });
	}
}
