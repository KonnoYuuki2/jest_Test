import request from "supertest";
import dotenv from "dotenv";
import app from "./src/server.js";
import { describe, it, expect } from '@jest/globals';

dotenv.config();


describe('access, refresh token test', () => {
    const signUpRequest = {
	   username: "JIN HO",
	   password: "12341234",
	   nickname: "Mentos"
    };

    const loginRequest = {
	   username: "JIN HO",
	   password: "12341234",
    };

    let token = '';

    const headers = {
       authoriztion: token
    }

    it('signup 테스트', async () => {
       const response = await request(app)
       .post('/app/signup')
       .send(signUpRequest);

       expect(response.statusCode).toBe(201);
       expect(response.body).toHaveProperty('username');
       expect(response.body).toHaveProperty('nickname');
       expect(response.body).not.toHaveProperty('password');
       expect(response.body).toHaveProperty('authorities');
    });

    it('login 테스트', async () => {
        const response = await request(app)
        .post('/app/login')
        .send(loginRequest);
        
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('token');

        //expect(response.body).toBe("incorrected Password");

        if(response.body.token) {
           token = response.body.token;
        }
    })

    // TODO: 어떻게 해서 token들의 만료를 확인할지
    // TODO: 이를 어떻게 검증할지
    it('sayHello 테스트', async () => {
        const response = await request(app)
        .get('/app/hello')
        .set("authorization", `Bearer ${token}`)
        .send();

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('result');


        // ! refresh token 테스트 용
        // if(expect(response.body).toHaveProperty(token)) {
        //     token = response.body.token;
        //     console.log(`테스트 토큰입니다.`, token);
        // }

        //expect(response.statusCode).toBe("incorrected jwt Token");

    })
});

