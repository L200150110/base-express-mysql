import express from "express";
import { getUsers, addUser, loginUser } from "./../controllers/Users.js";

const router = express.Router();

router.get("/users", getUsers);
router.post("/users", addUser);
router.post("/login", loginUser);
// router.get("/users", getUsers);

export default router;
