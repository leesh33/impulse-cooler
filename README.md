# 🧊 지름 쿨다운 (Impulse Cooler) - iOS 앱스토어 출시 가이드

> **기획 & 디렉터**: 이상훈 님 (@odol)  
> **개발 & 디자인**: 오돌 (풀스택 AI 에이전트)  
> **스택**: React Native, Expo, AsyncStorage, Expo Haptics, LinearGradient  

---

## 📱 1. 내 아이폰에서 10초 만에 바로 띄워보기 (Expo Go)

맥북이나 PC에서 아래 명령어 3줄만 실행하면, 내 아이폰으로 실제 작동하는 화면을 바로 터치해 볼 수 있습니다!

```bash
# 1. 의존성 패키지 설치
npm install

# 2. 로컬 개발 서버 실행
npx expo start
```

터미널에 뜨는 **QR 코드**를 아이폰 카메라로 비추면, **Expo Go** 앱이 열리면서 실제 아이폰 화면에 네이티브 앱으로 즉시 구동됩니다.

---

## 🚀 2. 애플 앱스토어 실제 등록 및 출시 4단계 (EAS Build)

맥북이나 복잡한 Xcode 세팅 없이, 클라우드 빌드 도구인 **Expo EAS**를 통해 버튼 몇 개로 앱스토어에 배포할 수 있습니다.

### 1단계: EAS CLI 설치 및 로그인
```bash
npm install -g eas-cli
eas login
```

### 2단계: 빌드 프로젝트 초기화
```bash
eas build:configure
```

### 3단계: iOS 앱스토어 프로덕션 빌드 실행
애플 개발자 계정(연 99달러)과 연결되면 클라우드에서 애플 심사용 `.ipa` 파일이 자동 생성됩니다.
```bash
eas build --platform ios --profile production
```

### 4단계: 애플 App Store Connect 자동 제출
빌드가 끝나면 터미널 명령어 한 줄로 앱스토어 심사 대기열로 즉시 전송됩니다.
```bash
eas submit --platform ios
```

---

## 🎨 3. 앱 설정 및 커스터마이징

- **앱 이름 & 번들 ID**: `app.json`
  - 앱 이름: `지름 쿨다운`
  - iOS 번들 ID: `com.odol.impulse.cooler`
- **앱 아이콘 & 스플래시**: `assets/icon.png` (얼음 속 동결 카드 3D 고화질 아이콘)
- **생활 가치 환산 기준표**: `src/conversions.js`
  - 테슬라 완충: 12,000원
  - 아기 기저귀: 25,000원
  - 아메리카노: 4,500원
  - 치킨: 22,000원
