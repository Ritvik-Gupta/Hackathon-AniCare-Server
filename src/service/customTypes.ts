import { ValidationError } from "class-validator";
import { Request, Response } from "express";
import { Session } from "express-session";

export interface context<T> {
	req: Request & {
		session: Session & { userId: T };
	};
	res: Response;
}
export type customCtx = context<string | undefined>;
export type perfectCtx = context<string>;

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
