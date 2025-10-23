import { _decorator, Component,instantiate,Node} from 'cc';
import { EnemyItem } from './EnemyItem';
import { DataManager } from '../Globel/DataManager';
import { EntityTypeEnum, EventName } from '../Enum/Enum';
import { EventManager } from '../Globel/EventManager';
import { DieEffect } from './DieEffect';
const { ccclass, property } = _decorator;

@ccclass('EnemyManager')
export class EnemyManager extends Component {

    @property(Node)
    enemyParent: Node = null;

    @property(Node)
    dieEffectNode:Node = null;

    @property(Node)
    effectParent:Node = null;

    /** 路径节点 */
    @property(Node)
    pathNodes:Node[]=[];

    private _enemyIndex:number = 0;
    private _deadNum:number = 0;
    /** 攻击次数 */
    private _attackTimes:number[]=[1,3,1,3,1,1];

    protected start(): void {
        DataManager.Instance.enemyManger = this;
    }

    protected onEnable(): void {
        EventManager.inst.on(EventName.EnemyDead, this.onEnemyDead, this);
    }

    protected onDisable(): void {
        EventManager.inst.off(EventName.EnemyDead, this.onEnemyDead, this);
    }

    // 初始化敌人
    public init() {
        this.enemyParent.destroyAllChildren();
        //先出前两个敌人，后边基本死一个出一个
        this.addOneEnemy(EntityTypeEnum.Enemy1);
        this.addOneEnemy(EntityTypeEnum.Enemy2);


    }

    /** 敌人死亡  */
    private onEnemyDead(enemy: EnemyItem) {
        this._deadNum++;
        switch(this._deadNum){
            case 2:
                this.addOneEnemy(EntityTypeEnum.Enemy2);
                break;
            case 3:
                this.addOneEnemy(EntityTypeEnum.Enemy1);
                break;
            case 4:
                this.addOneEnemy(EntityTypeEnum.Enemy1);
                break;
            case 5:
                this.addOneEnemy(EntityTypeEnum.Enemy2);
                break;
        }
        //播放死亡效果
        let dieNode:Node = instantiate(this.dieEffectNode);
        let dieItem:DieEffect = dieNode.getComponent(DieEffect);
        if(dieItem){
            dieNode.setParent(this.effectParent);
            dieNode.active = true;
            dieItem.init(enemy.getHitPos(),enemy.bloodNum,enemy.headShot());
            
        }
    }

    private addOneEnemy(type:EntityTypeEnum){
        let node:Node = instantiate(DataManager.Instance.prefabMap.get(type));
        node.parent = this.enemyParent;
        let enemyItem1:EnemyItem = node.getComponent(EnemyItem);
        enemyItem1.init(this.pathNodes[this._enemyIndex].children,this._enemyIndex,this._attackTimes[this._enemyIndex]);
        this._enemyIndex++;
    }

    public resetGame(){
        this._enemyIndex = 0;
        this._deadNum = 0;
        this.enemyParent.destroyAllChildren();
        this.init();
    }



}


