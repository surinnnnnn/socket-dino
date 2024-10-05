import { sendEvent } from "./Socket.js";
import stage from "../assets/stage.json" with { type: "json" };

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

     loadStageData() {
          this.stages = stage.data; // JSON에서 스테이지 데이터 로드
     }

     update(deltaTime) {
          this.score += deltaTime * 0.001;

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
