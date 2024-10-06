import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config(); // 환경 변수 설정

// 레디스 클라이언트 생성
export const client = createClient({
     password: process.env.REDIS_PASSWORD,
     socket: {
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT,
     },
});

client.on("error", (err) => {
     console.error("레디스 에러:", err);
});

client.on("connect", () => {
     console.log("레디스 서버에 연결됨");
});

// 내 서버에 레디스 연결
export async function connectClient() {
     if (!client.isOpen) {
          // true: 현재 Redis 서버에 연결되어 있는 상태
          try {
               await client.connect();
               console.log("Redis client connected");
          } catch (error) {
               console.error("Error connecting to Redis:", error);
          }
     }
}

// 클라이언트 연결
await client.connect(); // 클라이언트 연결

// 데이터 저장 함수
export async function setData(key, value) {
     try {
          const reply = await client.set(key, value); // Promise 기반으로 변경
          return reply;
     } catch (error) {
          console.error("Error saving data to Redis:", error);
          throw error;
     }
}

// 데이터 조회 함수
export async function getData(key) {
     try {
          const value = await client.get(key);

          return value;
     } catch (error) {
          console.error("Error retrieving data from Redis:", error);
          throw error;
     }
}
// 데이터 제거 함수
export async function deleteData(key) {
     try {
          const reply = await client.del(key);
          return reply; // 삭제된 키의 수를 반환
     } catch (error) {
          console.error("Error deleting data from Redis:", error);
          throw error;
     }
}

// 클라이언트 종료 함수
export function quitClient() {
     client.quit();
}
