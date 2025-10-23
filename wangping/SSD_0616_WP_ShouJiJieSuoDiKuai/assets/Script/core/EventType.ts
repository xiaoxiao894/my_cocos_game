// assets/scripts/framework/EventType.ts

/**
 * 事件类型定义
 * 建议将所有事件名称集中管理，避免拼写错误
 */
export enum EventType {

     ENTITY_MOVE_TREE = "ENTITY_MOVE_TREE",//触发移动到树的条件
     ENTITY_MOVE_HAND_OVER = "ENTITY_MOVE_HAND_OVER",//点击交付

     ENTITY_HAND_OVER_ADD = "ENTITY_HAND_OVER_ADD",//点击交付增长点
     ENTITY_TREE_COMPLATE = "ENTITY_TREE_COMPLATE",//交付完成

     ENTITY_TREE_TRANSMIT = "ENTITY_TREE_TRANSMIT",//传送下个地块

     ENTITY_CORN_CUT = "ENTITY_CORN_CUT",  //开始收割玉米
     ENTITY_ENEMY_TRANSMIT = "ENTITY_ENEMY_TRANSMIT",  //传送敌人地块开启

     ENTITY_ENEMY_DIE = "ENTITY_ENEMY_DIE",  //敌人死亡触发事件
     ENTITY_ENEMY_HAND_OVER = "ENTITY_ENEMY_HAND_OVER",//点击敌人交付点


     ENTITY_CORNHAND_OVER_ADD = "ENTITY_CORNHAND_OVER_ADD",//点击交增长点
     ENTITY_CORN_COMPLATE = "ENTITY_CORN_COMPLATE",//交付完成
     ENTITY_CLICK_ENEMY = "ENTITY_CLICK_ENEMY", //点击敌人进行攻击

     ENTITY_SHOW_TREEHANDE = "ENTITY_SHOW_TREEHANDE", //点击敌人进行攻击

     ENTITY_ALL_DIE = "ENTITY_ALL_DIE",//所有怪死亡出发的事件
     SHOW_ENEMY = "SHOW_ENEMY",  //显示怪物

     GAME_OVER = "GAME_OVER",//游戏结束

     ENTITY_HAND_OVER_NO = "ENTITY_HAND_OVER_NO",//点击交付
}



