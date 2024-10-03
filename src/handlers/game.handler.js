import { getGameAssets } from "../init/assets.js";
import { getStage, setStage, clearStage } from "../../models/stage.model.js";
import { getItems, setItems, clearItems } from "../../models/items.model.js";

export const gameStart = (uuid, payload) => {
     // 유저의 스테이지 초기화
     const { stages, itemUnlocks } = getGameAssets();
     // getGameAssets 함수 실행하여 게임 스테이지 데이터 반환 이 데이터 중
     // stage 추출
     clearStage(uuid);
     clearItems(uuid);

     setStage(uuid, stages.data[0].id, payload.timestamp);
     setItems(
          uuid,
          stages.data[0].id,
          itemUnlocks.data[0].id,
          itemUnlocks.data[0].item_id
     );

     console.log("Stage: ", getStage(uuid), getItems(uuid));

     return { status: "success" };
};
export const gameEnd = (uuid, payload) => {
     const { timestamp: gameEndTime, score } = payload;
     const stages = getStage(uuid);

     if (!stages.length) {
          return { status: "fail", message: "No stages found for user" };
     }

     let totalScore = 0;
     stages.forEach((stage, index) => {
          let stageEndTime;
          if (index === stages.length - 1) {
               stageEndTime = gameEndTime;
          } else {
               stageEndTime = stages[index + 1].timestamp;
          }
          const stageDuration = (stageEndTime - stage.timestamp) / 1000; // 스테이지 지속 시간 (초 단위)
          totalScore += stageDuration; // 1초당 1점
     });

     if (Math.abs(score - totalScore) > 5) {
          return { status: "fail", message: "Score verification failed" };
     }

     return { status: "success", message: "Game ended successfully", score };
};
