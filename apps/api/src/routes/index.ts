import express from "express";
import user from "./user"

const router =express.Router();
export default router;

router.use("/",user);