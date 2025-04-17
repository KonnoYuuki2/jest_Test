import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

// signIn, login 
dotenv.config();

// ! 서버 유저 저장
// prisma, db
let users = [];

const router = express.Router();

/**
 * @swagger
 * tags:
 *    name: Accounts
 *    description: 회원가입, 로그인
 */


/**
 * @swagger
 * /app/signup:
 *   post:
 *     summary: "회원가입"
 *     description: "회원가입을 한다."
 *     tags: [Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - nickname
 *             properties:
 *               username:
 *                 type: string
 *                 description: "유저 아이디"
 *                 example: "JIN HO"
 *               password:
 *                 type: string
 *                 description: "비밀번호"
 *                 example: "mysecurepassword123"
 *               nickname:
 *                 type: string
 *                 description: "닉네임"
 *                 example: "Mentos"
 *     responses:
 *       "201":
 *         description: "회원가입 성공"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                   description: "유저 아이디"
 *                   example: "JIN HO"
 *                 nickname:
 *                   type: string
 *                   description: "닉네임"
 *                   example: "Mentos"
 */

router.post('/signup', async (req,res) => {
   const {username, password, nickname} = req.body;
   console.log("req.body:", req.body);

   if(users.find((user) => user.username === username)) {
      return res.status(400).send({
         error: {
            code: "USER_ALREADY_EXISTS",
            message: "이미 가입된 사용자입니다."
         }
      });
   }

   const encryptedPassword = await bcrypt.hash(password, 12);

   //console.log(`암호화된 비밀 번호: `, encryptedPassword);

   users.push({
      username, 
      password: encryptedPassword,
      nickname
   });

   const result = {
      username: username,
      nickname: nickname,
   }

   return res.status(201).send(result);
})


/**
 * @swagger
 * /app/login:
 *   post:
 *     summary: "로그인"
 *     description: "로그인을 한다."
 *     tags: [Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: "유저 아이디"
 *                 example: "JIN HO"
 *               password:
 *                 type: string
 *                 description: "비밀번호"
 *                 example: "mysecurepassword123"
 *     responses:
 *       "201":
 *         description: "로그인 성공"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: "token"
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 */

router.post('/login', async (req,res) => {
   const {username, password} = req.body;

   const user = await users.find((user) => user.username === username);

   if(!user) {
      return res.status(400).send({error: {
         code: "INVALID_CREDENTIALS",
         message: "아이디 또는 비밀번호가 올바르지 않습니다."
      }});
   }
   
   const decryptedPassword = await bcrypt.compare(password,user.password); // 암호화된 거 필요

   if(!decryptedPassword) {
      return res.status(400).send({error: {
         code: "INVALID_CREDENTIALS",
         message: "아이디 또는 비밀번호가 올바르지 않습니다."
      }});
   }

   const accessToken = jwt.sign({username:username}, process.env.accessTokenKey, {expiresIn: '1h'});

   return res.status(200).send({token: accessToken});
})

export default router;


