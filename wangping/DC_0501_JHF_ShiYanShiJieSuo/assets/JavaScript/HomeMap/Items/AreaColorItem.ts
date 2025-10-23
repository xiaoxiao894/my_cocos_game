import { _decorator, Collider, Color, Component, ITriggerEvent, Node, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AreaColorItem')
export class AreaColorItem extends Component {

    //药剂绿色节点
    @property(Sprite)
    di: Sprite = null;

    @property(Sprite)
    kuang: Sprite = null;

    protected onEnable(): void {
        this.node.getComponent(Collider).on('onTriggerEnter', this.onAreaEnter, this);
        this.node.getComponent(Collider).on('onTriggerExit', this.onAreaExit, this);
    }

    protected onDisable(): void {
        this.node.getComponent(Collider).off('onTriggerEnter', this.onAreaEnter, this);
        this.node.getComponent(Collider).off('onTriggerExit', this.onAreaExit, this);
    }

    start() {

    }

    update(deltaTime: number) {
        
    }

    private onAreaEnter(event: ITriggerEvent) {
        this.di.color = new Color().fromHEX("#ABC73AC8");
        this.kuang.color = new Color().fromHEX("#00FC1E");
    }

    private onAreaExit(e: ITriggerEvent) {
        this.di.color = new Color().fromHEX("#FFFFFF8C");
        this.kuang.color = new Color().fromHEX("#FFFFFF");
    }
}


