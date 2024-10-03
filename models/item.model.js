const item = {};

// 아이템 정보는 복수*(여러개 들어올 수 있음)

// 아이템 초기화
export const createItem = (uuid) => {
     item[uuid] = [];
};

export const getItem = (uuid) => {
     return item[uuid];
};

export const setItem = (uuid, id, score) => {
     return item[uuid].push({ id, score });
};

export const clearItem = (uuid) => {
     item[uuid] = [];
};
