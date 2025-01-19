import express from "express";
import jwt from "jsonwebtoken";
import bcyrpt from "bcrypt";
import dotenv from "dotenv";

// signIn, login 
dotenv.config();

// ! 서버 유저 저장
// prisma, db
let users = [];

const router = express.Router();

router.post('/signup', async (req,res) => {
   const {username, password, nickname} = req.body;

   const encryptedPassword = await bcyrpt.hash(password, 12);

   console.log(`암호화된 비밀 번호: `, encryptedPassword);

   users.push({
      username, 
      password: encryptedPassword
   });

   const result = {
      username: username,
      nickname: nickname,
      authorities: [{
         authorityName: encryptedPassword,
      }]
   }

   return res.status(201).send(result);
})

router.post('/login', async (req,res) => {
   const {username, password} = req.body;

   const user = await users.find((user) => user.username === username);
   
   console.log(`유저입니다`, user);
   const decryptedPassword = await bcyrpt.compare(password,user.password); // 암호화된 거 필요

   if(!decryptedPassword) {
      return res.status(400).send("incorrected Password");
   }

   const accessToken = jwt.sign({username:username}, process.env.accessTokenKey, {expiresIn: '1h'});

   //const refreshToken = jwt.sign(req.body,process.env.refreshTokenKey, {expiresIn: '1h'});

   return res.status(200).send({token: accessToken});
})

export default router;


