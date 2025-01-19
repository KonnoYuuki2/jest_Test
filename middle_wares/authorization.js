import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authorization = async (req,res,next) => {
    if(req.headers.authorization) {
        const token = req.headers.authorization.split('Bearer ');

        const result = await jwt.verify(token[1],process.env.accessTokenKey);

        if(result.exp <= Math.floor(Date.now() / 1000)) {
            console.log(`토큰 만료 됨!`);

            const refreshToken = jwt.sign({username:result.username}, process.env.refreshTokenKey, {expiresIn: '3h'});

            res.status(401).send({token: refreshToken});
        }

        if(result) {
           req.info = {
            username: result.username, 
            password: result.password
          };

          next();
        }
    }
    else {
        res.status(401).send("incorrected jwt Token");
    }
}