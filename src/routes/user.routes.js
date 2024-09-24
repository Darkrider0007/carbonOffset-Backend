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
  sendMailForgetPassword,
  updatePassword,
  updateUser,
  verifyEmail,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/verifyUser.js";

const router = Router();

router.get("/get-all-users", getAllUsers);
router.post("/create-user", createUser);
router.post("/login", loginUser);
router.get("/refresh-token", refreshToken);
router.get("/get-user", verifyJWT, getUser);
router.get("/:id", getUserById);

router.post("/logout", verifyJWT, logOut);
router.put("/update-user", updateUser);
router.delete("/delete-user", deleteUser);
router.put("/forgot-password", forgotPassword);
router.post("/verify-email", verifyEmail);
router.post("/sendmail-forgetpassword", sendMailForgetPassword);
router.put("/update-password", updatePassword);

export default router;
