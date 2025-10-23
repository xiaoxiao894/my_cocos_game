import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GlobeVariable')
export class GlobeVariable {
    public static google_play = "https://www.google.com/";
    public static appstore = "https://www.google.com/";
    public static errorNmuLimit = 3;
    public static clickNumLimt  = 15;
    public static curErrorNmuLimit = 0;
    public static curClickNumLimt  = 0;
    public static prefabPath = {
        // 麻将路径
        mahjongItem: 'prefabs/item',
        // 麻将特效路径
        mahjongEffect: 'prefabs/effectNode',
    }
    public static prefabPoolName = {
        // 麻将路径
        mahjongItem: 'mahjongItem',
        // 麻将特效
        mahjongEffect: 'mahjongEffect',
        // 手牌动画
        handAniPb: 'handAniPb',
    }

}


