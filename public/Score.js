import { sendEvent } from "./Socket.js";

class Score {
     score = 0;
     HIGH_SCORE_KEY = "highScore";
     stageChange = true;

     constructor(ctx, scaleRatio, itemController) {
          this.ctx = ctx;
          this.canvas = ctx.canvas;
          this.scaleRatio = scaleRatio;
          this.itemController = itemController;
          this.currentStageId = 1000;
          this.stages = [];
          this.loadStageData();
     }

     async loadStageData() {
          try {
               const response = await fetch("/stage.json"); // JSON 파일 요청
               if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
               }
               const data = await response.json();
               this.stages = data.data; // 스테이지 데이터를 저장
          } catch (error) {
               console.error("Failed to load stage data:", error);
          }
     }

     update(deltaTime) {
          this.score += deltaTime * 0.001;
          // 점수가 10점 쌓일 때마다 서버에 메시지 전송

          const currentStageData = this.stages.find(
               (stage) => this.score >= stage.score
          );
          const nextStageData = this.stages.find(
               (stage) => this.score < stage.score
          );

          // 점수가 다음 스테이지의 조건에 맞을 때만 스테이지 변경
          if (
               currentStageData &&
               nextStageData &&
               Math.floor(this.score) % 10 === 0 &&
               this.score !== 0 &&
               this.stageChange
          ) {
               this.stageChange = false;

               // 새로운 스테이지 ID
               const newStageId = nextStageData.id;

               // 서버로 스테이지 변경 메시지 전송
               sendEvent(11, {
                    currentStage: this.currentStageId,
                    targetStage: newStageId,
               });

               // 아이템 컨트롤러에 스테이지 변경 알림
               this.itemController.changeStage(newStageId);
               this.currentStageId = newStageId;
          }

          if (Math.floor(this.score) % 10 !== 0) {
               this.stageChange = true;
          }
     }

     getItem(itemScore) {
          this.score += itemScore;
          console.log("회득점수:", itemScore);
     }

     reset() {
          this.score = 0;
          this.currentStageId = 1000;
     }

     setHighScore(finalScore) {
          sendEvent(9, { finalScore });
     }

     getScore() {
          return this.score;
     }

     draw() {
          const highScore =
               Number(localStorage.getItem(this.HIGH_SCORE_KEY)) || 0;
          const y = 20 * this.scaleRatio;

          const fontSize = 20 * this.scaleRatio;
          this.ctx.font = `${fontSize}px serif`;
          this.ctx.fillStyle = "#525250";

          const scoreX = this.canvas.width - 75 * this.scaleRatio;
          const highScoreX = scoreX - 125 * this.scaleRatio;

          const scorePadded = Math.floor(this.score)
               .toString()
               .padStart(6, "0");
          const highScorePadded = highScore.toString().padStart(6, "0");

          this.ctx.fillText(scorePadded, scoreX, y);
          this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
     }
}

export default Score;
