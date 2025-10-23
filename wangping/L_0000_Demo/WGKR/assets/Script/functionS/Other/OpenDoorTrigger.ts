import { _decorator, Animation, BoxCollider, CCString, Component, ITriggerEvent, Node, TERRAIN_SOUTH_INDEX, tween, Vec3 } from 'cc';
import ColliderTag, { COLLIDE_TYPE } from '../Battle/CollectBattleTarger/ColliderTag';
import AudioManager, { SoundEnum } from '../../Base/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('OpenDoorTrigger')
export class OpenDoorTrigger extends Component {


    @property(Animation)
    public door: Animation;

    private tirgger: BoxCollider

    private state: boolean = false;

    private _temp: Vec3 = new Vec3(0, -0.025, 0);

    @property(CCString)
    public closeStr: string = "Anim_door_close";
    start() {
        this.tirgger = this.node.getComponent(BoxCollider);
        this.tirgger.on('onTriggerEnter', this.onTriggerEnter, this);
        this.tirgger.on('onTriggerExit', this.onTriggerExit, this);
    }

    private onTriggerEnter(event: ITriggerEvent) {
        let tag = event.otherCollider.getComponent(ColliderTag);
        console.log("开门");
        if (tag.tag == COLLIDE_TYPE.HERO) {
            if (!this.state) {
                this.state = true;
                this.door.play();
                // tween(this.door.position).to(0.2, { y: -0.025 }).start();
                AudioManager.inst.playOneShot(SoundEnum.Sound_door);
            }
        }
    }

    private onTriggerExit(event: ITriggerEvent) {
        let tag = event.otherCollider.getComponent(ColliderTag);
        console.log("关门");

        if (tag.tag == COLLIDE_TYPE.HERO) {
            if (this.state) {
                this.state = false;
                this.door.play(this.closeStr);

            }
        }
    }




}


