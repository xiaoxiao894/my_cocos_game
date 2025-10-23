// assets/scripts/framework/EventType.ts

/**
 * 事件类型定义
 * 建议将所有事件名称集中管理，避免拼写错误
 */
export enum EventType {
    MapFarmland_cloudFadeOut = "MapFarmland_cloudFadeOut", // 云的淡出效果事件 
    MapFarmland_cloudFadeIn = "MapFarmland_cloudFadeIn", // 云的淡入效果事件
    MapFarmland_start       = "MapFarmland_start", //农田启动
   // MapFarmland_palingEffect = "MapFarmland_palingEffect",//木栅栏效果事件
   // MapFarmland_fruitRed     = "MapFarmland_fruitRed",//果实变红
    MapFarmland_fruitGreen    = "MapFarmland_fruitGreen",//果实变绿

    //矿场
    MiningSite_cloudFadeOut = "MiningSite_cloudFadeOut", // 云的的淡出效果事件 
    MiningSite_cloudFadeIn = "MiningSite_cloudFadeIn", // 云的淡入效果事件
    MiningSite_start       = "MiningSite_start", //矿场启动

    //伐木场
    Lumberyard_cloudFadeOut = "Lumberyard_cloudFadeOut", // 云的的淡出效果事件 
    Lumberyard_cloudFadeIn = "Lumberyard_cloudFadeIn", // 云的淡入效果事件
    Lumberyard_start       = "Lumberyard_start", //伐木场启动

    //野兽
    MapBeast_cloudFadeOut = "MapBeast_cloudFadeOut",//云的淡出效果事件
    MapBeast_cloudFadeIn = "MapBeast_cloudFadeIn",//云的淡入效果事件
    MapBeast_start  = "MapBeast_start",//开始通电初始怪物死亡
    MapBeast_enemyStart = "MapBeast_enemyStart",//通电后敌人死亡不断出怪
    //野兽 2
    MapBeastB_cloudFadeOut = "MapBeastB_cloudFadeOut", // 云的淡出效果事件 
    MapBeastB_cloudFadeIn = "MapBeastB_cloudFadeIn", // 云的淡入效果事件
    MapBeastB_start    = "MapBeastB_start", //野兽2 通电后开始逻辑

    MapBeastB1_cloudFadeOut = "MapBeastB1_cloudFadeOut", // 云的淡出效果事件 
    MapBeastB1_cloudFadeIn = "MapBeastB1_cloudFadeIn", // 云的淡入效果事件

    MapLand_allCloudFade = "MapLand_allCloudFade", //所有云消失

   // coinNumUpLimit = "coinNumUpLimit",//金币数量达到升级界限
}

//按照解锁顺序排序 数字占位用 改成地块事件前缀
export const PlotName:string[]=["MapFarmland","MiningSite","MapBeast","MapBeastB","Lumberyard","MapBeastB1"];

