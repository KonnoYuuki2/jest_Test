import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authorization = async (req,res,next) => {
    let result;

    if(req.headers.authorization) {
        const token = req.headers.authorization.split(' ');

        if(token[0] !== 'Bearer') {
            return res.status(401).send({
                 error: {
                     code:"INVALID_TOKEN",
                     message: "토큰이 유효하지 않습니다."
                }
            });
        }
        
        try {
            result = await jwt.verify(token[1],process.env.accessTokenKey);
        }
        catch(error) {
            if(error.name === "TokenExpiredError") {
                res.status(401).send({
                    error:{
                        code:"EXPIRED_TOKEN",
                        message: "토큰이 만료되었습니다."
                    }
                });
            }
            else {
                return res.status(401).send({
                 error: {
                     code:"INVALID_TOKEN",
                     message: "토큰이 유효하지 않습니다."
                }
            });    
            }
            
        }

        if(result) {
           req.info = {
            username: result.username, 
          };

          next();
        }
    }
    else {
        res.status(401).send({
            error: {
                code: "TOKEN_NOT_FOUND",
                message: "토큰이 없습니다."
            }
        });
    }
}