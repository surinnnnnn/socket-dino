import { CLIENT_VERSION } from "./Constants.js";

const socket = io("http://3.82.14.110:3000/", {
     query: {
          clientVersion: CLIENT_VERSION,
     },
});

let userId = null;

socket.on("connection", (data) => {
     console.log("connection: ", data);
     userId = data.uuid;
});

const sendEvent = (handlerId, payload) => {
     socket.emit("event", {
          userId,
          clientVersion: CLIENT_VERSION,
          handlerId,
          payload,
     });
};

socket.on("response", (response) => {
     console.log("받은 응답:", response);
     // 그냥 응답 받은거 콘솔 찍기 용
});

export { sendEvent, socket };
