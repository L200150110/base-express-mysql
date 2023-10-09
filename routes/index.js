import express from "express";
import { getUsers, addUser, loginUser } from "./../controllers/Users.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/users", verifyToken, getUsers);
router.post("/users", addUser);
router.post("/login", loginUser);
// router.get("/users", getUsers);

export default router;
