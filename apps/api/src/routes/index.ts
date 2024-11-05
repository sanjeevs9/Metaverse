import express from "express";
import user from "./user"
import space from "./space"
import admin from "./admin"

const router =express.Router();
export default router;

router.use("/",user);
router.use("/space",space)
router.use("/admin",admin)