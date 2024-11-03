import express from "express";
import user from "./user"
import space from "./space"

const router =express.Router();
export default router;

router.use("/",user);
router.use("/space",space)