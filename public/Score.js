import { sendEvent, socket } from "./Socket.js";
import stage from "../assets/stage.json" with { type: "json" };

class Score {
     score = 0;
     HIGH_SCORE_KEY = "highScore";
     stageChange = true;
     currentStageId = 1000;
     highScore = 0; // 초기화

     constructor(ctx, scaleRatio, itemController) {
          this.ctx = ctx;
          this.canvas = ctx.canvas;
          this.scaleRatio = scaleRatio;
          this.itemController = itemController;
          this.stages = [];
          this.stageNum = 1;

          this.loadStageData();

          socket.on("response", (response) => {
               if (response.broadcast) {
                    this.handleBroadcast(response);
               }
          });
     }

     loadStageData() {
          if (stage.data) {
               this.stages = stage.data; // JSON에서 스테이지 데이터 로드
          } else {
               console.error("Stage data not found.");
          }
     }

     update(deltaTime) {
          this.score += deltaTime * 0.01;

          const currentStageData = this.stages.find(
               (stage) => this.score >= stage.score
          );
          const nextStageData = this.stages.find(
               (stage) => this.score < stage.score
          );

          // 점수가 다음 스테이지의 조건에 맞을 때만 스테이지 변경
          if (
               nextStageData &&
               this.score >= nextStageData.score - 1 &&
               this.stageChange
          ) {
               const newStageId = nextStageData.id;

               // 서버로 스테이지 변경 메시지 전송
               sendEvent(11, {
                    currentStage: this.currentStageId,
                    targetStage: newStageId,
               });

               // 아이템 컨트롤러에 스테이지 변경 알림
               this.itemController.changeStage(newStageId);
               this.currentStageId = newStageId;
               this.stageNum += 1;

               this.stageChange = false; // 스테이지 변경 후 중복 요청 방지

               // 스테이지 변경 후 일정 시간 후에 다시 활성화
               setTimeout(() => {
                    this.stageChange = true;
               }, 1000); // 1초 후 다시 활성화
          }
     }
     getItem(itemScore) {
          this.score += itemScore;
          console.log("획득 점수:", itemScore);
     }

     reset() {
          this.score = 0;
          this.currentStageId = 1000;
          this.stageChange = true; // 초기화 시 플래그도 초기화
          this.stageNum = 1;
     }

     setHighScore(finalScore) {
          sendEvent(9, { finalScore: finalScore });
     }

     handleBroadcast(response) {
          this.highScore = response.broadcast;
     }

     getScore() {
          return this.score;
     }

     // 일반 유저 점수
     draw() {
          this.drawScore(this.score, this.canvas.width - 75 * this.scaleRatio);
     }

     drawStageNum() {
          const x = this.canvas.width / 2;
          const y = 20 * this.scaleRatio;
          const fontSize = 30 * this.scaleRatio;
          this.ctx.font = `${fontSize}px serif`;
          this.ctx.fillStyle = "#525250";
          this.ctx.textAlign = "center";

          this.ctx.fillText(`Stage: ${this.stageNum}`, x, y);

          this.ctx.textAlign = "left";
     }

     // 최고 점수
     highScoreDraw() {
          this.drawScore(
               this.highScore,
               this.canvas.width - 200 * this.scaleRatio
          );
     }

     drawScore(score, xPosition) {
          const y = 30 * this.scaleRatio;
          const fontSize = 20 * this.scaleRatio;
          this.ctx.font = `${fontSize}px serif`;
          this.ctx.fillStyle = "#525250";

          const scorePadded = Math.floor(score).toString().padStart(6, "0");
          this.ctx.fillText(scorePadded, xPosition, y);
     }
}

export default Score;
