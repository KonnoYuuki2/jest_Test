import express from "express";
import dotenv from "dotenv";
import { authorization } from "../../middle_wares/authorization.js";

dotenv.config();

const router = express();

/**
 * @swagger
 * /app/Auth:
 *   get:
 *     summary: "토큰 확인"
 *     description: "JWT 토큰이 유효한지 확인한다."
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "인증 성공"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "인증 성공!"
 *       401:
 *         description: ""
 */

router.get('/Auth', authorization, (req,res) => {
   if(req.error) {
      return res.status(401).send(req.error);
   }
   return res.status(200).send({ result: "인증 성공!"});
})

export default router;