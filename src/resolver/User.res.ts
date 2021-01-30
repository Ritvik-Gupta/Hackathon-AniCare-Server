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
		@Args(() => UserArgs) { userId, email }: UserArgs
	): Promise<User | undefined> {
		const query = this.userRepo.getPopulatedQuery(fieldPath);
		if (userId !== undefined) {
			return query.where(`${fieldPath.parent}.userId = :userId`, { userId }).getOne();
		} else if (email !== undefined) {
			return query.where(`${fieldPath.parent}.email = :email`, { email }).getOne();
		} else throw Error("Atleast one Field is required");
	}

	@Mutation(() => UserHollow)
	async addUser(@Arg("user", () => UserInput) userInp: UserInput): Promise<UserHollow> {
		await this.userRepo.ifNotDefined({ email: userInp.email });
		return this.userRepo.create(userInp);
	}
}
