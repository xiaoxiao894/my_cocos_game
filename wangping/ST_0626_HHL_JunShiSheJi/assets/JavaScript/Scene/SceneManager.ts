
import { _decorator, Camera, Component,  instantiate,  Node,  Prefab, RigidBody, Vec3,  ICollisionEvent, Quat,  CCFloat, Collider } from 'cc';

import { EntityTypeEnum, PrefabPathEnum } from '../Enum/Enum';
import { DataManager } from '../Globel/DataManager';
import { ResourceManager } from '../Globel/ResourceManager';
import { Bullet } from '../Type/Type';
import super_html_playable from '../Common/super_html_playable';
import { EnemyItem } from '../Enemy/EnemyItem';
import { MathUtils } from '../Utils/MathUtils';
import GameUtils from '../Utils/GameUtils';
import { SoundManager } from '../Globel/SoundManager';

export const BulletDeadTime: number = 10;

const { ccclass, property } = _decorator;

@ccclass('SceneManager')
export class SceneManager extends Component {

    @property(Node)
    threeDNode: Node = null;

    @property(Camera)
    camera: Camera = null;

    @property({type:Node,tooltip:"子弹的父节点,移动会修改子弹初始位置"})
    bulletParent: Node = null;

    @property({type:CCFloat,tooltip:"子弹的速度"})
    bulletSpeed: number = 2;

    private _bullet: Bullet = null;

    onLoad() {
        const storeIOS = "https://apps.apple.com/us/app/stormshot2-boom-blast/id6532591623?ct=Tap33752560";
        const storeANDROID = "https://play.google.com/store/apps/details?id=com.funplus.st.region";
        super_html_playable.set_google_play_url(storeANDROID);
        super_html_playable.set_app_store_url(storeIOS);

        DataManager.Instance.sceneMananger = this;
    }
 
    async start() {

        await this.loadRes();
        this.initGame();
        
    }

    async loadRes() {
        const list: Promise<void>[] = [];

        for (const type in PrefabPathEnum) {
            const loadPrefabPromise = ResourceManager.Instance.loadRes(PrefabPathEnum[type], Prefab).then((prefab) => {
                DataManager.Instance.prefabMap.set(type, prefab);
            });
            list.push(loadPrefabPromise);
        }

        await Promise.all(list);
    }

    async initGame() {
    //     PhysicsSystem.instance.debugDrawFlags = EPhysicsDrawFlags.WIRE_FRAME
    // | EPhysicsDrawFlags.AABB
    // | EPhysicsDrawFlags.CONSTRAINT;
        
        DataManager.Instance.enemyManger.init();
        //预加载音乐音效
        SoundManager.inst.preloadAudioClips();
    }

    // 发射子弹
    public fireBullet(targetPos:Vec3) {
        const bulletPrefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.Bullet);
        const node = instantiate(bulletPrefab);
        this.bulletParent.addChild(node);
        node.active = true;

        node.setPosition(new Vec3(0,0,0)); // 设置子弹的初始位置
        //方向
        let direction: Vec3 = new Vec3();
        Vec3.subtract(direction, targetPos, node.getWorldPosition().clone());
        direction.normalize();
        let quat:Quat = MathUtils.vectorToRotation(direction.clone());
        node.setWorldRotation(quat);
        let angle:Vec3 = node.eulerAngles;
        angle.y+=90;
        node.eulerAngles = angle;
        const velocity = new Vec3();
        Vec3.multiplyScalar(velocity, direction, this.bulletSpeed);
        const collider = node.getComponent(Collider);
        if (collider) {
            collider.on('onCollisionEnter', this.onCollisionEnter, this);
        }

        const rigidBody = node.getComponent(RigidBody);
        if (rigidBody) {
            rigidBody.useGravity = false;
            rigidBody.linearDamping = 0;        // 线性阻尼
            rigidBody.angularDamping = 0;       // 旋转阻力
        }

        this._bullet = { node: node, velocity: velocity};
    }

    //  子弹和其他物体发生碰撞
    onCollisionEnter(event: ICollisionEvent) {
        if (!this._bullet) return;

        const otherCollider = event.otherCollider;
        const otherNode = otherCollider.node; // 被击中的节点

        //死人动画
        let enemyItem: EnemyItem = GameUtils.getComponentInParent(otherNode, EnemyItem);
        if (enemyItem) {
            let pos: Vec3 = new Vec3();
            event.contacts[0].getWorldPointOnB(pos);
            let headShot:boolean = false;
            //判断爆头
            if(pos.y>enemyItem.neckNode.worldPosition.y){
                console.log("爆头");
                headShot = true;
            }
            enemyItem.dead(headShot,pos);
        }

        this._bullet.node.destroy();
        this._bullet = null;
        this.scheduleOnce(()=>{
            DataManager.Instance.UIManager.showGameEnd();
        },3);
    }

    public getBulletPos(): Vec3 {
        if(this._bullet){
            return this._bullet.node.worldPosition.clone();
        }else{
            return null;
        }
    }

    update(dt: number) {
        if (this._bullet) {
            if (this._bullet.node && this._bullet.node.active ) {
                let position = this._bullet.node.position;
                let deltaMovement = new Vec3();

                Vec3.multiplyScalar(deltaMovement, this._bullet.velocity, dt * 2);  // 速度乘以时间间隔和移动速度

                Vec3.add(position, position, deltaMovement);

                this._bullet.node.setPosition(position); // 设置新的位置
            }
        }

    }
}

