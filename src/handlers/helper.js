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
};

// 이벤트 핸들러
export const handleEvent = async (io, socket, data) => {
     if (!CLIENT_VERSION.includes(data.clientVersion)) {
          socket.emit("response", {
               status: "fail",
               message: "Client version mismatch",
          });
          return;
     }

     const handler = handlerMappings[data.handlerId];

     if (!handler) {
          socket.emit("response", {
               status: "fail",
               message: "Handler not found",
          });
          return;
     }

     const response = await handler(data.userId, data.payload);

     if (response.broadcast) {
          io.emit("response", response);
          return;
     }
     // 핸들러 결과에 response.broadcast있을 시 모든 클라이언트에게 브로드캐스트 메시지 전달

     socket.emit("response", response);
};
