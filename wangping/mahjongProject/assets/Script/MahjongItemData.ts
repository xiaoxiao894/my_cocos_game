import { _decorator, Component, Node } from 'cc';
import { App } from './App';
const { ccclass, property } = _decorator;

@ccclass('MahjongItemData')
export class MahjongItemData  {
    type: string; // 元素类型（一万 一同 东风 等）
    isRemoved: boolean = false; // 是否已消除
    node: Node | null = null; // 对应节点
    row: number; // 所在行
    col: number; // 所在列
    selectSate:number = 0; //1 选择正确绿色背景 2 为选择错误红色背景 0 为未选择白色背景
    greenSpriteFrame = "selectBg"// 正确选择的背景图片
    redSpriteFrame = "error_bg"; // 错误选择的背景图片
    whiteSpriteFrame ="white_bg"; // 未选择的背景图片
    constructor(type: string, row: number, col: number) {
        this.type = type;
        this.row = row;
        this.col = col;
    }

    zindex:number = 0;
}


