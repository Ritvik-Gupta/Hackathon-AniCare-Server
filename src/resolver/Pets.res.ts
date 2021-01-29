import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Pets, PetsInput } from "../entity";
import { DB, PetType } from "../service";

@Resolver()
export class AdminResolver {
	@Query(() => [Pets])
	async allPets(): Promise<Pets[]> {
		const { docs } = await DB.instance.collection("pets").get();
		return docs.map(doc => ({ petId: doc.id, ...doc.data() })) as Pets[];
	}

	@Query(() => Pets)
	async pet(@Arg("petId", () => String) petId: string): Promise<Pets> {
		const doc = await DB.instance.collection("pets").doc(petId).get();
		if (!doc.exists) throw ReferenceError("Pet with ID not found");
		return { petId: doc.id, ...doc.data() } as Pets;
	}

	@Query(() => [Pets])
	async filterPets(@Arg("petType", () => PetType) petType: PetType): Promise<Pets[]> {
		const { docs } = await DB.instance.collection("pets").where("type", "==", petType).get();
		return docs.map(doc => ({ petId: doc.id, ...doc.data() })) as Pets[];
	}

	@Mutation(() => Pets)
	async addPet(@Arg("pet", () => PetsInput) petInp: PetsInput): Promise<Pets> {
		const docRef = await DB.instance.collection("pets").add({ ...petInp });
		const doc = await docRef.get();
		return { petId: doc.id, ...doc.data() } as Pets;
	}
}
