import express from "express";
import {
  getUsers,
  addUser,
  loginUser,
  logoutUser,
} from "./../controllers/Users.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";

const router = express.Router();

router.get("/users", verifyToken, getUsers);
router.post("/users", addUser);
router.post("/login", loginUser);
router.get("/token", refreshToken);
router.delete("/logout", logoutUser);

export default router;
