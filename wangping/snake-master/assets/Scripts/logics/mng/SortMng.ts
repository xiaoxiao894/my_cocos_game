import { Component, _decorator } from "cc";

const { ccclass, property } = _decorator;

/**
 * 排序
 */
@ccclass
export default class SortMng extends Component {

    private _frameCount: number = 0;

    update(dt) {
        if (++this._frameCount % 6 == 0) {
            this._frameCount = 0
            this.sortChildrenByY();
        }
    }

    private sortChildrenByY() {
        let listToSort = this.node.children.slice();
        listToSort.sort(function (a, b) {
            return b.getPosition().y - a.getPosition().y;
        });

        // console.log("排序::" , listToSort.length)
        for (let i = 0; i < listToSort.length; ++i) {
            let node = listToSort[i];
            if (node.active) {
                node.setSiblingIndex(i + 1);
            }
        }
    }
}
