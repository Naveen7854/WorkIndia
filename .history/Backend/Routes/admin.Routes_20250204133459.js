import express from "express";
import { signup , login , logout, checkAuth } from "../Controllers/admin.controller.js";

const router = express.Router();

router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);
router.get("/checkAuth",checkAuth);
router.get("/checkAuth",checkAuth);
export default router;
