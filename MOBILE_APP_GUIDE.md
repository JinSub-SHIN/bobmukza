# 모바일 앱 빌드 가이드

이 프로젝트를 Android APK와 iOS IPA로 빌드하는 방법입니다.

## 중요 사항

- **APK**: Android 기기에서만 실행 가능
- **IPA**: iPhone(iOS)에서만 실행 가능
- 아이폰에서는 APK를 실행할 수 없습니다. iOS용으로는 IPA 파일이 필요합니다.

## 사전 준비

### 1. Capacitor 설치

```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android @capacitor/ios
```

### 2. Android 개발 환경 (APK 빌드용)

- **Android Studio** 설치 필요
- **Java JDK 17** 이상 설치 필요
- Android SDK 설치

### 3. iOS 개발 환경 (IPA 빌드용)

- **macOS** 필요 (Windows에서는 불가능)
- **Xcode** 설치 필요
- **Apple Developer 계정** 필요 (실제 기기에 설치하려면)

## 빌드 단계

### 1. 프로젝트 빌드

```bash
npm run build
```

### 2. Capacitor 초기화 (최초 1회만)

```bash
npx cap init
```

이미 `capacitor.config.ts` 파일이 있으므로 이 단계는 건너뛰어도 됩니다.

### 3. Android/iOS 플랫폼 추가

```bash
# Android 추가
npx cap add android

# iOS 추가 (macOS에서만 가능)
npx cap add ios
```

### 4. 프로젝트 동기화

```bash
npx cap sync
```

이 명령어는:
- 웹 빌드 결과물을 네이티브 프로젝트로 복사
- 네이티브 의존성 업데이트

## Android APK 빌드

### 방법 1: Android Studio 사용 (권장)

1. Android Studio 열기:
   ```bash
   npx cap open android
   ```

2. Android Studio에서:
   - `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
   - 또는 `Build` → `Generate Signed Bundle / APK` (배포용)

3. APK 파일 위치:
   - `android/app/build/outputs/apk/debug/app-debug.apk` (디버그용)
   - `android/app/build/outputs/apk/release/app-release.apk` (릴리즈용)

### 방법 2: 명령줄 사용

```bash
cd android
./gradlew assembleDebug  # 디버그 APK
./gradlew assembleRelease  # 릴리즈 APK
```

## iOS IPA 빌드 (macOS 필요)

1. Xcode 열기:
   ```bash
   npx cap open ios
   ```

2. Xcode에서:
   - 프로젝트 설정에서 Bundle Identifier 설정
   - Signing & Capabilities에서 개발자 계정 설정
   - `Product` → `Archive` 선택
   - Archive 완료 후 `Distribute App` 선택

3. IPA 파일 생성:
   - Ad Hoc 배포: 테스트 기기에 직접 설치
   - App Store 배포: App Store에 제출

## 테스트용 APK 설치 (Android)

1. APK 파일을 Android 기기로 전송
2. 기기에서 "알 수 없는 출처" 설치 허용
3. APK 파일 클릭하여 설치

## 테스트용 IPA 설치 (iOS)

### 방법 1: TestFlight (권장)
- Apple Developer 계정 필요
- App Store Connect에 업로드
- TestFlight으로 배포

### 방법 2: Ad Hoc 배포
- Apple Developer 계정 필요
- 기기 UDID 등록 필요
- Xcode에서 직접 설치

### 방법 3: 개발자 모드 (iOS 16+)
- 설정 → 개인정보 보호 및 보안 → 개발자 모드 활성화
- Xcode로 직접 설치

## 주의사항

1. **아이폰에서는 APK를 실행할 수 없습니다**
   - Android용: APK 파일
   - iOS용: IPA 파일

2. **iOS 빌드는 macOS에서만 가능합니다**
   - Windows에서는 Android APK만 빌드 가능

3. **실제 기기에 설치하려면:**
   - Android: APK 파일만 있으면 됨
   - iOS: Apple Developer 계정과 인증서 필요

## 문제 해결

### Android 빌드 오류
- Android Studio에서 Gradle 동기화 확인
- `android/gradle.properties` 확인
- Java 버전 확인 (JDK 17 이상)

### iOS 빌드 오류
- Xcode 버전 확인
- Signing 설정 확인
- Bundle Identifier 중복 확인

## 추가 설정

### 앱 아이콘 및 스플래시 화면
- `android/app/src/main/res/` 폴더에 아이콘 추가
- `ios/App/App/Assets.xcassets/` 폴더에 아이콘 추가

### 권한 설정
- `android/app/src/main/AndroidManifest.xml` 수정
- `ios/App/App/Info.plist` 수정

