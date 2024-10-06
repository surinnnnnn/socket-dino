//서버가 실행되면서 같이 호출되어야 함수들이 정의될 폴더 init(서버 실행되면 항상 이 폴더의 함수들이 같이 실행됨)

import { Server as SocketIO } from "socket.io";
import registerHandler from "../handlers/register.handler.js";

const initSocket = (server) => {
     const io = new SocketIO();
     io.attach(server);

     registerHandler(io);
};
//attach 메소드: 웹서버와 동시에 웹소켓 연결을 사용할 수 있게 해줌
//이미 존재하는 HTTP 서버를 사용할 때 socket.io 기능을 추가하여 웹소켓을 통한 실시간 통신 지우너
// 새로운 서버를 생성하지 않고 socket.io  기능만 추가할 때 유용
// 파라미터는 최대 2개 (서버객체 or 포트번호, socket.io 설정옵션)
export default initSocket;
