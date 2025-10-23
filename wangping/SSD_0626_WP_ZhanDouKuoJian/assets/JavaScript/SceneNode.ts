import { _decorator, Component, director, Node } from 'cc';
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

    @property({ type: Node, tooltip: "步兵父节点" })
    infantryParent: Node = null;

    @property({ type: Node, tooltip: "一级敌人出现的位置" })
    enemyBirthLevel_1: Node[] = [];

    @property({ type: Node, tooltip: "敌人初始化开始的位置" })
    enemyBirthInit: Node[] = [];

    @property({ type: Node, tooltip: "整体围墙" })
    palingParent: Node = null;

    @property({ type: Node, tooltip: "各级围墙" })
    palingLevels: Node[] = [];

    @property({ type: Node, tooltip: "第一级可被攻击的围栏" })
    attackPalingLevel_1: Node[] = [];

    @property({ type: Node, tooltip: "第二级可被攻击的围栏" })
    attackPalingLevel_2: Node[] = [];

    @property({ type: Node, tooltip: "第三级可被攻击的围栏" })
    attackPalingLevel_3: Node[] = [];

    @property({ type: Node, tooltip: "第四级可被攻击的围栏" })
    attackPalingLevel_4: Node[] = [];

    @property({ type: Node, tooltip: "物理空气墙" })
    PhysicsPaling: Node = null;

    @property({ type: Node, tooltip: "一级一塔交付位置" })
    handOverPosLevel_1: Node = null;

    @property({ type: Node, tooltip: "一级二塔交付位置" })
    handOverPosLevel_2: Node = null;

    @property({ type: Node, tooltip: "二级一塔交付位置" })
    handOverPosLevel_3: Node = null;

    @property({ type: Node, tooltip: "二级级二塔交付位置" })
    handOverPosLevel_4: Node = null;


    @property({ type: Node, tooltip: "扩建金矿地块交付位置" })
    handOverPosLevel_5: Node = null;

    @property({ type: Node, tooltip: "扩建金矿机器交付位置" })
    handOverPosLevel_6: Node = null;

    @property({ type: Node, tooltip: "扩建中级地块" })
    handOverPosLevel_7: Node = null;

    @property({ type: Node, tooltip: "扩建兵营" })
    handOverPosLevel_8: Node = null;

    @property({ type: Node, tooltip: "扩建兵营" })
    handOverPosLevel_9: Node = null;

    @property({ type: Node, tooltip: "最后一个金矿" })
    handOverPosLevel_10: Node = null;


    @property({ type: Node, tooltip: "金矿父节点" })
    goldMineParent: Node = null;

    @property({ type: Node, tooltip: "临时效果父节点" })
    effectParent: Node = null;


    @property({ type: Node, tooltip: "伙伴父节点" })
    parterParent: Node = null;

    @property({ type: Node, tooltip: "伙伴左路径" })
    parterPathLeft: Node = null;

    @property({ type: Node, tooltip: "伙伴右路径" })
    parterPathRight: Node = null;

    @property({ type: Node, tooltip: "引导节点" })
    guideList: Node[] = [];

    @property({ type: Node, tooltip: "引导父节点" })
    guideParent: Node = null;

    @property({ type: Node, tooltip: "采矿机特效左" })
    miningMachineEffctL: Node = null;

    @property({ type: Node, tooltip: "墙血条的父节点" })
    palingBloodBarParent: Node = null;

    @property({ type: Node, tooltip: "金币父节点" })
    miningCoinParent: Node = null;




    update(dt: number) {
        // console.log("========================>", director.getScene())
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


