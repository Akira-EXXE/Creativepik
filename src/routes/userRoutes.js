import express from "express";
import { register, login } from "../controllers/userController.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/register", upload.single("foto"), register);
router.post("/login", login);

export default router;
