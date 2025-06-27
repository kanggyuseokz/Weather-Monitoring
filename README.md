# 🌦️ 클릭 기반 실시간 기상 정보 시스템
| **Click-based Real-time Weather Information System**

<br>

## 📖 프로젝트 소개 (About)
본 프로젝트는 사용자가 3D 지구본 위에서 직접 원하는 위치를 탐색하며 실시간 기상 및 환경 정보를 확인할 수 있는 인터랙티브 웹 애플리케이션입니다.

정적인 목록이나 정해진 지역 정보만을 제공하는 기존의 날씨 앱에서 벗어나, CesiumJS를 기반으로 구현된 몰입감 있는 3D 환경을 제공합니다. 사용자는 마치 위성 지도를 보듯 자유롭게 지도를 회전하고 확대하며, 궁금한 지역을 클릭하는 것만으로 간단하게 정보를 조회할 수 있습니다.

프로젝트의 핵심은 **사용자 클릭 기반의 동적 데이터 조회 방식**입니다. 사용자가 특정 지점을 클릭하면, 해당 좌표와 가장 가까운 주요 도시의 관측소 데이터를 기준으로 공공데이터포털의 API(기상청 동네예보, 에어코리아 대기오염정보)를 비동기적으로 호출합니다. 이를 통해 가져온 실시간 온도와 미세먼지 농도 정보를 가공하여, 사용자가 클릭한 위치에 직관적인 정보 라벨로 시각화합니다. 이 모든 과정은 React의 효율적인 상태 관리와 동적 UI 렌더링을 통해 이루어집니다.

이를 통해 사용자에게는 더 능동적이고 재미있는 방식으로 날씨 정보를 탐색하는 경험을, 개발자에게는 여러 공공 API를 융합하고 3D 그래픽 라이브러리를 활용하는 실전적인 개발 경험을 제공하는 것을 목표로 합니다.


## ✨ 주요 기능 (Features)
- **인터랙티브 3D 지도**: CesiumJS를 활용한 3D 지구본 위에 모든 정보가 시각화됩니다.
- **클릭 기반 정보 조회**: 사용자가 지도의 어느 곳이든 클릭하면 해당 위치에 핀이 생성되고, 관련 정보를 즉시 불러옵니다.
- **실시간 날씨 및 미세먼지**: 클릭 지점과 가장 가까운 관측소의 데이터를 기준으로 기상청의 **실시간 온도**와 한국환경공단의 **미세먼지 농도**를 제공합니다.
- **동적 정보 라벨**: API로부터 받은 데이터를 가공하여, 클릭한 핀 위에 깔끔한 정보 라벨을 동적으로 표시합니다.
- **태풍 경로 추적**: 토글 버튼을 통해 현재 활동 중인 태풍의 경로와 정보를 지도 위에 겹쳐볼 수 있습니다.


<br>

## 🛠️ 기술 스택 (Tech Stack)
- **프론트엔드**: ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black) ![Cesium](https://img.shields.io/badge/Cesium-00AEEF?style=for-the-badge&logo=cesium&logoColor=white)
- **빌드 도구**: ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
- **버전 관리**: ![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white) ![Git](https://img.shields.io/badge/Git-181717?style=for-the-badge&logo=git&logoColor=orange)

<br>

**데이터 소스 (Data Source)**
- **공공데이터포털 ([data.go.kr](https://data.go.kr))**
  - 기상청_동네예보 조회서비스 (온도 정보)
  - 에어코리아_대기오염정보 (미세먼지 정보)
  - 기상청_태풍정보 조회서비스 (태풍 정보)


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
    프로젝트의 루트 폴더에 `.env.local` 파일을 생성하고 아래 내용을 추가하세요.

    `.env.local`
    ```
    # 3D 지도를 위한 Cesium Ion 액세스 토큰
    VITE_CESIUM_ION_ACCESS_TOKEN="여기에 Cesium Ion 액세스 토큰을 입력하세요"
    
    # 공공데이터포털에서 발급받은 하나의 서비스 키 (Decoding)
    # 이 키 하나로 날씨, 미세먼지, 태풍 API를 모두 사용합니다.
    VITE_KMA_API_KEY="여기에 공공데이터포털 통합 인증키를 입력하세요"
    ```

    **중요:** `.env.local` 파일은 개인 정보이므로 `.gitignore` 파일에 `.env.local` 한 줄을 추가하여 버전 관리에서 제외해주세요.

5.  **개발 서버 실행**
    ```bash
    npm run dev
    ```

<br>

## 📝 라이선스 (License)
이 프로젝트는 [MIT License](LICENSE)를 따릅니다.
