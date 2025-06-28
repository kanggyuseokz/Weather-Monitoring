// src/api/index.js

const SERVICE_KEY = import.meta.env.VITE_KMA_API_KEY;

// 단기예보 API (오늘/미래 날씨용)
export const getShortTermForecast = async (nx, ny, baseDate) => {
  const now = new Date();
  let hours = now.getHours();
  const availableTimes = [2, 5, 8, 11, 14, 17, 20, 23];
  const foundTime = availableTimes.slice().reverse().find(time => time <= hours);
  const baseTime = (foundTime !== undefined) ? `${String(foundTime).padStart(2, '0')}00` : '2300';
  
  const url = `/kma-api/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${SERVICE_KEY}&pageNo=1&numOfRows=1000&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;
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

// 지상관측(ASOS) API (과거 날씨용)
export const getPastWeather = async (stationId, date) => {
  const url = `/kma-api/1360000/AsosDalyInfoService/getWthrDataList?serviceKey=${SERVICE_KEY}&pageNo=1&numOfRows=10&dataType=JSON&dataCd=ASOS&dateCd=DAY&startDt=${date}&endDt=${date}&stnIds=${stationId}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    if (data.response?.header?.resultCode !== '00') {
      if (data.response?.header?.resultCode === '99') {
        console.warn(`ASOS 데이터 없음: ${data.response.header.resultMsg}`);
        return null;
      }
      throw new Error(data.response?.header?.resultMsg);
    }
    return data.response.body.items.item[0];
  } catch (error) {
    console.error("지상관측(ASOS) API 오류:", error);
    return null;
  }
};

// 미세먼지 API
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
};

// 태풍 API (변경 없음)
export const getTyphoonInfo = async () => {
    const now = new Date();
    const year = now.getFullYear();
    const url = `/kma-api/1360000/TyphoonInfoService/getTyphoonInfo?serviceKey=${SERVICE_KEY}&pageNo=1&numOfRows=10&dataType=JSON&fromTmFc=${year}0101&toTmFc=${year}1231`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.response?.header?.resultCode !== '00') throw new Error(data.response?.header?.resultMsg);
        if (data.response?.body?.items === "") {
            return [];
        }
        return data.response.body.items.item;
    } catch (error) {
        console.error("태풍정보 API 오류:", error);
        return null;
    }
};
