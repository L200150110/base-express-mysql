import express from "express";
import { getUsers, addUser } from "./../controllers/Users.js";

const router = express.Router();

router.get("/users", getUsers);
router.post("/users", addUser);
// router.get("/users", getUsers);
// router.get("/users", getUsers);

export default router;