import { _decorator, Component, Node } from 'cc';
import { Player } from './Entitys/Player';
const { ccclass, property } = _decorator;

@ccclass('SceneNode')
export class SceneNode extends Component {

    @property({ type: Player, tooltip: "主角玩家" })
    player: Player = null;

    @property({ type: Node, tooltip: "敌人的父节点" })
    enemyParent: Node = null;

    @property({ type: Node, tooltip: "血条的父节点" })
    bloodParent: Node = null;

    @property({ type: Node, tooltip: "金币父节点" })
    coinParent: Node = null;

    @property({ type: Node, tooltip: "临时效果父节点" })
    effectParent: Node = null;

    @property({ type: Node, tooltip: "临时爆炸父节点" })
    bombEffectParent: Node = null;

    @property({ type: Node, tooltip: "敌人出现的位置" })
    enemyBirthPos: Node = null;

    @property({ type: Node, tooltip: "敌人出现的位置" })
    enemyBirthPos1: Node = null;

    @property({ type: Node, tooltip: "敌人移动的路径第一段" })
    enemyMovePath: Node = null;

    @property({ type: Node, tooltip: "敌人移动的路径第二段" })
    enemyMovePath2: Node = null;

    @property({ type: Node, tooltip: "攻击拒马敌人移动的路径第二段" })
    enemyMoveRvoPath: Node = null;
    
    @property({ type: Node, tooltip: "障碍物父节点" })
    obstacleParrent : Node = null;

    @property({ type: Node, tooltip: "追击的拦截点位置" })
    moveBlockPos : Node = null;
    @property({ type: Node, tooltip: "结束的拦截点位置" })
    moveEndBlockPos : Node = null;

    @property({ type: Node, tooltip: "拒马的节点" })
    juma01 : Node = null;

    @property({ type: Node, tooltip: "所有的位置父节点" })
    allPos : Node = null;

    @property({ type: Node, tooltip: "火柴箭头的父节点" })
    fireArrow : Node = null;

    @property({ type: Node, tooltip: " Beetle移动的路径" })
    beetleMovePath : Node = null;

    @property({ type: Node, tooltip: " Beetle出现的位置" })
    beetleBirthPos : Node = null;

    @property({ type: Node, tooltip: " Beetle的父节点" })

    beetleParent : Node = null;

    @property({ type: Node, tooltip: " 花朵" })
    flower : Node = null;

    @property({ type: Node, tooltip: " 游戏结束界面" })
    GameEnd : Node = null;

    @property({ type: Node, tooltip: " 引导箭头的父节点" })
    guideParent : Node = null;

    @property({ type: Node, tooltip: " 引导箭头的父节点" })
    guideList : Node[] = [];


    @property({ type: Node, tooltip: " 拒马" })
    QianBiJuMa : Node[] = [];

    @property({ type: Node, tooltip: " 攻击花朵" })
    attackFlower : Node = null;

    
    @property({ type: Node, tooltip: "禁止金币掉落区域" })
    coinAreaBan: Node = null;
    protected start(): void {
        this.enemyParent.active = false;
    }

    // protected onLoad(): void {
    //    let level_1 = this.palingParent.getChildByName("yijiweiqiang")
    //    for(let i = 1 ;i < 9;i++){
    //         this.attackPalingLevel_1.push(level_1.getChildByName("weiqiang0"+i))
    //    }
    // }
    /**攻击的围栏 */
    // attackPalingLevel_1(){

    // }

}


