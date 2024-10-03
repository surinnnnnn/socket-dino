import { moveStageHandler } from "./stage.handler.js";
import { gameEnd, gameStart } from "./game.handler.js";
import { itemAppear } from "./items.appear.handler.js";

const handlerMappings = {
     // 핸들러 아이디 저장객체
     2: gameStart,
     3: gameEnd,
     8: itemAppear,
     11: moveStageHandler,
};

export default handlerMappings;
