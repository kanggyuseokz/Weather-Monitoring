// src/components/MapViewer.jsx

import React, { useEffect, useRef, useState } from 'react';
import * as Cesium from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";
import './MapViewer.css'; 
import { getShortTermForecast, getTyphoonInfo, getFineDustInfo } from '../api/index.js';

window.CESIUM_BASE_URL = '/Cesium/';

const majorCities = [
  // 수도권 (Seoul Capital Area)
  { id: 'seoul', name: '서울', lon: 126.9779, lat: 37.5663, nx: 60, ny: 127, sidoName: '서울', stationName: '중구' },
  { id: 'incheon', name: '인천', lon: 126.7052, lat: 37.4563, nx: 55, ny: 124, sidoName: '인천', stationName: '부평구' },
  { id: 'suwon', name: '수원', lon: 127.0275, lat: 37.2636, nx: 61, ny: 120, sidoName: '경기', stationName: '인계동' },
  { id: 'seongnam', name: '성남', lon: 127.1389, lat: 37.4208, nx: 62, ny: 123, sidoName: '경기', stationName: '수정구' },
  { id: 'yongin', name: '용인', lon: 127.1775, lat: 37.241, nx: 62, ny: 119, sidoName: '경기', stationName: '김량장동' },
  { id: 'goyang', name: '고양', lon: 126.795, lat: 37.658, nx: 57, ny: 127, sidoName: '경기', stationName: '마두동'},
  { id: 'uijeongbu', name: '의정부', lon: 127.0336, lat: 37.738, nx: 61, ny: 129, sidoName: '경기', stationName: '의정부동' },

  // 강원권 (Gangwon)
  { id: 'chuncheon', name: '춘천', lon: 127.7298, lat: 37.8813, nx: 73, ny: 134, sidoName: '강원', stationName: '효자동' },
  { id: 'wonju', name: '원주', lon: 127.945, lat: 37.342, nx: 76, ny: 122, sidoName: '강원', stationName: '명륜동' },
  { id: 'gangneung', name: '강릉', lon: 128.876, lat: 37.752, nx: 92, ny: 131, sidoName: '강원', stationName: '옥천동'},
  { id: 'sokcho', name: '속초', lon: 128.591, lat: 38.204, nx: 87, ny: 139, sidoName: '강원', stationName: '조양동' },

  // 충청권 (Chungcheong)
  { id: 'cheongju', name: '청주', lon: 127.4914, lat: 36.6425, nx: 69, ny: 107, sidoName: '충북', stationName: '사직동' },
  { id: 'chungju', name: '충주', lon: 127.929, lat: 36.97, nx: 76, ny: 114, sidoName: '충북', stationName: '칠금동' },
  { id: 'daejeon', name: '대전', lon: 127.3845, lat: 36.3504, nx: 67, ny: 100, sidoName: '대전', stationName: '유성구' },
  { id: 'cheonan', name: '천안', lon: 127.148, lat: 36.815, nx: 62, ny: 112, sidoName: '충남', stationName: '성황동'},
  { id: 'seosan', name: '서산', lon: 126.45, lat: 36.78, nx: 48, ny: 109, sidoName: '충남', stationName: '독곶리' },
  
  // 전라권 (Jeolla)
  { id: 'jeonju', name: '전주', lon: 127.1477, lat: 35.8208, nx: 63, ny: 89, sidoName: '전북', stationName: '노송동' },
  { id: 'gunsan', name: '군산', lon: 126.712, lat: 35.967, nx: 54, ny: 90, sidoName: '전북', stationName: '신흥동' },
  { id: 'gwangju', name: '광주', lon: 126.8526, lat: 35.1595, nx: 58, ny: 74, sidoName: '광주', stationName: '서구' },
  { id: 'mokpo', name: '목포', lon: 126.392, lat: 34.812, nx: 50, ny: 61, sidoName: '전남', stationName: '유달동'},
  { id: 'yeosu', name: '여수', lon: 127.661, lat: 34.760, nx: 73, ny: 66, sidoName: '전남', stationName: '문수동' },
  
  // 경상권 (Gyeongsang)
  { id: 'daegu', name: '대구', lon: 128.6014, lat: 35.8714, nx: 89, ny: 90, sidoName: '대구', stationName: '중구' },
  { id: 'andong', name: '안동', lon: 128.729, lat: 36.568, nx: 91, ny: 106, sidoName: '경북', stationName: '옥동' },
  { id: 'pohang', name: '포항', lon: 129.365, lat: 36.038, nx: 102, ny: 94, sidoName: '경북', stationName: '장흥동' },
  { id: 'gumi', name: '구미', lon: 128.331, lat: 36.114, nx: 86, ny: 96, sidoName: '경북', stationName: '원평동' },
  { id: 'busan', name: '부산', lon: 129.0756, lat: 35.1796, nx: 98, ny: 76, sidoName: '부산', stationName: '부산진구' },
  { id: 'ulsan', name: '울산', lon: 129.3114, lat: 35.5384, nx: 102, ny: 84, sidoName: '울산', stationName: '남구' },
  { id: 'changwon', name: '창원', lon: 128.681, lat: 35.228, nx: 90, ny: 77, sidoName: '경남', stationName: '중앙동' },
  { id: 'jinju', name: '진주', lon: 128.083, lat: 35.18, nx: 81, ny: 75, sidoName: '경남', stationName: '상대동' },

  // 제주권 (Jeju)
  { id: 'jeju', name: '제주', lon: 126.5312, lat: 33.4996, nx: 52, ny: 38, sidoName: '제주', stationName: '이도동' },
  { id: 'seogwipo', name: '서귀포', lon: 126.565, lat: 33.254, nx: 52, ny: 33, sidoName: '제주', stationName: '동홍동' },
];

const MapViewer = () => {
  const viewerRef = useRef(null);
  const [isTyphoonLayerActive, setIsTyphoonLayerActive] = useState(false);
  const clickInfoDataSourceRef = useRef(new Cesium.CustomDataSource('clickInfoLayer'));
  const typhoonDataSourceRef = useRef(new Cesium.CustomDataSource('typhoonLayer'));

  // [구조 변경] API 호출 및 데이터 처리 로직을 별도의 함수로 분리
  const fetchAndDisplayInfo = async (cartesian, city) => {
    try {
      clickInfoDataSourceRef.current.entities.removeAll();
      
      clickInfoDataSourceRef.current.entities.add({
        position: cartesian,
        billboard: { image: '/pin-icon.png', width: 32, height: 32 },
      });

      const loadingEntity = clickInfoDataSourceRef.current.entities.add({
        position: cartesian,
        label: { text: `${city.name} 주변 정보 로딩 중...`, font: 'bold 16px sans-serif', style: Cesium.LabelStyle.FILL_AND_OUTLINE, outlineWidth: 4, pixelOffset: new Cesium.Cartesian2(0, -50), showBackground: true, backgroundColor: new Cesium.Color(0.1, 0.1, 0.1, 0.7) }
      });

      const [weatherData, dustData] = await Promise.all([
        getShortTermForecast(city.nx, city.ny),
        getFineDustInfo(city.sidoName)
      ]);
      
      clickInfoDataSourceRef.current.entities.remove(loadingEntity);
      
      let temp = 'N/A';
      if (weatherData) {
        const tempItem = weatherData.find(item => item.category === 'T1H') || weatherData.find(item => item.category === 'TMP');
        if (tempItem) temp = tempItem.fcstValue;
      }
      
      let dustValue = 'N/A';
      let stationName = '측정소 없음';
      if (dustData) {
        const dustItem = dustData.find(item => item.stationName === city.stationName && item.pm10Value !== '-');
        if (dustItem) {
          dustValue = dustItem.pm10Value;
          stationName = dustItem.stationName;
        } else { // 해당 측정소 값이 없으면, 그 도시의 첫번째 유효한 값을 사용
          const firstValidDustItem = dustData.find(item => item.pm10Value && item.pm10Value !== '-');
          if(firstValidDustItem){
            dustValue = firstValidDustItem.pm10Value;
            stationName = firstValidDustItem.stationName;
          }
        }
      }
      
      clickInfoDataSourceRef.current.entities.add({
        position: cartesian,
        label: {
          text: `클릭 지점 (주변: ${city.name} / 측정소: ${stationName})\n온도: ${temp}℃\n미세먼지: ${dustValue}µg/m³`,
          font: 'bold 16px sans-serif',
          fillColor: Cesium.Color.YELLOW,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 4,
          backgroundColor: new Cesium.Color(0.1, 0.1, 0.1, 0.7),
          showBackground: true,
          pixelOffset: new Cesium.Cartesian2(0, -50),
        }
      });

    } catch (e) {
      console.error("정보 처리 중 오류:", e);
      alert("정보를 가져오는 데 실패했습니다.");
    }
  };


  // 1. 뷰어 초기화 및 이벤트 핸들러 설정
  useEffect(() => {
    const initializeViewer = async () => {
      try {
        const viewer = new Cesium.Viewer("cesiumContainer", {
          terrainProvider: await Cesium.createWorldTerrainAsync(),
          //... (다른 viewer 옵션들)
        });
        viewerRef.current = viewer;
        viewer.dataSources.add(clickInfoDataSourceRef.current);
        viewer.dataSources.add(typhoonDataSourceRef.current);
        
        viewer.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(127.5, 36.0, 1500000) });
        
        // [구조 변경] 이벤트 핸들러는 동기적으로 처리하고, 비동기 작업은 외부 함수로 호출
        const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction((click) => {
          const cartesian = viewer.camera.pickEllipsoid(click.position, viewer.scene.globe.ellipsoid);
          if (!cartesian) return;
          
          let closestCity = majorCities.reduce((prev, curr) => {
            const prevDist = Cesium.Cartesian3.distance(Cesium.Cartesian3.fromDegrees(prev.lon, prev.lat), cartesian);
            const currDist = Cesium.Cartesian3.distance(Cesium.Cartesian3.fromDegrees(curr.lon, curr.lat), cartesian);
            return currDist < prevDist ? curr : prev;
          });

          // 비동기 함수 호출
          fetchAndDisplayInfo(cartesian, closestCity);

        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      } catch (error) {
        console.error("초기화 오류:", error);
      }
    };
    initializeViewer();
  }, []);

  // 2. 태풍 레이어 토글 로직
  useEffect(() => {
    // ... (이전과 동일)
  }, [isTyphoonLayerActive]);

  return (
    <div>
      <div id="cesiumContainer" style={{ width: '100vw', height: '100vh' }} />
      <div className="toggle-panel">
        <button className={isTyphoonLayerActive ? 'active' : ''} onClick={() => setIsTyphoonLayerActive(prev => !prev)}>
          태풍 정보
        </button>
      </div>
    </div>
  );
};

export default MapViewer;
