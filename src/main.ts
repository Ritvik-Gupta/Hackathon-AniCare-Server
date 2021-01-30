import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { Container } from "typedi";
import { createConnection, useContainer } from "typeorm";
import { customFormatError } from "./service/customOptions";

dotenv.config();
const isProd = () => process.env.NODE_ENV === "production";
const DIR = isProd() ? "dist" : "src";
const EXT = isProd() ? "js" : "ts";

console.log("Current DIR :\t", DIR);
console.log("Current EXT :\t", EXT);
console.log("Current NODE_ENV :\t", isProd());
console.log("Current DATABASE_URL :\t", process.env.DATABASE_URL);
console.log("Current PORT :\t", process.env.PORT);

(async () => {
	useContainer(Container);
	await createConnection({
		type: "postgres",
		url: process.env.DATABASE_URL,
		synchronize: !isProd(),
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

	app.get("/try", (_, res) => {
		res.json({ try: "This is to try something" });
	});

	apolloServer.applyMiddleware({ app, cors: false });
	app.listen(process.env.PORT, () => {
		console.log("\n\nGraphql Server Up and Running on");
		console.log(`http://localhost:${process.env.PORT}/graphql\n\n`);
	});
})();
