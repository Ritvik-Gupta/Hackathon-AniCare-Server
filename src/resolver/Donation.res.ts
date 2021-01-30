import { Arg, Args, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Donation, DonationArgs, DonationHollow, DonationInput } from "../entity";
import { DonationRepository } from "../repository";
import { FieldPath, normalizedFieldPaths } from "../service";

@Service()
@Resolver()
export class DonationResolver {
	constructor(@InjectRepository() private readonly donationRepo: DonationRepository) {}

	@Query(() => [Donation])
	allDonations(@FieldPath() fieldPath: normalizedFieldPaths): Promise<Donation[]> {
		return this.donationRepo.getPopulatedQuery(fieldPath).getMany();
	}

	@Query(() => Donation, { nullable: true })
	donation(
		@FieldPath() fieldPath: normalizedFieldPaths,
		@Args(() => DonationArgs) { petId, userId }: DonationArgs
	): Promise<Donation | undefined> {
		return this.donationRepo
			.getPopulatedQuery(fieldPath)
			.where(`${fieldPath.parent}.petId = :petId`, { petId })
			.andWhere(`${fieldPath.parent}.userId = :userId`, { userId })
			.getOne();
	}

	@Mutation(() => DonationHollow)
	async addDonation(
		@Arg("donation", () => DonationInput) { userId, petId, duration }: DonationInput
	): Promise<DonationHollow> {
		await this.donationRepo.ifNotDefined({ userId, petId });
		return this.donationRepo.create({ userId, petId, duration });
	}
}
