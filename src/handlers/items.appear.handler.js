import { getGameAssets } from "../init/assets.js";
import { getItems, setItems, clearItems } from "../../models/items.model.js";

// 아이템 출현
export const itemAppear = (uuid, payload) => {
     //  itemUnlocks 데이터 가져오기
     const { itemUnlocks } = getGameAssets();

     // 현재 uuid에 해당하는 아이템을 초기화 (새로운 아이템 출현 준비)
     clearItems(uuid);

     // payload에서 stage_id를 추출 (어떤 스테이지에서 아이템이 출현해야 하는지)
     const { nextStageId } = payload;
     console.log("nextStageId:", nextStageId);

     // itemUnlocks에서 해당 스테이지와 일치하는 아이템 배열 찾기
     const unlockedItems = itemUnlocks.data.filter(
          (items) => items.stage_id === nextStageId
     );

     console.log("unlockedItems:", unlockedItems);

     // 잠금 해제된 아이템에서 item_id 배열들을 모두 합쳐 아이템 ID 목록을 구성
     const itemIds = unlockedItems.reduce((acc, { item_id }) => {
          return acc.concat(item_id); // item_id 배열을 모두 합쳐서 하나의 배열로 반환
     }, []);

     // console.log("생성된 itemIds:", itemIds);

     // uuid에 할당된 아이템 목록을 반환
     return { status: "success", itemIds };
};
