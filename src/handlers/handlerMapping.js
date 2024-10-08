import { moveStageHandler } from "./stage.handler.js";
import { gameEnd, gameStart } from "./game.handler.js";
import { itemAppear } from "./items.appear.handler.js";
import { updateHighScore, getHighScore } from "./highsocre.handler.js";

const handlerMappings = {
     // 핸들러 아이디 저장객체
     2: gameStart,
     3: gameEnd,
     8: itemAppear,
     9: updateHighScore,
     10: getHighScore,
     11: moveStageHandler,
};

export default handlerMappings;
