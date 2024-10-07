import { setData, getData } from "../init/DBconnect.js";

// 모든 유저의 최고 점수를 저장할 키
const HIGH_SCORE_KEY = "highScore";

// 최고 점수를 업뎃하는 함수
export const updateHighScore = async (uuid, payload) => {
     try {
          const { finalScore } = payload;
          const currentHighScoredata = await getData(HIGH_SCORE_KEY);

          const parsedData = JSON.parse(currentHighScoredata); // 문자열을 객체로 변환
          let score = 0;
          if (parsedData) {
               score = parsedData.score;
          }

          const currentHighScoreValue = Number(score) || 0;

          // 새로운 점수가 현재 최고 점수보다 높은 경우에만 업데이트
          if (finalScore > currentHighScoreValue) {
               const newHighScoreData = JSON.stringify({
                    uuid,
                    score: finalScore,
               });
               await setData(HIGH_SCORE_KEY, newHighScoreData);

               return {
                    status: "success",
                    broadcast: true,
                    score: Math.floor(finalScore),
               };
          } else {
               return { status: "no_update", score: currentHighScoreValue };
          }
     } catch (error) {
          console.error("Error saving high score:", error);
          return { status: "error", message: error.message };
     }
};

// 최고 점수를 레디스에서 조회하는 함수+ 브로드 캐스팅
export const getHighScore = async (uuid, payload) => {
     try {
          const data = await getData(HIGH_SCORE_KEY);
          console.log("data:", data);
          if (data) {
               const parsedData = JSON.parse(data); // 문자열을 객체로 변환
               const score = parsedData.score;
               return {
                    status: "success",
                    broadcast: Math.floor(Number(score)) || 0,
               };
          } else {
               return {
                    status: "success",
                    broadcast: 0,
               };
          }
     } catch (error) {
          console.error("Error retrieving high score:", error);
          return { status: "error", message: error.message };
     }
};
