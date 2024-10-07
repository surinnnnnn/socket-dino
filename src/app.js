import express from "express";
import { createServer } from "http";
import initSocket from "./init/socket.js";
import { loadGameAssets } from "./init/assets.js";
import { client, connectClient } from "./init/DBconnect.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const server = createServer(app);

const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// ㄴ> payload 를 자동으로 파싱해주는 미들웨어: 중첩객체(배열 또는 객체)의 처리를 제한한다.

app.use("/assets", express.static("assets"));
app.use(express.static(path.join(__dirname, "../public")));

initSocket(server);

app.get("/", (req, res) => {
     res.sendFile(path.join(__dirname, "../public", "index.html"));
});
server.listen(PORT, async () => {
     console.log(`Server is running on port ${PORT}`);

     try {
          await connectClient();
          console.log("Redis 연결 성공");

          const assets = await loadGameAssets();
          console.log(assets);
          console.log("Assets 로드 성공");
     } catch (error) {
          console.error("Failed to load game assets:", error);
     }
});

client;
