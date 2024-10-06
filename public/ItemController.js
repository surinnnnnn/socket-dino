import Item from "./Item.js";
import { sendEvent, socket } from "./Socket.js";

class ItemController {
     INTERVAL_MIN = 0;
     INTERVAL_MAX = 12000;

     nextInterval = null;
     items = [];
     stageChange = true;

     constructor(ctx, itemImages, scaleRatio, speed) {
          this.ctx = ctx;
          this.canvas = ctx.canvas;
          this.itemImages = itemImages;
          this.scaleRatio = scaleRatio;
          this.speed = speed;
          this.currentStageId = null; // 초기값을 null로 설정

          this.setNextItemTime();
          this.totalItemScore = 0;

          // 서버 응답을 처리하는 리스너
          socket.on("response", (response) => {
               this.handleItemResponse(response); // 아이템 응답받고 로직 처리
          });
     }

     setNextItemTime() {
          this.nextInterval = this.getRandomNumber(
               this.INTERVAL_MIN,
               this.INTERVAL_MAX
          );
     }

     getRandomNumber(min, max) {
          return Math.floor(Math.random() * (max - min + 1) + min);
     }

     // 스테이지 변경 시 아이템 생성
     changeStage(newStageId) {
          if (this.currentStageId !== newStageId) {
               this.currentStageId = newStageId; // 스테이지 ID 업데이트
               this.stageChange = true;

               this.createItem(); // 새 아이템 생성 요청
          }
     }

     createItem() {
          if (this.currentStageId) {
               this.stageChange = false;

               // 서버로 현재 스테이지 ID를 보내고 아이템 ID 배열을 받아옴
               sendEvent(8, { StageId: this.currentStageId });
          }
     }

     handleItemResponse(response) {
          if (response.itemInfo) {
               const selectedItem = response.itemInfo;
               const itemAtt = this.itemImages.find(
                    (image) => image.id === selectedItem.id
               );

               if (itemAtt) {
                    const x = this.canvas.width * 1.5; // 화면 오른쪽에서 아이템 출현
                    const y = this.getRandomNumber(
                         10,
                         this.canvas.height - itemAtt.height
                    );
                    const itemScore = selectedItem.score;

                    // 아이템 객체 생성
                    const item = new Item(
                         this.ctx,
                         itemAtt.id,
                         x,
                         y,
                         itemAtt.width,
                         itemAtt.height,
                         itemAtt.image,
                         itemScore
                    );

                    // 생성된 아이템을 items 배열에 추가
                    this.items.push(item);
               } else {
                    console.error(
                         "Item info not found for ID:",
                         selectedItem.id
                    );
               }
          }
     }

     update(gameSpeed, deltaTime) {
          if (this.nextInterval <= 0) {
               if (this.currentStageId) {
                    this.createItem(); // 현재 스테이지 ID가 유효할 경우 아이템 생성
               }
               this.setNextItemTime(); // 다음 아이템 생성 시간 설정
          }

          this.nextInterval -= deltaTime;

          this.items.forEach((item) => {
               item.update(this.speed, gameSpeed, deltaTime, this.scaleRatio);
          });

          // 아이템이 화면 밖으로 나가면 제거
          this.items = this.items.filter((item) => item.x > -item.width);
     }

     draw() {
          this.items.forEach((item) => item.draw());
     }

     collideWith(sprite) {
          const collidedItem = this.items.find((item) =>
               item.collideWith(sprite)
          );

          if (collidedItem) {
               this.ctx.clearRect(
                    collidedItem.x,
                    collidedItem.y,
                    collidedItem.width,
                    collidedItem.height,
                    collidedItem.score
               );
               this.totalItemScore += collidedItem.score;

               const itemScore = collidedItem.score;
               return { itemScore };
          }
     }

     reset() {
          this.items = [];
          this.currentStageId = 1000; // 초기 스테이지 ID
          this.stageChange = true;
          this.totalItemScore = 0;
     }
}

export default ItemController;
