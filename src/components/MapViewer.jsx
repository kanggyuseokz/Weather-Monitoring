// src/components/MapViewer.jsx

import React, { useEffect, useRef, useState } from 'react';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import './MapViewer.css';
import {
  getShortTermForecast,
  getPastWeather,
  getFineDustInfo,
  getTyphoonInfo
} from '../api/index.js';

window.CESIUM_BASE_URL = '/Cesium/';

// 전국 주요 도시 데이터
const majorCities = [
  { id: 'seoul', name: '서울', lon: 126.9779, lat: 37.5663, nx: 60, ny: 127, sidoName: '서울', stationName: '중구', stnId: 108 },
  { id: 'incheon', name: '인천', lon: 126.7052, lat: 37.4563, nx: 55, ny: 124, sidoName: '인천', stationName: '부평구', stnId: 112 },
  { id: 'suwon', name: '수원', lon: 127.0275, lat: 37.2636, nx: 61, ny: 120, sidoName: '경기', stationName: '인계동', stnId: 119 },
  { id: 'seongnam', name: '성남', lon: 127.1389, lat: 37.4208, nx: 62, ny: 123, sidoName: '경기', stationName: '수정구', stnId: 119 },
  { id: 'yongin', name: '용인', lon: 127.1775, lat: 37.241, nx: 62, ny: 119, sidoName: '경기', stationName: '김량장동', stnId: 119 },
  { id: 'goyang', name: '고양', lon: 126.795, lat: 37.658, nx: 57, ny: 127, sidoName: '경기', stationName: '마두동', stnId: 119 },
  { id: 'uijeongbu', name: '의정부', lon: 127.0336, lat: 37.738, nx: 61, ny: 129, sidoName: '경기', stationName: '의정부동', stnId: 98 },
  { id: 'chuncheon', name: '춘천', lon: 127.7298, lat: 37.8813, nx: 73, ny: 134, sidoName: '강원', stationName: '효자동', stnId: 101 },
  { id: 'wonju', name: '원주', lon: 127.945, lat: 37.342, nx: 76, ny: 122, sidoName: '강원', stationName: '명륜동', stnId: 114 },
  { id: 'gangneung', name: '강릉', lon: 128.876, lat: 37.752, nx: 92, ny: 131, sidoName: '강원', stationName: '옥천동', stnId: 105 },
  { id: 'sokcho', name: '속초', lon: 128.591, lat: 38.204, nx: 87, ny: 139, sidoName: '강원', stationName: '조양동', stnId: 90 },
  { id: 'cheongju', name: '청주', lon: 127.4914, lat: 36.6425, nx: 69, ny: 107, sidoName: '충북', stationName: '사직동', stnId: 131 },
  { id: 'chungju', name: '충주', lon: 127.929, lat: 36.97, nx: 76, ny: 114, sidoName: '충북', stationName: '칠금동', stnId: 127 },
  { id: 'daejeon', name: '대전', lon: 127.3845, lat: 36.3504, nx: 67, ny: 100, sidoName: '대전', stationName: '유성구', stnId: 133 },
  { id: 'cheonan', name: '천안', lon: 127.148, lat: 36.815, nx: 62, ny: 112, sidoName: '충남', stationName: '성황동', stnId: 133 },
  { id: 'seosan', name: '서산', lon: 126.45, lat: 36.78, nx: 48, ny: 109, sidoName: '충남', stationName: '독곶리', stnId: 129 },
  { id: 'jeonju', name: '전주', lon: 127.1477, lat: 35.8208, nx: 63, ny: 89, sidoName: '전북', stationName: '노송동', stnId: 146 },
  { id: 'gunsan', name: '군산', lon: 126.712, lat: 35.967, nx: 54, ny: 90, sidoName: '전북', stationName: '신흥동', stnId: 140 },
  { id: 'gwangju', name: '광주', lon: 126.8526, lat: 35.1595, nx: 58, ny: 74, sidoName: '광주', stationName: '서구', stnId: 156 },
  { id: 'mokpo', name: '목포', lon: 126.392, lat: 34.812, nx: 50, ny: 61, sidoName: '전남', stationName: '유달동', stnId: 165 },
  { id: 'yeosu', name: '여수', lon: 127.661, lat: 34.760, nx: 73, ny: 66, sidoName: '전남', stationName: '문수동', stnId: 168 },
  { id: 'daegu', name: '대구', lon: 128.6014, lat: 35.8714, nx: 89, ny: 90, sidoName: '대구', stationName: '중구', stnId: 143 },
  { id: 'andong', name: '안동', lon: 128.729, lat: 36.568, nx: 91, ny: 106, sidoName: '경북', stationName: '옥동', stnId: 136 },
  { id: 'pohang', name: '포항', lon: 129.365, lat: 36.038, nx: 102, ny: 94, sidoName: '경북', stationName: '장흥동', stnId: 138 },
  { id: 'gumi', name: '구미', lon: 128.331, lat: 36.114, nx: 86, ny: 96, sidoName: '경북', stationName: '원평동', stnId: 143 },
  { id: 'busan', name: '부산', lon: 129.0756, lat: 35.1796, nx: 98, ny: 76, sidoName: '부산', stationName: '부산진구', stnId: 159 },
  { id: 'ulsan', name: '울산', lon: 129.3114, lat: 35.5384, nx: 102, ny: 84, sidoName: '울산', stationName: '남구', stnId: 152 },
  { id: 'changwon', name: '창원', lon: 128.681, lat: 35.228, nx: 90, ny: 77, sidoName: '경남', stationName: '중앙동', stnId: 155 },
  { id: 'jinju', name: '진주', lon: 128.083, lat: 35.18, nx: 81, ny: 75, sidoName: '경남', stationName: '상대동', stnId: 192 },
  { id: 'jeju', name: '제주', lon: 126.5312, lat: 33.4996, nx: 52, ny: 38, sidoName: '제주', stationName: '이도동', stnId: 184 },
  { id: 'seogwipo', name: '서귀포', lon: 126.565, lat: 33.254, nx: 52, ny: 33, sidoName: '제주', stationName: '동홍동', stnId: 189 },
];

const toYYYYMMDD = date => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const toApiDateString = date => toYYYYMMDD(date).replace(/-/g, '');

const isPastDate = apiDateString => {
  const today = new Date();
  return apiDateString < toApiDateString(today);
};

const MapViewer = () => {
  const viewerRef = useRef(null);
  const clickInfoDataSourceRef = useRef(new Cesium.CustomDataSource('clickInfoLayer'));
  const typhoonDataSourceRef = useRef(new Cesium.CustomDataSource('typhoonLayer'));
  const baseWeatherLayerRef = useRef(new Cesium.CustomDataSource('baseWeatherLayer'));

  const [isTyphoonLayerActive, setIsTyphoonLayerActive] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [lastClickedInfo, setLastClickedInfo] = useState(null);

  const fetchAndDisplayInfo = async (cartesian, city, date) => {
    try {
      const ds = clickInfoDataSourceRef.current;
      ds.entities.removeAll();

      const loading = ds.entities.add({
        position: cartesian,
        label: {
          text: `${city.name} 주변 정보 로딩 중...`,
          font: 'bold 16px sans-serif',
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 4,
          pixelOffset: new Cesium.Cartesian2(0, -50),
          backgroundColor: new Cesium.Color(0.1, 0.1, 0.1, 0.7),
          showBackground: true
        }
      });

      const dateStr = toApiDateString(date);
      const usePast = isPastDate(dateStr);

      const weatherData = usePast
        ? await getPastWeather(city.stnId, dateStr)
        : await getShortTermForecast(city.nx, city.ny, dateStr);

      const dustData = !usePast ? await getFineDustInfo(city.sidoName) : null;

      ds.entities.remove(loading);

      let tempText = 'N/A';
      let skyText = '정보없음';
      let pinTemp = 'N/A';

      if (weatherData) {
        if (usePast) {
          const minT = weatherData.minTa ?? 'N/A';
          const maxT = weatherData.maxTa ?? 'N/A';
          tempText = `최저/최고 온도: ${minT}℃ / ${maxT}℃`;
          pinTemp = maxT;
           // 전운량(avgTca)을 이용한 하늘 상태
        const tca = parseFloat(weatherData.avgTca);
        if (!isNaN(tca)) {
          if (tca <= 2) {
            skyText = '맑음';
          } else if (tca <= 5) {
            skyText = '구름';
          } else {
            skyText = '흐림';
          }
        } else {
          skyText = '정보없음';
        }
          // skyText = weatherData.iscs?.replace(/-|{.+?}|강도\d/g, '').trim() || '맑음';
        } else {
          const todayStr = toYYYYMMDD(new Date());
          const targetStr = toYYYYMMDD(date);
          if (targetStr === todayStr) {
            const nowHour = String(new Date().getHours()).padStart(2, '0') + '00';
            const tItem = weatherData.find(it => it.category === 'TMP' && it.fcstTime === nowHour);
            const sItem = weatherData.find(it => it.category === 'SKY' && it.fcstTime === nowHour);
            if (tItem) { tempText = `현재 ${tItem.fcstValue}℃`; pinTemp = tItem.fcstValue; }
            if (sItem) {
              const v = sItem.fcstValue;
              skyText = v === '1' ? '맑음' : v === '3' ? '구름많음' : '흐림';
            }
          } else {
            const tItem = weatherData.find(it => it.category === 'TMP' && it.fcstTime === '1200');
            const sItem = weatherData.find(it => it.category === 'SKY' && it.fcstTime === '1200');
            if (tItem) { tempText = `정오 예상 ${tItem.fcstValue}℃`; pinTemp = tItem.fcstValue; }
            if (sItem) {
              const v = sItem.fcstValue;
              skyText = v === '1' ? '맑음' : v === '3' ? '구름많음' : '흐림';
            }
          }
        }
      }

      // 핀 아이콘
      let iconUrl = '/pin-icon-normal.png';
      const num = parseInt(pinTemp, 10);
      if (!isNaN(num) && num >= 25) iconUrl = '/pin-icon-hot.png';

      ds.entities.add({
        position: cartesian,
        billboard: { image: iconUrl, width: 32, height: 32 }
      });

      // 1) skyText 에 따라 아이콘 맵핑
      const skyIconMap = {
        맑음: '/sun.png',
        구름: '/cloudy.png',
        흐림: '/rainy.png'
      };
      const skyIconUrl = skyIconMap[skyText] || '/sun.png';

      // 2) 하늘 아이콘 추가
      clickInfoDataSourceRef.current.entities.add({
        position: cartesian,
        billboard: {
          image: skyIconUrl,
          width: 32,
          height: 32,
          // 핀보다 살짝 위에 뜨도록 오프셋을 조정
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -50)
        }
      });

      // 라벨 텍스트 조합
      let label = `[${toYYYYMMDD(date)}]\n클릭 지점 (주변: ${city.name})\n${tempText}, 하늘: ${skyText}`;
      if (!usePast && dustData) {
        let dv = 'N/A';
        const dItem = dustData.find(it => it.stationName === city.stationName && it.pm10Value !== '-') ||
                      dustData.find(it => it.pm10Value && it.pm10Value !== '-');
        if (dItem) dv = dItem.pm10Value;
        label += `\n(실시간)미세먼지: ${dv}µg/m³`;
      }

      ds.entities.add({
        position: cartesian,
        label: {
          text: label,
          font: 'bold 16px sans-serif',
          fillColor: Cesium.Color.YELLOW,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 4,
          backgroundColor: new Cesium.Color(0.1, 0.1, 0.1, 0.7),
          showBackground: true,
          // ↓ 깊이 테스트 끄기: 항상 화면 앞에 표시
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          // ↓ 땅이 아닌 화면상의 위치로 고정
          heightReference: Cesium.HeightReference.NONE,
          // ↓ 아이콘보다 위쪽에 띄우기
          pixelOffset: new Cesium.Cartesian2(0, -80)
        }
      });

    } catch (e) {
      console.error('정보 처리 중 오류:', e);
    }
  };

  const displayDefaultSkyIcons = async (date) => {
    const ds = baseWeatherLayerRef.current;
    ds.entities.removeAll(); // 기존 엔티티가 있으면 초기화
    const dateStr = toApiDateString(date);
    const usePast = isPastDate(dateStr);

    for (const city of majorCities) {
      // 1) 좌표 계산
      const cartesian = Cesium.Cartesian3.fromDegrees(city.lon, city.lat);

      // 2) 날씨 데이터 호출 (과거/현재·미래 분기)
      const weatherData = usePast
        ? await getPastWeather(city.stnId, dateStr)
        : await getShortTermForecast(city.nx, city.ny, dateStr);

      // 3) skyText 계산 (과거 avgTca, 현재/미래 SKY 코드)
      let sky = '정보없음';
      if (weatherData) {
        if (usePast) {
          const tca = parseFloat(weatherData.avgTca);
          if (!isNaN(tca)) {
            sky = tca <= 2 ? '맑음' : tca <= 5 ? '구름' : '흐림';
          }
        } else {
          const todayStr = toYYYYMMDD(new Date());
          const targetStr = toYYYYMMDD(date);
          // 현재일 땐 현재시간 기준, 아니면 정오
          const time = (targetStr === todayStr)
            ? String(new Date().getHours()).padStart(2, '0') + '00'
            : '1200';
          const skyItem = weatherData.find(it => it.category === 'SKY' && it.fcstTime === time);
          if (skyItem) {
            sky = skyItem.fcstValue === '1'
              ? '맑음'
              : skyItem.fcstValue === '3'
                ? '구름'
                : '흐림';
          }
        }
      }

      // 4) 아이콘 URL 맵핑
      const skyIconMap = {
        맑음:    '/sun.png',
        구름:    '/cloudy.png',
        흐림:    '/rainy.png'
      };
      const iconUrl = skyIconMap[sky] || '/sun.png';

      // 5) Billboard 추가
      ds.entities.add({
        position: Cesium.Cartesian3.fromDegrees(city.lon, city.lat),
        billboard: {
          image: iconUrl,
          width: 32,
          height: 32,
          // 아이콘의 중심이 지점 좌표에 정확히 오도록
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin:   Cesium.VerticalOrigin.CENTER,
          // 픽셀 오프셋 제거
          pixelOffset: new Cesium.Cartesian2(0, 0),
          // 지형 뒤에 가려지지 않도록
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          disableDepthTestDistance: Number.POSITIVE_INFINITY
        }
      });
    }
  };

  // Cesium 뷰어 초기화
  useEffect(() => {
    const init = async () => {
      const viewer = new Cesium.Viewer('cesiumContainer', {
        terrainProvider: await Cesium.createWorldTerrainAsync()
      });
      viewerRef.current = viewer;
      viewer.dataSources.add(clickInfoDataSourceRef.current);
      viewer.dataSources.add(typhoonDataSourceRef.current);
      viewer.dataSources.add(baseWeatherLayerRef.current);
      viewer.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(127.5, 36.0, 1500000) });

      const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handler.setInputAction(click => {
        const cart = viewer.camera.pickEllipsoid(click.position, viewer.scene.globe.ellipsoid);
        if (!cart) return;
        const closest = majorCities.reduce((a, b) => {
          const da = Cesium.Cartesian3.distance(Cesium.Cartesian3.fromDegrees(a.lon, a.lat), cart);
          const db = Cesium.Cartesian3.distance(Cesium.Cartesian3.fromDegrees(b.lon, b.lat), cart);
          return db < da ? b : a;
        });
        setLastClickedInfo({ cartesian: cart, city: closest });
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      // ▶ init이 완료된 직후, 기본 아이콘 띄우기
      await displayDefaultSkyIcons(selectedDate);
    };
    init();
  }, []);

  // 클릭 or 날짜 변경 시 정보 갱신
  useEffect(() => {
    if (lastClickedInfo) {
      fetchAndDisplayInfo(lastClickedInfo.cartesian, lastClickedInfo.city, selectedDate);
    }
  }, [lastClickedInfo, selectedDate]);

  // 태풍 레이어 토글
  useEffect(() => {
    const ds = typhoonDataSourceRef.current;
    ds.show = isTyphoonLayerActive;

    if (isTyphoonLayerActive) {
      (async () => {
        // 1) 기존 엔티티 클리어
        ds.entities.removeAll();

        // 2) API 호출
        const items = await getTyphoonInfo();
        if (!items || items.length === 0) {
          // 태풍 정보 없음 메시지
          ds.entities.add({
            position: Cesium.Cartesian3.fromDegrees(127.5, 36.0, 700000),
            label: {
              text: '현재 발표된 태풍 정보가 없습니다.',
              font: 'bold 18px sans-serif',
              fillColor: Cesium.Color.WHITE,
            }
          });
          return;
        }

        // 3) typSeq 별로 그룹핑
        const grouped = items.reduce((acc, item) => {
          const id = item.typSeq; 
          if (!acc[id]) acc[id] = [];
          acc[id].push(item);
          return acc;
        }, {});

        // 4) 각 태풍 경로와 라벨 그리기
        for (const seq in grouped) {
          const path = grouped[seq]
            .map(p => ({
              lon: parseFloat(p.typLon),
              lat: parseFloat(p.typLat),
              name: p.typName
            }))
            .filter(p => !isNaN(p.lon) && !isNaN(p.lat));

          if (path.length === 0) continue;

          // 경로(polyline)
          const coords = path.flatMap(p => [p.lon, p.lat]);
          ds.entities.add({
            polyline: {
              positions: Cesium.Cartesian3.fromDegreesArray(coords),
              width: 3,
              material: Cesium.Color.RED,
              clampToGround: true
            }
          });

          // 마지막 지점에 라벨
          const last = path[path.length - 1];
          ds.entities.add({
            position: Cesium.Cartesian3.fromDegrees(last.lon, last.lat),
            label: {
              text: last.name,
              font: 'bold 16px sans-serif',
              fillColor: Cesium.Color.ORANGE,
              style: Cesium.LabelStyle.FILL_AND_OUTLINE,
              outlineWidth: 3,
              pixelOffset: new Cesium.Cartesian2(0, -30)
            }
          });
        }
      })();
    } else {
      // 버튼 비활성화 시: 모두 삭제
      typhoonDataSourceRef.current.entities.removeAll();
    }
  }, [isTyphoonLayerActive]);

  useEffect(() => {
    displayDefaultSkyIcons(selectedDate);
  }, [selectedDate]);  

  return (
    <>
      <div id="cesiumContainer" style={{ width: '100vw', height: '100vh' }} />
      <div className="toggle-panel">
        <button
          className={isTyphoonLayerActive ? 'active' : ''}
          onClick={() => setIsTyphoonLayerActive(p => !p)}
        >
          태풍 정보
        </button>
        <div className="date-picker-container">
          <label htmlFor="weather-date">날씨 조회 날짜:</label>
          <input
            type="date"
            id="weather-date"
            value={toYYYYMMDD(selectedDate)}
            onChange={e => {
              const [y, m, d] = e.target.value.split('-').map(Number);
              setSelectedDate(new Date(y, m - 1, d));
            }}
          />
        </div>
      </div>
    </>
  );
};

export default MapViewer;