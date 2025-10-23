import { _decorator, Collider, Component, ITriggerEvent, Node, Vec3 } from 'cc';
import Entity from './Entity';
import { App } from '../App';
import { EnemySpider } from './EnemySpider';
const { ccclass, property } = _decorator;

@ccclass('PlayerBeetle')
export class PlayerBeetle extends Entity {
     hp = 2;
     maxHp = 2;
     attack: number = 20;

    // 移动相关属性
    @property(Node)
    mainPath: Node = null; // 主路径节点

    private movePhase: number = 1; // 移动阶段
    private currentTargetIndex: number = 0; // 当前目标点索引
    private speed: number = 15; // 移动速度

    start() {
        let characterData = App.dataManager.getCharacterById(4);
        if (characterData) { 
            this.speed = characterData.moveSpeed;
            this.attack = characterData.attackDamage;
            this.maxHp = characterData.maxHp
            this.hp = characterData.hp;
        }
        // 初始化路径节点（如果未在编辑器中设置，则使用默认路径）
        if (!this.mainPath) this.mainPath = App.sceneNode.beetleMovePath;
        this.characterSkeletalAnimation?.play('cut_walk_f');
        const collider = this.node.getComponent(Collider);
        collider.on('onTriggerEnter', this.onTriggerEnter, this);
        collider.on('onTriggerStay', this.onTriggerStay, this);
        collider.on('onTriggerExit', this.onTriggerExit, this);
    }
    onTriggerEnter(event: ITriggerEvent) {
        if(event.otherCollider.node.name == "Spider" || event.otherCollider.node.name == "Spider_L"){
            console.log("甲虫的碰撞是否生效 == "+event.otherCollider.node.name)
            let enemySpider = event.otherCollider.node.getComponent(EnemySpider);
            if(enemySpider.hp > 0){
                enemySpider.baseHit1(this.attack,this.node.worldPosition,6);

            }
            if(event.otherCollider.node.name == "Spider"){
                this.hp-=2;
                if(this.hp <= 0){
                    this.hp = 0;
                }
            }else{
                this.hp-=1;
                if(this.hp <= 0){
                    this.hp = 0;
                }

            }
            if(this.hp <= 0){
                App.beetleController.removeBeetle(this);
                App.poolManager.returnNode(this.node);
                this.resetMovement();
                return;

            }
        }

    }
    //事件监听触发
    onTriggerStay(event: ITriggerEvent) {
        const nodeName = event.otherCollider.node.name;
    }

    onTriggerExit(event: ITriggerEvent) {
        console.log("onTriggerExit")
      
    }
    update(deltaTime: number) {
        this.handleMovement(deltaTime);
    }

    /** 处理移动逻辑 */
    private handleMovement(deltaTime: number) {
        // 第一阶段移动：沿主路径
        if (this.currentTargetIndex < this.mainPath?.children.length ) {
            this.moveToTarget(deltaTime, this.mainPath);
        }

    }

    /** 移动到当前目标点 */
    private moveToTarget(deltaTime: number, pathParent: Node) {
        if (!pathParent || pathParent.children.length === 0) return;

        const targetNode = pathParent.children[this.currentTargetIndex];
        const targetPos = targetNode.worldPosition;
        const currentPos = this.node.worldPosition;

        // 计算距离
        const distance = Vec3.distance(currentPos, targetPos);

        // 如果到达目标点，切换到下一个
        if (distance < 3) { // 可根据需要调整阈值
            this.currentTargetIndex++;
            // 旋转到目标方向
            this.node.eulerAngles = targetNode.eulerAngles.clone();
            
            // 检查是否到达路径终点
            if (this.currentTargetIndex >= pathParent.children.length) {
                
                this.currentTargetIndex = 0;
              
                App.beetleController.removeBeetle(this);
                App.poolManager.returnNode(this.node);
                this.resetMovement();
                return;
            }
            return;
        }

        // 计算移动方向
        const direction = Vec3.subtract(new Vec3(), targetPos, currentPos).normalize();

        // 计算每帧移动距离
        const moveDistance = this.speed * deltaTime;

        // 更新位置
        const newPos = Vec3.add(new Vec3(), currentPos, Vec3.multiplyScalar(new Vec3(), direction, moveDistance));
        this.node.worldPosition = newPos;

        // 平滑旋转朝向目标
        this.rotateToTarget(targetNode.eulerAngles, deltaTime);
    }

    /** 平滑旋转到目标角度 */
    private rotateToTarget(targetRot: Vec3, deltaTime: number) {
        const currentRot = this.node.eulerAngles;
        // 计算旋转差值并平滑过渡
        const rotDiff = new Vec3(
            this.smoothDamp(currentRot.x, targetRot.x, deltaTime),
            this.smoothDamp(currentRot.y, targetRot.y, deltaTime),
            this.smoothDamp(currentRot.z, targetRot.z, deltaTime)
        );
        this.node.eulerAngles = rotDiff;
    }

    /** 平滑插值函数 */
    private smoothDamp(current: number, target: number, deltaTime: number, smoothTime: number = 0.5): number {
        let diff = target - current;
        // 处理角度环绕问题
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;
        return current + diff * (1 - Math.exp(-deltaTime / smoothTime));
    }

    /** 重置移动状态 */
    public resetMovement() {
        this.movePhase = 1;
        this.currentTargetIndex = 0;
       
        let characterData = App.dataManager.getCharacterById(4);
        if (characterData) { 
            this.speed = characterData.moveSpeed;
            this.attack = characterData.attackDamage;
            this.maxHp = characterData.maxHp
            this.hp = characterData.hp;
        }
    }

    // /** 设置移动速度 */
    // public setSpeed(newSpeed: number) {
    //     this.speed = newSpeed;
    // }
}
    