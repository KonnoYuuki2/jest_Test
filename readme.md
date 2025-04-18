# Access Token과 Refresh Token의 발급 및 인증 테스트 코드


# 🎤 프로젝트 소개
제작 기간: 2025.01.18 ~ 2025.01.19

### 🎮 구현 기능
- jest를 이용한 Access Token과 Refresh Token의 발급과 인증 테스트 코드
- express와 jwt, bcrypt를 이용한 회원가입, 로그인(accounts) 구현
- token 검증과 refreshToken 재발급을 위한 middleware(authorization), router(sayHello) 구현
- swagger ui 확인을 위한 swagger 구현

### 명령어
jest 테스트 실행: npx jest
서버 실행: npm start

### Swagger 주소
http://15.164.94.171:3000/api-docs

### 🎮 구현 기능
- jest를 이용한 Access Token과 Refresh Token의 발급과 인증 테스트 코드
- express와 jwt, bcrypt를 이용한 회원가입, 로그인(accounts) 구현
- token 검증과 refreshToken 재발급을 위한 middleware(authorization), router(sayHello) 구현
- swagger ui 확인을 위한 swagger 구현

### 트러블 슈팅
- 1. jest babel 문제
jest 테스트 코드를 babel로 변환 하는 중에 import 문이 제대로 변경되지 않는 문제가 발생
babel에선 commonJs로 처리하나 es6->commonJs로 제대로 변환되지 못함을 확인
jest 설정을 추가하여 babel에서 import문이 제대로 변경되도록 수정함

- 2. token exp 문제
 받은 token의 만료 시간을 검증하는 로직에서 result.exp와 Date.now()의 자릿수가 맞지 않는 문제가 발생했다.
 비교해보니 result.exp의 시간은 second 단위의 Unix 시간, Date.now()는 milliSecond 단위 Unix 시간임을 확인
 exp 시간에 맞추어 Date.now()의 시간을 수정함으로써 토큰 만료 로직을 수정함

 - 3. jest 테스트 중 expired 문제
 jest 테스트 중, jest에서 만든 jwt와 이를 받아 처리하는 authorization 미들웨어의 jwt의 시간이 다른 문제가 발생함
 이유를 확인해본 결과, 하나의 describe에 auth와 accounts 테스트를 몰아서 한 것이 문제였음.
 각각 별도의 describe으로 분리하여 테스트를 진행하여 오류를 해결하였음.

- 4. swagger UI 라우팅 문제
swagger UI 테스트 중 Execute 했을 때 swagger UI로 직접 라우팅되어 swagger UI의 URL을 띄우는 문제가 발생함
swagger UI의 주소와 서버의 주소가 일치하였을 떄 이런 문제가 발생할 수 있음을 확인
swagger UI의 주소를 서버의 주소와 달리 직접 입력하여 문제 현상을 해결함


