import express from "express";
import { getRepository } from "typeorm";
import { User } from "../entity";

export const userRouter = express.Router();
const userRepo = getRepository(User);

userRouter.get("/all", async (_, res) => {
	const users = await userRepo.find();
	res.json({ data: users });
});

userRouter.post("/add", async (req, res) => {
	const { city, country, email, name, phone, photoUrl } = req.body;
	if (city === undefined) return res.status(400).json({ error: "City must be defined" });
	if (country === undefined) return res.status(400).json({ error: "Country must be defined" });
	if (email === undefined) return res.status(400).json({ error: "Email must be defined" });
	if (name === undefined) return res.status(400).json({ error: "Name must be defined" });
	if (photoUrl === undefined) return res.status(400).json({ error: "Photo Url must be defined" });

	const user = await userRepo.save(
		userRepo.create({ city, country, email, name, phone, photoUrl })
	);
	res.json({ data: user });
});
