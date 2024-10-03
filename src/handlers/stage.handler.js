import { getStage, setStage } from "../../models/stage.model.js";
import { getGameAssets } from "../init/assets.js";

export const moveStageHandler = (userId, payload) => {
     // 유저의 ID와 스테이지 이동 관련 데이터를 받아 스테이지를 변경
     let currentStages = getStage(userId);
     // 해당 사용자의 현재 스테이지 정보 가져져옴
     console.log("recieved:", currentStages);
     if (!currentStages.length) {
          return { status: "fail", message: "No stages found for user" };
     }
     //현재 스테이지 목록이 비어있다면 실패 반환 후 종료
     currentStages.sort((a, b) => a.id - b.id);
     // 현재 사용자의 스테이지 목록을 id 순으로 내림차순 정렬(마지막 스테이지 맨위에)
     const currentStageId = currentStages[currentStages.length - 1].id;
     // 마지막 스테이지 id 값

     console.log("recievedpayload:", payload.currentStage);
     if (currentStageId !== payload.currentStage) {
          return { status: "fail", message: "Current stage mismatch" };
     }
     //마지막 스테이지 아이다값과 사용자가 요청한 현재 스테이지의 아이디 값이 일치 하지 않을 때 반환

     // 시간 검증~~~~~~
     const serverTime = Date.now();
     // 밀리 초 단위로 현재 서버 시간 저장
     const elapsedTime = (serverTime - currentStages.timestamp) / 1000; // 초 단위로 계산
     // elapsedTime(경과시간) = (현재 서버 시간 - 이전 스테이지 완료시간)
     if (elapsedTime < 10 || elapsedTime > 10.5) {
          return { status: "fail", message: "Invalid elapsed time" };
          // 스테이지 진행 경과시간이 10~10.5초 사이여야함
     }
     //~~~~~~~~~~~~~

     const { stages } = getGameAssets();
     // assets 폴더 stage.json 에서 스테이지 정보 가져옴
     if (!stages.data.some((stage) => stage.id === payload.targetStage)) {
          return { status: "fail", message: "Target stage does not exist" };
     }
     //페이로드.타겟스테이지(다음스테이지) 에 해당하는 스테이지 존재하는 지 확인 없으면 fail 반환
     setStage(userId, payload.targetStage);
     // 사용자의 현재 스테이지를 요청한 타겟스테이지(다음)로 설정
     return { status: "success" };
     // 검증 성공 시 스테이지 이동 완료를 알리는 성공 상태 반환
};
