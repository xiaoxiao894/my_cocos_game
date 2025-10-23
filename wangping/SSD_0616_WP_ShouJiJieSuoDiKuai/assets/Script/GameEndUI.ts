import { _decorator, Component, Node } from 'cc';
import super_html_playable from '../super_html_playable';
const { ccclass, property } = _decorator;

@ccclass('GameEndUI')
export class GameEndUI extends Component {

    downlodBtnCallBack() {
        console.log("点击了下载按钮")
        super_html_playable.download();
    }
    // start() {

    // }

    // update(deltaTime: number) {

    // }
}


