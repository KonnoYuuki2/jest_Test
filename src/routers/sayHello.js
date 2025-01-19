import express from "express";
import dotenv from "dotenv";
import { authorization } from "../../middle_wares/authorization.js";

dotenv.config();

const router = express();

router.get('/hello', authorization, (req,res) => {
   return res.status(200).send({ result: "hello"});
})

export default router;