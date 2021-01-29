import { GraphQLError } from "graphql";
import { customGQLError, customGQLExtension } from "./customTypes";

export const customFormatError = (error: GraphQLError): customGQLError => ({
	message: error.message,
	exception: {
		validationErrors: (error.extensions as customGQLExtension).exception.validationErrors?.map(
			({ property, constraints }) => ({ property, constraints })
		),
	},
});
