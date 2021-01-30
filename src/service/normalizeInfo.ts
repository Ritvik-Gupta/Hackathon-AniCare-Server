import { FieldNode, GraphQLResolveInfo } from "graphql";
import { createParamDecorator } from "type-graphql";
import { Repository, SelectQueryBuilder } from "typeorm";

export interface normalizedFieldObject {
	[key: string]: true | normalizedFieldObject;
}

const normalizeField = (node: FieldNode): normalizedFieldObject => ({
	[node.name.value]:
		node.selectionSet === undefined
			? true
			: node.selectionSet.selections.reduce(
					(coll, sel) => ({ ...coll, ...normalizeField(sel as FieldNode) }),
					{}
			  ),
});

const normalizeInfo = ({ fieldNodes }: GraphQLResolveInfo): normalizedFieldObject =>
	fieldNodes.reduce((coll, cur) => ({ ...coll, ...normalizeField(cur) }), {});

export const FieldObject = (): ParameterDecorator =>
	createParamDecorator(({ info }) => normalizeInfo(info));

type path = [string, string];

interface fieldPathsReduced {
	parents: string[];
	joins: path[];
}

const reduceFieldPath = (fieldObject: normalizedFieldObject): fieldPathsReduced =>
	Object.entries(fieldObject).reduce<fieldPathsReduced>(
		(coll, [key, value]) => {
			if (value === true) return coll;
			const { parents, joins } = reduceFieldPath(value);
			return {
				parents: [...coll.parents, key],
				joins: [...coll.joins, ...parents.map<path>(parent => [key, parent]), ...joins],
			};
		},
		{ parents: [], joins: [] }
	);

export interface normalizedFieldPaths {
	parent: string;
	joins: path[];
}

export const getFieldPaths = (fieldObject: normalizedFieldObject): normalizedFieldPaths => {
	const { parents, joins } = reduceFieldPath(fieldObject);
	return { parent: parents[0]!, joins };
};

export const FieldPath = (): ParameterDecorator =>
	createParamDecorator(({ info }) => getFieldPaths(normalizeInfo(info)));

export const getPopulatedQuery = <T>(
	repository: Repository<T>,
	fieldPath: normalizedFieldPaths
): SelectQueryBuilder<T> => {
	const query = repository.createQueryBuilder(fieldPath.parent);
	fieldPath.joins.forEach(([parent, child]) => {
		query.leftJoinAndSelect(`${parent}.${child}`, child);
	});
	return query;
};
