# Node.js 업그레이드 가이드

현재 Node.js 버전이 14.21.3인데, Capacitor는 Node.js 22 이상이 필요합니다.

## Node.js 업그레이드 방법

### 방법 1: 공식 웹사이트에서 다운로드 (권장)

1. [Node.js 공식 웹사이트](https://nodejs.org/) 방문
2. **LTS 버전** 다운로드 (현재 22.x.x)
3. 설치 프로그램 실행
4. 기존 Node.js를 덮어쓰기로 설치
5. 터미널 재시작 후 확인:
   ```bash
   node --version
   ```

### 방법 2: nvm 사용 (Windows)

1. [nvm-windows 다운로드](https://github.com/coreybutler/nvm-windows/releases)
2. 설치 후:
   ```bash
   nvm install 22
   nvm use 22
   ```

## 업그레이드 후 다시 시도

```bash
# 1. 프로젝트 빌드
npm run build

# 2. Android 플랫폼 추가
npx cap add android

# 3. 동기화
npx cap sync

# 4. Android Studio 열기
npx cap open android
```

## Node.js 업그레이드 없이 진행하는 방법

Node.js를 업그레이드하지 않고 싶다면, 수동으로 Android 프로젝트를 만들 수 있습니다:

1. Android Studio에서 새 프로젝트 생성
2. `dist` 폴더의 내용을 `android/app/src/main/assets/public/`에 복사
3. WebView 설정 추가

하지만 **Node.js 업그레이드를 강력히 권장**합니다!

