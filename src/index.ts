import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import firebase from "firebase-admin";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { customFormatError, DB } from "./service";

// db.collection("posts")
// 	.add({
// 		title: "Title 2",
// 		content: "Content 2",
// 	})
// 	.then(() => console.log("DONE"));

(async () => {
	dotenv.config();

	const firebaseApp = firebase.initializeApp({
		credential: firebase.credential.cert(
			(await import("../serviceAccount.json")) as firebase.ServiceAccount
		),
		databaseURL: process.env.DATABASE_URL,
	});
	DB.instance = firebaseApp.firestore();

	const schema = await buildSchema({
		resolvers: [`${__dirname}/resolver/index.${process.env.EXT}`],
		authMode: "error",
		validate: {
			validationError: {
				target: false,
				value: false,
			},
		},
		emitSchemaFile: {
			path: __dirname + "/schema.gql",
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
			origin: process.env.CORS_ORIGIN,
			credentials: true,
		})
	);
	app.use(
		session({
			name: process.env.COOKIE_NAME,
			secret: process.env.SESSION_SECRET as string,
			cookie: {
				maxAge: 1000 * 60 * 60 * 24,
				httpOnly: true,
				sameSite: "lax",
				secure: process.env.NODE_ENV === "production",
			},
			saveUninitialized: false,
			resave: false,
		})
	);

	apolloServer.applyMiddleware({ app, cors: false });
	app.listen(process.env.PORT, () => {
		console.log("\n\nGraphql Server Up and Running on");
		console.log(`http://localhost:${process.env.PORT}/graphql\n\n`);
	});
})();
