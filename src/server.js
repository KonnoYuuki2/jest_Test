import express from "express";
import http from "http";
import dotenv from "dotenv";
import account from "./routers/accounts.js";
import sayHello from "./routers/sayHello.js";
import swaggerConfig from "./swagger/swagger.js";

dotenv.config();
const {swaggerUi, specs} = swaggerConfig;

const app = express();

const server = http.createServer();

app.use(express.json());

app.use('/app', [account,sayHello]);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs)); // 미들 웨어 추가

app.listen(process.env.port, process.env.host, () => {
    console.log(`${process.env.host}:${process.env.port}로 서버가 열림`);
})

export default app;
