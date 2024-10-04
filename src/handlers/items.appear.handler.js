import { getGameAssets } from "../init/assets.js";
import { getItems, setItems, clearItems } from "../../models/items.model.js";

// 아이템 출현
export const itemAppear = (uuid, payload) => {
     //  itemUnlocks, items 데이터 가져오기
     const { itemUnlocks, items } = getGameAssets();

     // 현재 uuid에 해당하는 아이템을 초기화 (새로운 아이템 출현 준비)
     clearItems(uuid);

     // payload에서 stage_id를 추출 (어떤 스테이지에서 아이템이 출현해야 하는지)
     const { nextStageId } = payload;
     console.log("nextStageId:", nextStageId);

     // itemUnlocks에서 해당 스테이지와 일치하는 아이템 배열 찾기
     const unlockedItems = itemUnlocks.data.filter(
          (items) => items.stage_id === nextStageId
     );

     const itemIds = unlockedItems.reduce((acc, item) => {
          return acc.concat(item.item_id); // item_id 배열을 합칩니다.
     }, []);
     // items에서 해당 unlockedItems.item_id와 일치하는 아이템  배열 만들기
     // itemInfo ex) { "id": 1000, "score": 0 }
     const itemInfo = items.data.filter((item) => itemIds.includes(item.id));

     return { status: "success", itemInfo };
};
