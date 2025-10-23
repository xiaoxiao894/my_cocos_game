// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator } from "cc";

const { ccclass, property } = _decorator;

@ccclass
export default class JPSCheckTag<T> {

  tag: T;

  constructor(v: T) {
    this.tag = v;
  }

  compare(t: JPSCheckTag<T>): boolean {
    return t.tag == this.tag;
  }
}
