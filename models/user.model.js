// 저장소 만들기(uuid, socketId)
// 원래 DB에 직접 입력

const users = [];

export const addUser = (user) => {
     users.push(user);
};

export const getUser = () => {
     return users;
};

// 유저 나갈 때

export const removeUser = (socketId) => {
     const index = users.findIndex((user) => user.socketId === socketId);
     if (index !== -1) {
          return users.splice(index, 1)[0];
     } // 유저가 접속 중이라면 index 0부터 1개 지움
};
//setter, getter
