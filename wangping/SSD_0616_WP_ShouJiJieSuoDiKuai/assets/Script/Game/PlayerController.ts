import { _decorator, Component, instantiate, Node, Vec3 } from 'cc';
import { BehaviourType, Character } from '../entitys/Character';
import { ResourceManager } from '../core/ResourceManager';
import Entity, { CharacterType } from '../entitys/Entity';
import { Global } from '../core/Global';
import { GroundEffct } from '../GroundEffct';
import { enemyCharacter } from '../entitys/enemyCharacter';
import { goodsDrop } from '../goodsDrop';
import { eventMgr } from '../core/EventManager';
import { EventType } from '../core/EventType';
import { BubbleFead } from '../BubbleFead';

const { ccclass } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {


    private parentNode: Node = null;
    public static _instance: PlayerController = null;
    public static get Instance() {
        if (this._instance == null) {
            this._instance = new PlayerController();
        }
        return this._instance;
    }

    public birthNodesPos: Node[] = []
    private endNodesPos: Node[] = []
    private cornNodesPos: Node[] = []

    private enemyHandOverPos: Node[] = []
    private allCharacterPos: Node[] = [];

    private enemySelfLanPos: Node[] = [];

    private enemyParentNode: Node = null;

    private curCharacter: Character = null;
    private curCharacterIndex: number = 1;
    private curCharacterHandOverIndex: number = 1;

    private enemyDieNum = 0;

    //@property({ type: [Character], tooltip: '角色列表' })
    private characterList: Character[] = [];
    private characterListPos: Character[] = [];


    //@property({ tooltip: '初始生命值' })
    private hp: number = 3;

    // @property({ tooltip: '初始攻击力' })
    private attack: number = 1;
    /**
     *  初始化角色 四个角色  
     *  id 从1 开始
     * 名字 player1 player2 player3 player4
     * 类型  玩家
     * @param parentNode 
     */
    public async initCharacters(parentNode: Node, birthNodesPos: Node[],
        endNodesPos: Node[], cornNodesPos: Node[], enemyHandOverPos: Node[],
        allCharacterPos: Node[], enemySelfLanPos: Node[]): Promise<void> {

        if (birthNodesPos) {
            this.birthNodesPos = birthNodesPos
        }
        if (endNodesPos) {
            this.endNodesPos = endNodesPos;
        }
        if (cornNodesPos) {
            this.cornNodesPos = cornNodesPos;
        }
        if (enemyHandOverPos) {
            this.enemyHandOverPos = enemyHandOverPos;
        }
        if (allCharacterPos) {
            this.allCharacterPos = allCharacterPos;
        }
        if (enemySelfLanPos) {
            this.enemySelfLanPos = enemySelfLanPos;
        }
        this.parentNode = parentNode;

        try {
            // 异步加载预制体
            const prefab = await ResourceManager.instance.loadPrefab(Global.characterPrefabPath);

            // 初始化角色
            for (let i = 0; i < birthNodesPos.length; i++) {
                const characterNode = instantiate(prefab);
                const character = characterNode.getComponent(Character);
                character.handOverNode = parentNode.getChildByName("treeHandOver")
                character.cornHandOverNode = parentNode.getChildByName("cornHandOver")
                if (!character) {
                    console.error(`角色预制体缺少Character组件: ${Global.characterPrefabPath}`);
                    continue;
                }
                // 设置角色数据
                character.setData(
                    String(i),              // ID
                    `player${i + 1}`,               // 名称
                    this.hp,                    // 生命值
                    this.attack,                // 攻击力
                    CharacterType.CHARACTER                 // 类型
                );
                // 设置角色位置
                character.entitySetPosition(this.birthNodesPos[i].position);

                // 添加到角色列表和场景
                this.characterList.push(character);
                this.parentNode.addChild(characterNode);

                // character.idle(character);

                // 触发角色初始化动画
                //character.playInitAnimation();
            }
            this.createCharacter(prefab);
            console.log(`成功初始化 ${this.characterList.length} 个角色`);
        } catch (error) {
            console.error("角色初始化失败:", error);

        }
    }
    // 人物移动
    squenceMove(target: any, behaviourType: BehaviourType) {
        console.log("squenceMove == " + target.node.name, "===========>", target.node.position);
        // 记录初始索引，用于判断是否循环了一轮
        const initialIndex = this.curCharacterIndex;
        console.log("initialIndex == " + initialIndex)
        console.log("this.curCharacterIndex == " + this.curCharacterIndex)
        // 循环查找可用角色
        for (let i = 0; i < this.characterList.length; i++) {
            const characterIndex = (initialIndex + i) % this.characterList.length;
            const character = this.characterList[characterIndex];

            // 找到未在寻找目标的角色
            if (!character.getFindTarget()) {
                console.log("initialIndex111111 == " + initialIndex)
                //console.log("this.curCharacterIndex1111111 == " + this.curCharacterIndex)
                this.curCharacterIndex = (characterIndex + 1) % this.characterList.length;
                character.setFindTarget(true);
                character.setBehaviour(behaviourType);
                character.target = target;
                character.moveTargetWorldPos = target.node.worldPosition.clone();
                character.strtMoveTree();

                console.log("initialIndex222222222 == " + this.curCharacterIndex)
                return; // 找到合适角色后退出函数
            }

        }
        // 如果循环结束后没有找到可用角色，则输出提示
        console.log("没有找到可用的角色");
    }
    //人物移动到交付点
    squenceHandOver(target: any, behaviourType: BehaviourType) {
        for (let i = 0; i < this.characterListPos.length; i++) {
            const character = this.characterListPos[i];
            character.entitySetPosition(new Vec3(19.5, 0, 19.8));
            character.node.active = false;
        }

        console.log("initialIndex squenceHandOver == " + this.curCharacterIndex)
        // 记录初始索引，用于判断是否循环了一轮
        // const initialIndex = this.curCharacterHandOverIndex;

        // 循环查找可用角色
        for (let i = 0; i < this.characterList.length; i++) {
            //const characterIndex = (initialIndex + i) % this.characterList.length;
            const character = this.characterList[i];

            // 找到未在寻找目标的角色//!character.getFindTarget() &&
            if (character.woodNum > 0) {
                character.idle()
                character.setFindTarget(false);
                character.setBehaviour(BehaviourType.Idel);
                // this.scheduleOnce(() => {
                character.setFindTarget(true);
                character.curHanOverType = 1;
                character.setBehaviour(behaviourType);
                character.target = this.birthNodesPos[Number(character.getId())];
                character.moveTargetWorldPos = (character.target as Node).worldPosition.clone();
                character.strtMoveHandOver();
                // }, 0.1)



                console.log("initialIndex squenceHandOver 1111111== " + this.curCharacterIndex)
                //return; // 找到合适角色后退出函数
            }
        }


    }


    // 到达传送点
    // moveTransmitPos() {
    //     for (let i = 0; i < this.characterList.length; i++) {
    //         const character = this.characterList[i];

    //         // 找到未在寻找目标的角色

    //         character.setFindTarget(true);
    //         character.setBehaviour(BehaviourType.Transmit);
    //         character.target = this.endNodesPos[Number(character.getId())];
    //         character.moveTargetWorldPos = (character.target as Node).worldPosition.clone();
    //         character.moveTransmit();

    //     }
    // }
    // 到达收割玉米点
    moveCornPos() {
        let fun = (character) => {
            character.idle()
            character.setFindTarget(false);
            character.setBehaviour(BehaviourType.Idel);
            // 找到未在寻找目标的角色

            character.setFindTarget(true);
            character.setBehaviour(BehaviourType.ConrPost);
            character.target = this.cornNodesPos[Number(character.getId())];
            character.moveTargetWorldPos = (character.target as Node).worldPosition.clone();
            character.moveCornPos();
        }
        for (let i = 0; i < this.characterList.length; i++) {
            const character = this.characterList[i];

            if (character.getBehaviour() == BehaviourType.CutTree) {
                this.scheduleOnce(() => {
                    fun(character)
                }, 2)
            } else {
                fun(character)
            }


        }
    }
    // // 寻找怪物的位置
    // moveFindEnemyPos(enemyParent: Node) {


    //     enemyParent.active = true;
    //     let enemyParentNode = enemyParent;
    //     for (let i = 0; i < this.characterList.length; i++) {

    //         const character = this.characterList[i];

    //         // 寻找目标的角色
    //         character.setFindTarget(true);
    //         character.setBehaviour(BehaviourType.FindEnemy);
    //         let enemy = enemyParentNode.getChildByName("enmey_" + character.getId());
    //         character.target = enemy.getComponent(enemyCharacter);
    //         // character.getComponent(goodsDrop).initGoods();
    //         character.moveTargetWorldPos = (character.target as enemyCharacter).node.worldPosition.clone();
    //         character.findEnemy();

    //         //敌人 寻找人物
    //         let enemyScrpt = enemy.getComponent(enemyCharacter);
    //         enemyScrpt.target = character
    //         enemyScrpt.moveTargetWorldPos = character.node.worldPosition.clone();
    //         enemyScrpt.isFindCharacter = true;

    //     }
    // }
    // 寻找怪物地块自己站的位置
    moveFindEnemyLandPos(enemyParent: Node) {

        // enemyParent.active = true;
        // let enemyParentNode = enemyParent;
        for (let i = 0; i < this.characterList.length; i++) {
            

            const character = this.characterList[i];
            character.target = null;
            character.moveTargetWorldPos = null;

            // 寻找目标的角色
            character.setFindTarget(true);
            character.setBehaviour(BehaviourType.FindLandPos);

            character.target = this.enemySelfLanPos[Number(character.getId())];
            character.moveTargetWorldPos = (character.target as Node).worldPosition.clone();


            let enemyParentNode = enemyParent;
            let enemy = enemyParentNode.getChildByName("SangshiPrefab_" + character.getId());
            let enemyScrpt = enemy.getComponent(enemyCharacter);
            character.findEnemyPos(enemyScrpt, enemyParentNode);
            //character.findEnemy();
            //敌人 寻找人物
            enemyScrpt.target = character
            enemyScrpt.moveTargetWorldPos = character.node.worldPosition.clone();
            enemyScrpt.isFindCharacter = true;
        }


    }

    //攻击敌人
    attackEnemy(cahracter, enemy) {

        if (cahracter.getMachineName() == "attack") {
            return;
        }
        if (enemy.hp <= 0) {
            return;
        }
        cahracter.target = enemy;
        cahracter.setFindTarget(true);
        cahracter.useSkill(() => {
            // this.enemyDieNum++;
            // if (this.enemyDieNum >= 4) {
            //     eventMgr.emit(EventType.ENTITY_ENEMY_DIE, this);
            // }
        })
        //敌人全部四万

    }
    // 寻找敌人交付点位置
    moveFindEnemHandOver() {
        let fun = (character) => {
            character.idle()
            character.setFindTarget(false);
            character.setBehaviour(BehaviourType.Idel);
            // 找到未在寻找目标的角色

            character.setFindTarget(true);
            character.setBehaviour(BehaviourType.EnemyHnadOverPos);
            character.target = this.enemyHandOverPos[Number(character.getId())];
            character.moveTargetWorldPos = (character.target as Node).worldPosition.clone();
            character.findEnemyHandOver();
        }
        for (let i = 0; i < this.characterList.length; i++) {
            const character = this.characterList[i];

            if (character.getBehaviour() == BehaviourType.CutTree) {
                this.scheduleOnce(() => {
                    fun(character)
                }, 2)
            } else {
                fun(character)
            }


        }
        // //let enemyParentNode = enemyParent;
        // for (let i = 0; i < this.characterList.length; i++) {
        //     const character = this.characterList[i];
        //     // 寻找目标的角色
        //     character.setFindTarget(true);
        //     character.setBehaviour(BehaviourType.EnemyHnadOverPos);
        //     character.target = this.enemyHandOverPos[Number(character.getId())];
        //     character.moveTargetWorldPos = (character.target as Node).worldPosition.clone();
        //     character.findEnemyHandOver();

        // }
    }
    //重置人物状态
    resetState() {
        for (let i = 0; i < this.characterList.length; i++) {
            const character = this.characterList[i];

            // 找到未在寻找目标的角色
            character.woodNum = 0;
            character.node.getChildByName("backpack").removeAllChildren();
            character.setFindTarget(false);
            character.setBehaviour(BehaviourType.Idel);
            // character.target = this.endNodesPos[Number(character.getId())];
            // character.moveTargetWorldPos = (character.target as Node).worldPosition.clone();
            character.idle()

        }
    }
    //只重置人物行为状态 和可操作
    resetBehaviour() {
        for (let i = 0; i < this.characterList.length; i++) {
            const character = this.characterList[i];
            character.setFindTarget(false);
            character.setBehaviour(BehaviourType.Idel);
            // character.target = this.endNodesPos[Number(character.getId())];
            // character.moveTargetWorldPos = (character.target as Node).worldPosition.clone();
            character.idle()

        }
    }
    allCharacterHanover() {
        let num = 0;
        for (let i = 0; i < this.characterList.length; i++) {
            const character = this.characterList[i];
            character.setFindTarget(false);
            character.setBehaviour(BehaviourType.Idel);
            character.getComponent(goodsDrop).restoreItemsInAllBackpacks();
            num++;
            // character.target = this.endNodesPos[Number(character.getId())];
            // character.moveTargetWorldPos = (character.target as Node).worldPosition.clone();
            //character.idle()

        }
        if (num >= 4) {
            eventMgr.emit(EventType.ENTITY_ENEMY_DIE, this);
        }
    }

    // 开始收割玉米
    cutCornController(selfNode: Node, groundEffect: GroundEffct) {

        const arrowIds = {
            'Arrow1': 0,
            'Arrow2': 1,
            'Arrow3': 2,
            'Arrow4': 3
        };

        const id = arrowIds[selfNode.name] ?? -1; // 默认值设为-1表示未匹配
        const character = this.characterList[id];
        if (character.getFindTarget()) {
            console.log("在收割玉米的状态")
            return;
        } else {
            //渐变消失效果
            if (selfNode.getComponent(BubbleFead)) {
                selfNode.getComponent(BubbleFead).hideFead();
            }
            character.groundEffect = groundEffect;
            character.setFindTarget(true);
            character.setBehaviour(BehaviourType.CutCorn);
            character.cutCorn(() => {

            })
        }
    }
    // // 开始寻找怪物
    // findEnemyPos() {
    //     for (let i = 0; i < this.characterList.length; i++) {
    //         const character = this.characterList[i];

    //         // 找到未在寻找目标的角色

    //         character.setFindTarget(true);
    //         character.setBehaviour(BehaviourType.Transmit);
    //         character.target = this.endNodesPos[Number(character.getId())];
    //         character.moveTargetWorldPos = (character.target as Node).worldPosition.clone();
    //         character.moveTransmit();

    //     }
    // }
    //人物不可在操作
    lockState() {
        for (let i = 0; i < this.characterList.length; i++) {
            const character = this.characterList[i];

            // 找到未在寻找目标的角色
            character.woodNum = 0;
            character.cornNum = 0;
            character.node.getChildByName("backpack").removeAllChildren();
            character.node.getChildByName("backpack1").removeAllChildren();
            character.setFindTarget(true);
            character.setBehaviour(BehaviourType.Idel);
            // character.target = this.endNodesPos[Number(character.getId())];
            // character.moveTargetWorldPos = (character.target as Node).worldPosition.clone();
            character.idle()

        }
    }

    GameHandOverComplate() {
        this.lockState()
        let index = 0;
        //操作的四个人位置
        for (let i = 0; i < this.characterList.length; i++) {

            const character = this.characterList[i];
            character.moveTargetWorldPos = this.allCharacterPos[index].worldPosition.clone();
            index++;
            character.move((character: Entity) => {
                (character as Character).setFindTarget(true);
                (character as Character).setBehaviour(BehaviourType.Idel);
                (character as Character).idle()
            })
        }
        //
        for (let i = 0; i < this.characterListPos.length; i++) {
            this.scheduleOnce(() => {
                const character = this.characterListPos[i];
                character.node.active = true;
                character.moveTargetWorldPos = this.allCharacterPos[index - 1].worldPosition.clone();
                index++
                character.move((character: Entity) => {
                    (character as Character).setFindTarget(true);
                    (character as Character).setBehaviour(BehaviourType.Idel);
                    (character as Character).idle()
                })
            }, i * 0.2)

            // const character =  this.parentNode.children[i].getComponent(Character)

            // character.move()
        }
    }
    createCharacter(prefab1) {
        let prefab = prefab1

        // 初始化角色
        for (let i = 0; i < 8; i++) {
            const characterNode = instantiate(prefab);
            const character = characterNode.getComponent(Character);
            if (!character) {
                console.error(`角色预制体缺少Character组件: ${Global.characterPrefabPath}`);
                continue;
            }
            // 设置角色数据
            character.setData(
                String(4 + i),              // ID
                `player${i + 1 + 4}`,               // 名称
                this.hp,                    // 生命值
                this.attack,                // 攻击力
                CharacterType.CHARACTER                 // 类型
            );
            // 设置角色位置
            character.entitySetPosition(new Vec3(24, 0, 180));

            this.characterListPos.push(character);
            this.parentNode.addChild(characterNode);


        }
    }
    // 获取角色列表
    public getCharacters(): Character[] {
        return this.characterList;
    }
    // 根据ID获取角色
    public getCharacterById(id: string): Character | null {
        return this.characterList.find(character => character.getId() === id) || null;
    }

    // 清理所有角色
    public clearCharacters(): void {
        this.characterList.forEach(character => {
            if (character.node && character.node.isValid) {
                character.node.destroy();
            }
        });
        this.characterList = [];
    }
}
// 导出全局单例
export const playerController = PlayerController.Instance;
