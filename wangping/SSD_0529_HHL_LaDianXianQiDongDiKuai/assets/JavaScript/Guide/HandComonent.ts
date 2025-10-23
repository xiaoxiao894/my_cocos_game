import { _decorator, CCInteger, Color, Component, Layers, Node, Sprite, Tween, tween, Vec3, Animation } from 'cc';
import { EventManager } from '../Global/EventManager';
import { EventName } from '../Common/Enum';
const { ccclass, property } = _decorator;

@ccclass('HandComonent')
export class HandComonent extends Component {

    @property(Node)
    handNode: Node = null;
    @property(Node)
    handNodeMove: Node = null;
    // @property(Sprite)
    // slideSprite: Sprite = null;

    @property(Vec3)
    startPos: Vec3 = new Vec3(0, 0, 0);
    @property(Vec3)
    endPos: Vec3 = new Vec3(0, 0, 0);
    @property(CCInteger)
    handScale: number = 0.5;

    private _handTween: Tween<Node> = null;
    private _handTween2: Tween<Node> = null;
    private _handTween1: Tween<Sprite> = null;


    start() {

        //播动画
        // this.handNode.setPosition(this.startPos);
        // this.handNode.active = true;
        // //  this.slideSprite.node.active = true;
        // this.handNode.setScale(0, 0, 0);
        // this._handTween = tween(this.handNode)
        //     .delay(1)
        //     .to(0.1, { scale: new Vec3(this.handScale, this.handScale, 1) })
        //     .call(() => {
        //         this.playLoopAni();
        //     })
        //     .start();
        this.scheduleOnce(() => {
            this.handNode.active = true;
           // this.slideSprite.node.active = true;
            this.node.getComponent(Animation).play();
        }, 0.6)
        // this.node.getComponent(Animation).play();
    }

    protected onEnable(): void {
        EventManager.inst.on(EventName.TouchSceenStart, this.onTouched, this);
    }

    protected onDisable(): void {
        EventManager.inst.off(EventName.TouchSceenStart, this.onTouched, this);
    }

    update(deltaTime: number) {

    }

    // private playLoopAni() {
    //     let tweenHand = tween(this.handNode)
    //         .to(2, { position: this.endPos })
    //         .call(() => {
    //             this.handNode.setPosition(this.startPos);
    //         });
    //     this._handTween = tween(this.handNode)
    //         .repeatForever(tweenHand)
    //         .start();
    // }

    // 拖尾效果
    // private _trailNodes: Node[] = [];
    // private _trailIndex: number = 0;
    // private _trailCount: number = 20;

    // private playLoopAni() {
    //     const spriteFrame = this.handNodeMove.getComponent(Sprite)?.spriteFrame;
    //     if (!spriteFrame) {
    //         return;
    //     }

    //     if (this._trailNodes.length === 0) {
    //         for (let i = 0; i < this._trailCount; i++) {
    //             const trailNode = new Node(`Trail_${i}`);
    //             trailNode.layer = Layers.Enum.UI_2D;
    //             const sprite = trailNode.addComponent(Sprite);
    //             sprite.spriteFrame = spriteFrame;
    //             trailNode.setParent(this.handNode.parent);
    //             trailNode.active = false;
    //             this._trailNodes.push(trailNode);
    //         }
    //     }

    //     let tweenHand = tween(this.handNode)
    //         .to(2, { position: this.endPos })
    //         .call(() => {
    //             this.handNode.setPosition(this.startPos);
    //             // 手指回到起点时隐藏所有轨迹点，清空拖尾
    //             this._trailNodes.forEach(node => node.active = false);
    //             this._trailIndex = 0; // 重置轨迹索引
    //         });

    //     this._handTween = tween(this.handNode)
    //         .repeatForever(tweenHand)
    //         .start();

    //     this.schedule(() => {
    //         this._updateTrail();
    //     }, 0.3);
    // }

    // private _updateTrail() {


    //     const node = this._trailNodes[this._trailIndex];

    //     // 让轨迹点沿手指移动路径形成一条线，位置直接跟随handNode
    //     const pos = this.handNode.getPosition();
    //     node.setPosition(pos.x - 10, pos.y + 60, pos.z);
    //     node.setRotation(this.handNode.getRotation());
    //     // node.setScale(this.handNode.getScale());
    //     node.active = true;

    //     const sprite = node.getComponent(Sprite);
    //     if (sprite) {
    //         sprite.color = new Color(170, 255, 255, 255);
    //         tween(sprite)
    //             .to(1.5, { color: new Color(255, 255, 255, 255) })
    //             .call(() => {
    //                 node.active = false;
    //                 //sprite.color = new Color(255, 255, 255, 255);
    //             })
    //             .start();
    //     }

    //     this._trailIndex = (this._trailIndex + 1) % this._trailCount;
    // }
    private onTouched() {
        this.node.getComponent(Animation).stop();
        this.handNode.active = false;
       // this.slideSprite.node.active = false;
        if (this._handTween) {
            this._handTween.stop();
            this._handTween = null;
            this.handNode.active = false;

        }

    }

}


