import express from "express";
import { signup , login , logout, checkAuth } from "../Controllers/admin.controller.js";
// import { verifyAdminApiKey } from "../Middlewares/protectRoute.middleware.js";
const router = express.Router();

router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);
router.get("/checkAuth",chec);
export default router;
