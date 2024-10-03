// 꼭 필요한 도움을 주는 함수
import { getUser, removeUser } from "../../models/user.model.js";
import { CLIENT_VERSION } from "../constants.js";
import handlerMappings from "./handlerMapping.js";
import { createStage } from "../../models/stage.model.js";

export const handleDisconnect = (socket, uuid) => {
     removeUser(socket.id);
     console.log(`User disconnected: ${socket.id}`);
     console.log(`curernt users:`, getUser());
};

export const handleConnection = (socket, uuid) => {
     console.log(`new user connected: ${uuid} with socketId ${socket.id}`);
     console.log("current users", getUser());
     createStage(uuid);

     socket.emit("connection", { uuid });
     // 클라이언트에 연결 완료 이벤트 전송
};

// 이벤트 핸들러
export const handleEvent = (io, socket, data) => {
     // 전달 받은 data에 clientVersion 확인
     if (!CLIENT_VERSION.includes(data.clientVersion)) {
          // 지원하는 버젼과 만약 일치하는 버전이 없다면 response 이벤트로 fail 결과를 전송합니다.
          socket.emit("response", {
               status: "fail",
               message: "Client version mismatch",
          });
          return;
     }

     const handler = handlerMappings[data.handlerId];
     //data.handlerId(핸들러아이디) 에 해당하는 핸들러를 handlerMapping 에서 찾음
     if (!handler) {
          socket.emit("response", {
               status: "fail",
               message: "Handler not found",
          });
          return;
     }

     const response = handler(data.userId, data.payload);

     if (response.broadcast) {
          io.emit("response", "broadcast");
          return;
     }
     // 핸들러 결과에 response.broadcast있을 시 모든 클라이언트에게 브로드캐스트 메시지 전달

     socket.emit("response", response);
};
