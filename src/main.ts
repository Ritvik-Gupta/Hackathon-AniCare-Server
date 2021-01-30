import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { Container } from "typedi";
import { createConnection, useContainer } from "typeorm";
import { customFormatError } from "./service/customOptions";

(async () => {
	dotenv.config();
	useContainer(Container);
	const DIR = process.env.DIR?.trimEnd();
	const EXT = process.env.EXT?.trimEnd();

	await createConnection({
		type: "postgres",
		url: process.env.DATABASE_URL,
		synchronize: process.env.NODE_ENV !== "production",
		logging: true,
		entities: [`${DIR}/entity/**/*.ent.${EXT}`],
		migrations: [`${DIR}/migration/**/*.${EXT}`],
		subscribers: [`${DIR}/subscriber/**/*.${EXT}`],
		cli: {
			entitiesDir: `${DIR}/entity`,
			migrationsDir: `${DIR}/migration`,
			subscribersDir: `${DIR}/subscriber`,
		},
	});

	const schema = await buildSchema({
		resolvers: [`${__dirname}/resolver/index.${EXT}`],
		container: Container,
		authMode: "error",
		validate: {
			validationError: {
				target: false,
				value: false,
			},
		},
		emitSchemaFile: {
			path: `${__dirname}/schema.gql`,
			commentDescriptions: true,
			sortedSchema: false,
		},
	});

	const apolloServer = new ApolloServer({
		schema,
		context: ({ req, res }) => ({ req, res }),
		formatError: customFormatError,
		playground: {
			settings: { "request.credentials": "include" },
		},
	});

	const app = express();
	app.use(
		cors({
			origin: "*",
			credentials: true,
		})
	);
	// app.use(
	// 	session({
	// 		name: process.env.COOKIE_NAME,
	// 		secret: process.env.SESSION_SECRET as string,
	// 		cookie: {
	// 			maxAge: 1000 * 60 * 60 * 24,
	// 			httpOnly: true,
	// 			sameSite: "lax",
	// 			secure: process.env.NODE_ENV === "production",
	// 		},
	// 		saveUninitialized: false,
	// 		resave: false,
	// 	})
	// );

	apolloServer.applyMiddleware({ app, cors: false });
	app.listen(process.env.PORT, () => {
		console.log("\n\nGraphql Server Up and Running on");
		console.log(`http://localhost:${process.env.PORT}/graphql\n\n`);
	});
})();
