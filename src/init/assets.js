import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
// fileURLToPath는 URL을 파일 시스템 경로로 변환하는 함수

// assets 폴더에서 파일을 읽어오려고 밑의 과정 거침
const __filename = fileURLToPath(import.meta.url);
// import.meta.url은 현재파일의 절대경로 URL을 나타내는 문자열
// fileURLToPath는 URL 문자열을 파일 시스템의 경로로 변환
const __dirname = path.dirname(__filename);
// path.dirname() 함수는 파일 경로에서 디렉토리 경로만 추출 (파일 이름을 제외한 디렉토리의 전체 경로)
const basePath = path.join(__dirname, "../../public/assets");
// __dirname과 ../../assets를 결합하여 현재 파일의 폴더 경로에서 'assets' 디렉토리로 이동하는 경로

let gameAssets = {}; //전역 변수 선언, 게임데이터 추출용함수

const readFileAsync = (filename) => {
     //비동기로 파일 읽어오려고 promise 적용(3개 전부 읽어 올때 까지 대기)
     return new Promise((resolve, reject) => {
          fs.readFile(path.join(basePath, filename), "utf8", (err, data) => {
               //readFile(읽을 파일 있는 경로, 옵션:utf8(우리가 읽을 수 있는 문자로 바꿔줌), 콜백 )
               if (err) {
                    reject(err);
                    return;
               }
               resolve(JSON.parse(data)); // 데이터를 json 형태로 바꿔서 반환
          });
     });
};

export const loadGameAssets = async () => {
     try {
          //병렬로 파일 읽어오려고 promise 적용(3개 전부 동시에 읽기 시작)
          const [stages, items, itemUnlocks] = await Promise.all([
               readFileAsync("stage.json"),
               readFileAsync("item.json"),
               readFileAsync("item_unlock.json"),
          ]);
          gameAssets = { stages, items, itemUnlocks };
          return gameAssets;
     } catch (error) {
          throw new Error("Failed to load game assets: " + error.message);
     }
};

export const getGameAssets = () => {
     return gameAssets;
}; // 게임데이터 추출용함수 export
