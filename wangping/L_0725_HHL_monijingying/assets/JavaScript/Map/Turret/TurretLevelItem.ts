import { _decorator, CCInteger,  Vec3,Node, Quat, Animation, CCFloat, Component, CCString } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('TurretLevelItem')
export class TurretLevelItem extends Component {
    @property({type:CCInteger,displayName:"攻击范围"})
    attackRange: number = 30;

    @property({type:CCInteger,displayName:"爆炸范围"})
    explosionRange: number = 8;
    @property({type:CCInteger,displayName:"击退距离"})
    backDistance: number = 2;
    @property({type:CCFloat,displayName:"攻击时间间隔"})
    attackInterval: number = 1.75;
    @property(CCString)
    idleAniName:string = "";
    @property(CCString)
    attackAniName:string = "";
    @property({ type: Animation })
    ani: Animation = null; // 骨骼动画组件

    @property(Node)
    rotationNode:Node = null;

    // 塔发射子弹的位置
    @property(Node)
    bulletPos: Node = null;

    public explosionRangeSquared: number = 0; // 爆炸范围的平方（用于优化距离判断）

    public init(): void {
        this.explosionRangeSquared = this.explosionRange* this.explosionRange;
        this.ani.play(this.idleAniName);
    }

    public attackAni():void{
        this.ani.crossFade(this.attackAniName,0.2);
        this.ani.once(Animation.EventType.FINISHED,()=>{
            this.ani.crossFade(this.idleAniName,0.2);
        });
    }

    /** 旋转到目标方向 */
    public rotateTowards(targetWorldPos: Vec3, dt: number) {
        const currentPos = this.node.worldPosition.clone();
        const dir = new Vec3();
        Vec3.subtract(dir, targetWorldPos, currentPos); // 计算从当前位置到目标位置的方向
        if (dir.lengthSqr() < 0.0001) return; // 距离过近时不旋转
        dir.y = 0; // 保持水平旋转
        dir.normalize();

        // 直接使用指向目标的方向作为视图方向，无需取反
        const targetQuat = new Quat();
        Quat.fromViewUp(targetQuat, dir, Vec3.UP); // 使用dir而非反方向

        const currentQuat = this.rotationNode.worldRotation.clone();
        const resultQuat = new Quat();
        // 平滑插值旋转
        Quat.slerp(resultQuat, currentQuat, targetQuat, Math.min(1, dt * 40));
        this.rotationNode.worldRotation = resultQuat;
    }
    
}


