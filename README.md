# 🌦️ 실시간 기상 재해 모니터링 시스템
**Real-time Weather Disaster Monitoring System**

<br>

## 📖 프로젝트 소개 (About)
기상청 API 데이터를 활용하여 전국의 실시간 날씨, 미세먼지, 태풍 정보 등을 3D 지도(CesiumJS) 위에 시각화하는 프로젝트입니다. 사용자는 지도를 통해 직관적으로 기상 상황을 파악하고, 특정 지역을 클릭하여 상세 정보를 확인할 수 있습니다. 위험 수치에 도달하면 시각적인 경고를 통해 재해 상황에 대비할 수 있도록 돕는 것을 목표로 합니다.

<br>

<br>

## ✨ 주요 기능 (Features)
- **3D 지도 시각화**: CesiumJS를 활용한 인터랙티브 3D 지구본 위에 데이터 표시
- **실시간 날씨 정보**: 기상청 단기예보 API를 연동하여 전국 지역별 날씨, 기온, 강수량 등 제공
- **미세먼지 현황**: 대기오염정보 API를 통해 전국 미세먼지(PM10) 및 초미세먼지(PM2.5) 농도 표시
- **태풍 경로 추적**: 활동 중인 태풍의 현재 위치, 과거 경로, 예상 경로 시각화
- **위험 경보**: 미세먼지 농도나 기상 특보 등 위험 수치 도달 시 지도 위에 색상으로 경고 표시
- **상세 정보 조회**: 지도 위의 특정 지역 클릭 시, 해당 지역의 상세 기상/환경 정보를 대시보드 형태로 제공

<br>

## 🛠️ 기술 스택 (Tech Stack)
- **프론트엔드**: ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black) ![Cesium](https://img.shields.io/badge/Cesium-00AEEF?style=for-the-badge&logo=cesium&logoColor=white)
- **빌드 도구**: ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
- **버전 관리**: ![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white) ![Git](https://img.shields.io/badge/Git-181717?style=for-the-badge&logo=git&logoColor=orange)
- **데이터 소스**: [기상청 API 허브](https://apihub.kma.go.kr/)

<br>

## 🚀 시작하기 (Getting Started)

### 사전 요구사항
- [Node.js](https://nodejs.org/) (LTS 버전 권장)
- [Git](https://git-scm.com/)

### 설치 및 실행
1.  **저장소 복제(Clone)**
    ```bash
    git clone [https://github.com/kanggyuseokz/Weather-Monitoring.git](https://github.com/kanggyuseokz/Weather-Monitoring.git)
    ```

2.  **프로젝트 폴더로 이동**
    ```bash
    cd Weather-Monitoring
    ```

3.  **의존성 라이브러리 설치**
    ```bash
    npm install
    ```
4.  **환경 변수 설정**
    프로젝트의 루트 폴더(최상위 폴더)에 `.env.local` 파일을 생성하고 아래 내용을 추가하세요. API 키와 같은 민감한 정보는 소스 코드에 직접 노출하지 않기 위함입니다.

    `.env.local`
    ```
    # Vite 프로젝트에서는 환경 변수 이름 앞에 'VITE_'를 붙여야 합니다.
    VITE_CESIUM_ION_ACCESS_TOKEN="여기에 Cesium Ion 액세스 토큰을 입력하세요"
    VITE_KMA_API_KEY="여기에 기상청 API 인증키를 입력하세요"
    ```

    **중요:** `.env.local` 파일은 개인 정보이므로 Git으로 관리하면 안 됩니다. `.gitignore` 파일에 `.env.local` 한 줄을 추가하여 버전 관리에서 제외해주세요.

5.  **개발 서버 실행**
    ```bash
    npm run dev
    ```
    실행 후 터미널에 나타나는 `http://localhost:xxxx` 주소로 접속하세요.

<br>

## 📝 라이선스 (License)
이 프로젝트는 [MIT License](LICENSE)를 따릅니다.
