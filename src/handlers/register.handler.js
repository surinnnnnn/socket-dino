import { addUser } from "../../models/user.model.js";
import { v4 as uuidv4 } from "uuid";
import { handleDisconnect, handleConnection, handleEvent } from "./helper.js";

const registerHandler = (io) => {
     io.on("connection", (socket) => {
          // 이벤트 처리 uuid 만들기
          // (모든 유저에게 사용 io.on)

          const userUUID = uuidv4();
          addUser({ uuid: userUUID, socketId: socket.id });

          handleConnection(socket, userUUID);

          // 서비스(아이템, 스테이지 이동, 게임오버 등 모든 서비스) 처리
          socket.on("event", (data) => handleEvent(io, socket, data));

          //유저 접속 해제 시 (하나의 유저에만 해당 socket.on 사용)
          socket.on("disconnect", () => handleDisconnect(socket, userUUID));
     });
};

export default registerHandler;
