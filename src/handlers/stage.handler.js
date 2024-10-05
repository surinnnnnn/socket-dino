import { getStage, setStage } from "../../models/stage.model.js";
import { getGameAssets } from "../init/assets.js";

export const moveStageHandler = (uuid, payload) => {
     // 유저의 ID와 스테이지 이동 관련 데이터를 받아 스테이지를 변경
     let currentStages = getStage(uuid);
     // 해당 사용자의 현재 스테이지 정보 가져옴

     if (!currentStages.length) {
          return { status: "fail", message: "No stages found for user" };
     }

     currentStages.sort((a, b) => a.id - b.id);

     const currentStageId = currentStages[currentStages.length - 1].id;

     if (currentStageId !== payload.currentStage) {
          return { status: "fail", message: "Current stage mismatch" };
     }

     // 시간 검증
     const serverTime = Date.now();
     const elapsedTime = (serverTime - currentStages.timestamp) / 1000; // 초 단위로 계산
     if (elapsedTime < 90 || elapsedTime > 120) {
          return { status: "fail", message: "Invalid elapsed time" };
     }

     const { stages } = getGameAssets();
     // assets 폴더 stage.json 에서 스테이지 정보 가져옴
     if (!stages.data.some((stage) => stage.id === payload.targetStage)) {
          return { status: "fail", message: "Target stage does not exist" };
     }
     // 페이로드.타겟스테이지(다음스테이지) 에 해당하는 스테이지 존재하는지 확인 없으면 실패 반환

     setStage(uuid, payload.targetStage);
     const newStages = getStage(uuid); // 변경된 스테이지 다시 가져옴

     return {
          status: "success",
          message: "Stage updated successfully",
          stage: newStages[newStages.length - 1].id,
     };
};
