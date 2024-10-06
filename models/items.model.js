const items = {};

// 아이템 정보는 복수*(여러개 들어올 수 있음)

// 아이템 초기화
export const createItems = (uuid) => {
     items[uuid] = [];
};

export const getItems = (uuid) => {
     return items[uuid];
};

// 다음 스테이지 부터 출몰 아이템 추가
export const setItems = (uuid, stage_id, id, item_id) => {
     return items[uuid].push({ stage_id, id, item_id });
};

export const clearItems = (uuid) => {
     items[uuid] = [];
};
