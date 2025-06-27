// src/api/index.js

const SERVICE_KEY = import.meta.env.VITE_KMA_API_KEY; // 공공데이터포털 공통 인증키

/**
 * [수정됨] 특정 도시의 기상청 단기예보를 요청하는 함수
 * @param {number} nx - 예보지점 X 좌표
 * @param {number} ny - 예보지점 Y 좌표
 * @returns {Promise<any>} API 응답 데이터
 */
export const getShortTermForecast = async (nx, ny) => {
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let day = now.getDate();
  let hours = now.getHours();

  if (hours < 2) {
    now.setDate(day - 1);
    year = now.getFullYear(); month = now.getMonth() + 1; day = now.getDate();
    hours = 23;
  } else {
    const availableTimes = [2, 5, 8, 11, 14, 17, 20, 23];
    hours = availableTimes.slice().reverse().find(time => time <= hours);
  }
  
  const baseDate = `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`;
  const baseTime = `${String(hours).padStart(2, '0')}00`;
  const url = `/kma-api/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${SERVICE_KEY}&pageNo=1&numOfRows=100&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    if (data.response?.header?.resultCode !== '00') throw new Error(data.response?.header?.resultMsg);
    return data.response.body.items.item;
  } catch (error) {
    console.error("단기예보 API 오류:", error);
    return null;
  }
};

/**
 * [수정됨] 특정 도시의 미세먼지 정보를 요청하는 함수
 * @param {string} sidoName - 시도 이름 (예: '서울', '부산')
 * @returns {Promise<any>} API 응답 데이터
 */
export const getFineDustInfo = async (sidoName) => {
    const encodedSidoName = encodeURIComponent(sidoName);
    const url = `/airkorea-api/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?serviceKey=${SERVICE_KEY}&returnType=json&numOfRows=100&pageNo=1&sidoName=${encodedSidoName}&ver=1.0`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.response?.header?.resultCode !== '00') throw new Error(data.response?.header?.resultMsg);
        return data.response.body.items;
    } catch (error) {
        console.error("미세먼지 API 오류:", error);
        return null;
    }
}

/**
 * 기상청 태풍정보 API 호출 함수 (변경 없음)
 */
export const getTyphoonInfo = async () => {
    // ... (이전과 동일한 태풍 API 호출 코드) ...
};
