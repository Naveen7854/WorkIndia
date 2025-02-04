import express from "express";
import { signup , login , logout } from "../Controllers/admin.controller.js";

const router = express.Router();

router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);
router.get("verifyAdmin")
export default router;
