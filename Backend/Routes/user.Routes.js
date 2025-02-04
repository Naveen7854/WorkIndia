import express from "express";
import { signup , login , logout,checkAuth } from "../Controllers/users.controller.js";
import { verifyToken } from "../Middlewares/protectRoute.middleware.js";
const router = express.Router();

router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);
router.get("/checkAuth", verifyToken, checkAuth);
export default router;
