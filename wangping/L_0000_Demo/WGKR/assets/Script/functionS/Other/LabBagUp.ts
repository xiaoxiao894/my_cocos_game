import { _decorator, Component, Label, Node } from 'cc';
import TweenTool from '../../Tool/TweenTool';
import { BagBase } from '../Bag/Base/BagBase';
const { ccclass, property } = _decorator;

@ccclass('LabBagUp')
export class LabBagUp extends Component {

    @property(BagBase)
    bagBase: BagBase;

    private count: number = 0;

    private shake: boolean = false;
    private lab: Label;
    protected onLoad(): void {
        this.lab = this.node.getComponent(Label);
        this.count = this.bagBase.node.children.length;

        this.lab.string = this.count.toString();
    }


    protected update(dt: number): void {
        let count = this.bagBase.propCount;
        if (this.count != count) {
            this.count = count;
            this.lab.string = this.count.toString();
            if (!this.shake) {
                this.shake = true;
                TweenTool.scaleShake(this.node, 0, 0.05).call(() => {
                    this.shake = false;
                }).start();
            }
        }
    }


}


