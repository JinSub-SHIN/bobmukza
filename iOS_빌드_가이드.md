# iOS 앱 빌드 가이드 (macOS + Xcode)

macOS와 Xcode가 있으면 iOS 앱(IPA)을 빌드할 수 있습니다!

## 사전 준비 확인

✅ macOS (Mac 컴퓨터)  
✅ Xcode 설치됨  
✅ Apple Developer 계정 (실제 기기에 설치하려면 필요)

## 빌드 단계

### 1단계: 프로젝트를 macOS로 옮기기

프로젝트 폴더 전체를 macOS로 복사:
- USB 드라이브
- 클라우드 (iCloud, Google Drive 등)
- Git 저장소
- 네트워크 공유

### 2단계: macOS에서 프로젝트 열기

터미널에서 프로젝트 폴더로 이동:
```bash
cd /path/to/bobmukza
```

### 3단계: 의존성 설치

```bash
npm install
```

### 4단계: 프로젝트 빌드

```bash
npm run build
```

### 5단계: iOS 플랫폼 추가

```bash
npx cap add ios
```

### 6단계: 프로젝트 동기화

```bash
npx cap sync
```

이 명령어는:
- `dist` 폴더의 빌드 결과물을 iOS 프로젝트로 복사
- 네이티브 의존성 업데이트

### 7단계: Xcode 열기

```bash
npx cap open ios
```

또는 직접:
```bash
open ios/App.xcworkspace
```

## Xcode에서 빌드 및 설치

### 1. 프로젝트 설정

1. Xcode가 열리면 왼쪽에서 `App` 프로젝트 선택
2. `TARGETS` → `App` 선택
3. `Signing & Capabilities` 탭 클릭

### 2. Signing 설정

**개발용 (테스트):**
- `Automatically manage signing` 체크
- `Team`에서 Apple ID 선택 (무료 계정도 가능)
- `Bundle Identifier` 확인 (예: `com.bobmukza.app`)

**배포용:**
- Apple Developer 계정 필요 ($99/년)
- Provisioning Profile 설정

### 3. 기기 선택

상단에서:
- **시뮬레이터**: iPhone 시뮬레이터 선택 (Mac에서 테스트)
- **실제 기기**: USB로 연결한 iPhone 선택

### 4. 빌드 및 실행

1. `Product` → `Run` (또는 `⌘ + R`)
2. 시뮬레이터 또는 실제 기기에서 앱 실행

### 5. Archive (배포용 IPA 생성)

실제 기기에 설치하려면:

1. **실제 기기 선택** (시뮬레이터 아님)
2. `Product` → `Archive`
3. Archive 완료 후 창이 열림
4. `Distribute App` 클릭
5. 배포 방법 선택:
   - **Ad Hoc**: 특정 기기에 직접 설치
   - **App Store**: App Store에 제출
   - **Development**: 개발용

## 실제 iPhone에 설치하기

### 방법 1: Xcode로 직접 설치 (가장 쉬움)

1. iPhone을 USB로 Mac에 연결
2. iPhone에서 "이 컴퓨터를 신뢰" 선택
3. Xcode에서 iPhone 선택
4. `Product` → `Run` (⌘ + R)
5. iPhone에서 설정 → 일반 → VPN 및 기기 관리 → 개발자 앱 신뢰

### 방법 2: Ad Hoc 배포

1. Archive → Distribute App → Ad Hoc
2. IPA 파일 생성
3. AirDrop, 이메일 등으로 iPhone에 전송
4. iPhone에서 IPA 파일 열기
5. 설정에서 신뢰

### 방법 3: TestFlight (권장)

1. App Store Connect에 앱 업로드
2. TestFlight으로 배포
3. 베타 테스터에게 초대 링크 전송

## 주의사항

### Bundle Identifier
- `capacitor.config.ts`의 `appId`가 고유해야 함
- 다른 앱과 중복되면 변경 필요

### Signing 오류
- Apple Developer 계정이 없으면 무료 계정으로도 개발 가능
- 실제 기기에 설치하려면 Developer 계정 필요

### 기기 등록
- Ad Hoc 배포 시 기기 UDID 등록 필요
- Xcode에서 직접 설치하면 자동 등록

## 빠른 체크리스트

```bash
# 1. 프로젝트 폴더로 이동
cd /path/to/bobmukza

# 2. 의존성 설치
npm install

# 3. 빌드
npm run build

# 4. iOS 플랫폼 추가 (최초 1회만)
npx cap add ios

# 5. 동기화
npx cap sync

# 6. Xcode 열기
npx cap open ios
```

그 다음 Xcode에서 빌드하면 됩니다!

## 문제 해결

### "No such module 'Capacitor'"
```bash
cd ios/App
pod install
cd ../..
npx cap sync
```

### Signing 오류
- Xcode에서 `Automatically manage signing` 체크
- Apple ID로 로그인 확인

### 빌드 실패
- Xcode → `Product` → `Clean Build Folder` (⇧⌘K)
- 다시 빌드

## 추가 팁

- **시뮬레이터 테스트**: Mac에서 바로 테스트 가능
- **실제 기기 테스트**: USB 연결 후 Xcode에서 실행
- **배포**: Archive → Distribute App으로 IPA 생성

