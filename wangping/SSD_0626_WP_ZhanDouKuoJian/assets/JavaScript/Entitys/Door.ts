import { _decorator, Collider, Component, ICollisionEvent, Node, tween, Vec3 } from 'cc';
import { GlobeVariable } from '../core/GlobeVariable';
const { ccclass, property } = _decorator;

@ccclass('Door')
export class Door extends Component {

    @property(Collider)
    collider: Collider = null!;

    @property(Node)
    leftDoor:Node = null;

    @property(Node)
    rightDoor:Node = null;

    @property(Number)
    axis:number = 0;  // 0 y 1 z

    @property(Number)
    angle:number = 150;


    start() {

    }

    protected onEnable(): void {
        this.collider?.on("onTriggerEnter", this.onTriggerEnter, this);
        this.collider?.on("onTriggerExit", this.onTriggerExit, this);
    }

    protected onDisable(): void {
        this.collider?.off("onTriggerEnter", this.onTriggerEnter, this);
        this.collider?.off("onTriggerExit", this.onTriggerExit, this);
    }

    update(deltaTime: number) {
        
    }

    // 进入
    onTriggerEnter(event: ICollisionEvent) {
        const otherCollider = event.otherCollider;

        // 执行开门逻辑
        const otherName = otherCollider.node.name;
        if (otherName === GlobeVariable.entifyName.player ||otherName === GlobeVariable.entifyName.Parter) {
            if(this.axis == 0){
                this.openDoor();
            }
            else{
                this.openDoorZ();
            }
        }

        
    }
    openDoor() {
        const duration = 0.3;

        tween(this.leftDoor)
            .to(duration, { eulerAngles: new Vec3(0, -this.angle, 0) }, { easing: 'quadOut' })
            .start();

        tween(this.rightDoor)
            .to(duration, { eulerAngles: new Vec3(0, this.angle, 0) }, { easing: 'quadOut' })
            .start();
    }
    openDoorZ() {
        const duration = 0.3;

        tween(this.leftDoor)
            .to(duration, { eulerAngles: new Vec3(0, 0, -this.angle) }, { easing: 'quadOut' })
            .start();

        tween(this.rightDoor)
            .to(duration, { eulerAngles: new Vec3(0, 0, this.angle) }, { easing: 'quadOut' })
            .start();
    }

    // 离开
    onTriggerExit(event: ICollisionEvent) {
        const otherCollider = event.otherCollider;
        // 执行关门逻辑
        const otherName = otherCollider.node.name;
        if (otherName === GlobeVariable.entifyName.player ||otherName === GlobeVariable.entifyName.Parter) {
            
            this.closeDoor();
        }

    }

    closeDoor() {
        const duration = 0.3;

        tween(this.leftDoor)
            .to(duration, { eulerAngles: new Vec3(0, 0, 0) }, { easing: 'quadOut' })
            .start();

        tween(this.rightDoor)
            .to(duration, { eulerAngles: new Vec3(0, 0, 0) }, { easing: 'quadOut' })
            .start();
    }


}


