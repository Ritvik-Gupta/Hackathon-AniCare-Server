import { ValidationError } from "class-validator";
import { Request, Response } from "express";

export interface context {
	req: Request;
	res: Response;
}

export type customGQLExtension = {
	exception: { validationErrors?: ValidationError[] };
};

export type customValidErr = Partial<ValidationError> & {
	property: string;
	constraints: any;
};

export type customGQLError = {
	message: string;
	exception: {
		validationErrors?: customValidErr[];
	};
};
