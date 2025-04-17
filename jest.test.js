import request from "supertest";
import dotenv from "dotenv";
import app from "./src/server.js";
import { describe, it, expect } from "@jest/globals";
import jwt from "jsonwebtoken";

dotenv.config();

describe("auth Test", () => {
  it("인증 실패 테스트 - 토큰이 없습니다. (/app/Auth)", async () => {
    const response = await request(app)
      .get("/app/Auth")
      .set("authorization", "");

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error.code).toBe("TOKEN_NOT_FOUND");
  });

  it("인증 실패 테스트 - 토큰이 유효하지 않습니다. (/app/Auth)", async () => {
    const response = await request(app)
      .get("/app/Auth")
      .set("authorization", "Bearer invalid_Token");

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error.code).toBe("INVALID_TOKEN");
  });

  it("인증 실패 테스트 - 만료된 토큰 (/app/Auth)", async () => {
    const expiredToken = jwt.sign(
      { username: "JIN" },
      process.env.accessTokenKey,
      { expiresIn: "1s" }
    );

    const result = jwt.verify(expiredToken, process.env.accessTokenKey);
    console.log("🔐 [AUTH Test] 토큰 내용 확인:", result);

    await new Promise((resolve) => setTimeout(resolve, 3000)); // 1.5초 대기

    const response = await request(app)
      .get("/app/Auth")
      .set("authorization", `Bearer ${expiredToken}`);

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error.code).toBe("EXPIRED_TOKEN");
  });
});

describe("accounts Test", () => {
  const signUpRequest = {
    username: "JIN HO",
    password: "12341234",
    nickname: "Mentos",
  };

  const loginRequest = {
    username: "JIN HO",
    password: "12341234",
  };

  let token = "";

  it("회원가입 성공 테스트", async () => {
    const response = await request(app).post("/app/signup").send(signUpRequest);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("username");
    expect(response.body).toHaveProperty("nickname");
    expect(response.body).not.toHaveProperty("password");
  });

  it("로그인 성공 테스트", async () => {
    const response = await request(app).post("/app/login").send(loginRequest);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token");

    if (response.body.token) {
      token = response.body.token;
    }
  });

  it("로그인 실패 테스트 - 잘못된 로그인", async () => {
    const response = await request(app).post("/app/login").send({
      username: "JIN HO",
      password: "wrongpassword",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error.code).toBe("INVALID_CREDENTIALS");
  });

  // 로그인하면서 발급된 토큰이 필요함
  it("인증 성공 테스트 - /app/Auth", async () => {
    const response = await request(app)
      .get("/app/Auth")
      .set("authorization",`Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("result");
  });
});
