// src/api/kma.js

const KMA_API_KEY = import.meta.env.VITE_KMA_API_KEY;

/**
 * 기상청 단기예보 API 호출 함수
 * @returns {Promise<any>} API 응답 데이터
 */
export const getShortTermForecast = async () => {
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let day = now.getDate();
  let hours = now.getHours();

  if (hours < 2) {
    now.setDate(day - 1);
    year = now.getFullYear();
    month = now.getMonth() + 1;
    day = now.getDate();
    hours = 23;
  } else {
    const availableTimes = [2, 5, 8, 11, 14, 17, 20, 23];
    hours = availableTimes.slice().reverse().find(time => time <= hours);
  }
  
  const baseDate = `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`;
  const baseTime = `${String(hours).padStart(2, '0')}00`;
  const nx = 60;
  const ny = 127;

  const url = `/api/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${KMA_API_KEY}&pageNo=1&numOfRows=100&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;

  try {
    const response = await fetch(url);

    // [오류 추적] 응답이 정상이 아닐 경우, 받은 내용을 텍스트로 출력
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API 응답이 정상이 아닙니다. Status:", response.status, "Response:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // [오류 추적] 기상청 자체 에러 코드 확인
    const resultCode = data.response?.header?.resultCode;
    if (resultCode !== '00') {
        const errorMsg = data.response?.header?.resultMsg;
        console.error("기상청 API 오류:", errorMsg, `(코드: ${resultCode})`);
        return null;
    }

    if (data.response?.body?.items?.item) {
        return data.response.body.items.item;
    } else {
        console.error("API 응답에 데이터가 없습니다.", data);
        return null;
    }
  } catch (error) {
    // JSON 파싱 오류 등이 여기서 잡힘
    console.error("단기예보 API 처리 중 예외 발생:", error);
    return null;
  }
};

// 태풍 API 함수 (동일하게 유지)
export const getTyphoonInfo = async () => {
    // ... (이전과 동일한 태풍 API 호출 코드) ...
};
