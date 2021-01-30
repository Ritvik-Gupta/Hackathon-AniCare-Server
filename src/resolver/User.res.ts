import { Arg, Args, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { User, UserArgs, UserHollow, UserInput } from "../entity";
import { UserRepository } from "../repository";
import { FieldPath, normalizedFieldPaths } from "../service";

@Service()
@Resolver()
export class UserResolver {
	constructor(@InjectRepository() private readonly userRepo: UserRepository) {}

	@Query(() => [User])
	allUsers(@FieldPath() fieldPath: normalizedFieldPaths): Promise<User[]> {
		return this.userRepo.getPopulatedQuery(fieldPath).getMany();
	}

	@Query(() => User, { nullable: true })
	user(
		@FieldPath() fieldPath: normalizedFieldPaths,
		@Args(() => UserArgs) { userId }: UserArgs
	): Promise<User | undefined> {
		return this.userRepo
			.getPopulatedQuery(fieldPath)
			.where(`${fieldPath.parent}.userId = :userId`, { userId })
			.getOne();
	}

	@Mutation(() => UserHollow)
	addUser(@Arg("user", () => UserInput) userInp: UserInput): Promise<UserHollow> {
		return this.userRepo.create(userInp);
	}
}
