import express from "express";
import { createServer } from "http";
import initSocket from "./init/socket.js";
import { loadGameAssets } from "./init/assets.js";

const app = express();
const server = createServer(app);

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// ㄴ> payload 를 자동으로 파싱해주는 미들웨어: 중첩객체(배열 또는 객체)의 처리를 제한한다.
app.use(express.static("assets"));
app.use(express.static("public"));
initSocket(server);

server.listen(PORT, async () => {
     console.log(`Server is running on port ${PORT}`);

     try {
          const assets = await loadGameAssets();
          console.log(assets);
          console.log("Assets loaded successfully");
     } catch (error) {
          console.error("Failed to load game assets:", error);
     }
});
