import { getGameAssets } from "../init/assets.js";
import { clearItems } from "../../models/items.model.js";

// 아이템 출현
export const itemAppear = (uuid, payload) => {
     // itemUnlocks, items 데이터 가져오기
     const { itemUnlocks, items } = getGameAssets();

     // 현재 uuid에 해당하는 아이템을 초기화 (새로운 아이템 출현 준비)
     clearItems(uuid);

     // payload에서 stage_id를 추출 (어떤 스테이지에서 아이템이 출현해야 하는지)
     const { nextStageId } = payload;
     console.log("nextStageId:", nextStageId);

     // itemUnlocks에서 해당 스테이지와 일치하는 아이템 객체 찾기
     const unlockedItems = itemUnlocks.data.filter(
          (item) => item.stage_id === nextStageId
     );

     // unlockedItems에서 랜덤으로 하나의 아이템 선택
     if (unlockedItems.length === 0) {
          return {
               status: "fail",
               message: "No unlocked items for this stage",
          };
     }

     const selectedItem = unlockedItems[0];
     // console.log("출현가능:", selectedItem);
     // 선택한 아이템의 정보를 items에서 찾기
     const randomIndex = Math.floor(
          Math.random() * selectedItem.item_id.length
     );

     const itemId = selectedItem.item_id[randomIndex];
     const itemInfo = items.data.find((item) => itemId === item.id);

     if (!itemInfo) {
          return { status: "fail", message: "Item information not found" };
     }
     // console.log("랜덤픽:", itemInfo);
     return { status: "success", itemInfo };
};
