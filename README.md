# 2048 Game with Ranking System

브라우저에서 즐길 수 있는 2048 게임입니다. 랭킹 시스템이 포함되어 있어 다른 플레이어들과 점수를 비교할 수 있습니다.

## 기능

- 클래식한 2048 게임플레이
- 키보드 및 터치스크린 지원
- 실시간 점수 표시
- 게임 오버 시 랭킹 등록
- 상위 10개 랭킹 조회

## 기술 스택

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Database: MySQL (AWS RDS)

## 설치 방법

1. 저장소를 클론합니다:
```bash
git clone https://github.com/your-username/2048-game.git
cd 2048-game
```

2. 필요한 패키지를 설치합니다:
```bash
npm install
```

3. 환경 변수를 설정합니다:
```bash
cp .env.example .env
```
`.env` 파일을 열어 실제 데이터베이스 정보를 입력합니다.

4. 데이터베이스를 설정합니다:
- MySQL 클라이언트에 접속합니다
- `db_setup.sql` 파일의 내용을 실행합니다

5. 서버를 실행합니다:
```bash
npm start
```

6. 브라우저에서 `http://localhost:3000`으로 접속합니다.

## 배포 방법

### AWS EC2 배포

1. EC2 인스턴스를 생성합니다.

2. 보안 그룹 설정:
   - 인바운드 규칙에 TCP 3000 포트 추가
   - RDS 보안 그룹에서 EC2 인스턴스 접근 허용

3. EC2 인스턴스에 접속:
```bash
ssh -i your-key.pem ec2-user@your-ec2-ip
```

4. Node.js 설치:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 16
```

5. 프로젝트 클론 및 설정:
```bash
git clone https://github.com/your-username/2048-game.git
cd 2048-game
npm install
cp .env.example .env
# .env 파일 수정
```

6. PM2로 서버 실행:
```bash
npm install -g pm2
pm2 start server.js
pm2 startup
```

### 도메인 설정 (선택사항)

1. Route 53에서 도메인 설정
2. Nginx 설치 및 리버스 프록시 설정
3. SSL 인증서 설정 (Let's Encrypt)

## 주의사항

- `.env` 파일은 절대 GitHub에 커밋하지 마세요!
- 실제 배포 시에는 보안 설정을 꼭 확인하세요.
- RDS 접근 권한을 적절히 설정하세요.

## 라이선스

MIT License 