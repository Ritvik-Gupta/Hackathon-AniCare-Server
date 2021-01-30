import { AbstractRepository, DeepPartial, FindConditions, SelectQueryBuilder } from "typeorm";
import { normalizedFieldPaths } from "./normalizeInfo";

export interface IRepositoryErrors {
	ifDefined: string;
	ifNotDefined: string;
}

export const customRepository = <T extends object>(repoErrors: IRepositoryErrors) => {
	abstract class CustomRepository extends AbstractRepository<T> {
		async ifDefined(where: FindConditions<T>): Promise<T> {
			const value = await this.repository.findOne({ where });
			if (value === undefined) throw Error(repoErrors.ifNotDefined);
			return value;
		}

		async ifNotDefined(where: FindConditions<T>): Promise<void> {
			const [, check] = await this.repository.findAndCount({ where });
			if (check > 0) throw Error(repoErrors.ifDefined);
		}

		create(entity: DeepPartial<T>): Promise<T> {
			return this.repository.save(this.repository.create(entity));
		}

		getPopulatedQuery(fieldPath: normalizedFieldPaths): SelectQueryBuilder<T> {
			const query = this.repository.createQueryBuilder(fieldPath.parent);
			fieldPath.joins.forEach(([parent, child]) => {
				query.leftJoinAndSelect(`${parent}.${child}`, child);
			});
			return query;
		}
	}
	return CustomRepository;
};
