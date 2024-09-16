import { Router } from "express";
import {
  createUser,
  deleteUser,
  forgotPassword,
  getAllUsers,
  getUser,
  getUserById,
  loginUser,
  logOut,
  refreshToken,
  updateUser,
  verifyEmail,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/verifyUser.js";

const router = Router();

router.post("/create-user", createUser);
router.post("/login", loginUser);
router.get("/refresh-token", refreshToken);
router.get("/get-user", verifyJWT, getUser);
router.get("/:id", getUserById);
router.get("/get-all-users", getAllUsers);
router.post("/logout", logOut);
router.put("/update-user", updateUser);
router.delete("/delete-user", deleteUser);
router.put("/forgot-password", forgotPassword);
router.post("/verify-email", verifyEmail);

export default router;
