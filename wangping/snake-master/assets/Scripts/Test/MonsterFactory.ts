import { instantiate, Intersection2D, Node, NodePool, Prefab, Rect, resources, UITransform, Vec3, view } from "cc";
import ArrayUtil from "../core/utils/ArrayUtil";
import { monsterCtl } from "./monsterCtl";
import Game from "./Test2";

interface MonsterPool {
    name: string;
    pool: NodePool;
}



export default class MonsterFactory {
    private static instance: MonsterFactory = null;
    public static get Instance(): MonsterFactory {
        if (this.instance == null)
            this.instance = new MonsterFactory();
        return this.instance;
    }

    MonsterPoolList: Array<MonsterPool> = new Array<MonsterPool>();
    monsterParent: Node;
    monsterDataCountList = {}; //每种怪物的数量数据

    monsterAllList: Array<monsterCtl> = new Array<monsterCtl>(); //所有的怪物;

    screenMonsterAllList: Array<monsterCtl> = new Array<monsterCtl>(); //屏幕里面的怪物;

    arrayMonsterList: Array<Array<monsterCtl>> = new Array<Array<monsterCtl>>();

    currenTime = -30;
    currentIndex = 0;//当前刷新到了第几次
    weekCount = 0; //第几次循环
    constructor() {
        // this.monsterParent = find("Canvas/Game/monsterCtl");
        this.monsterParent = Game.Instance.monsterRootNode
    }

    getMonsterCountByName(name) {
        let index = 0;
        for (let i = 0; i < this.monsterAllList.length; i++) {
            if (this.monsterAllList[i].node.name == name) {
                index++;
            }
        }
        return index;
    }

    clear() {
        this.currenTime = -30;
        this.currentIndex = 0;
        this.weekCount = 0;
        for (let i = 0; i < this.monsterAllList.length; i++) {
            let monsterCtl = this.monsterAllList[i];
            this.recoverNode(monsterCtl.node);
            i--;
        }
        this.monsterDataCountList = {};
        this.monsterAllList = new Array<monsterCtl>();
        this.arrayMonsterList = new Array<Array<monsterCtl>>();
        this.screenMonsterAllList = new Array<monsterCtl>()
    }

    update(dt) {
   
    }

    creatorMonsterByName(name, pos: Vec3, call?) {
        let pool: NodePool = this.getEfPoolByName(name);
        let node: Node = pool.get();

        if (this.monsterDataCountList[name] == null) {
            this.monsterDataCountList[name] = 0;
        }
        this.monsterDataCountList[name]++;
        let resetNode = (ef: Node) => { 
            ef.parent = this.monsterParent;
            ef.active = true;
            ef.setPosition(pos.x, pos.y);
            call && call(ef);
            let mstCtl = ef.getComponent(monsterCtl)
            if (mstCtl) {
                mstCtl.reuse()
                this.monsterAllList.push(mstCtl);
            } else {
                console.error("monster has none monster ctl...")
            }
        };
        if (node == null) {
            resources.load("prefab/monster/" + name, Prefab, (err, resPrefab) => {
                node = instantiate(resPrefab)
                resetNode(node)
            })

        }
        else {
            // console.log("从缓存池创建...")
            resetNode(node);
        }
    }

    getEfPoolByName(name) {
        let efPool: NodePool = null;
        for (let i = 0; i < this.MonsterPoolList.length; i++) {
            if (name == this.MonsterPoolList[i].name) {
                efPool = this.MonsterPoolList[i].pool;
                break
            }
        }
        if (efPool == null) {
            efPool = new NodePool();
            this.MonsterPoolList.push({
                name: name,
                pool: efPool
            })
        }
        return efPool;
    }

    /**
     * 回收
     * @param node 
     */
    recoverNode(node) {
        let name = node.name;
        if (this.monsterDataCountList[node.name]) {
            this.monsterDataCountList[node.name]--;
        }
        for (let i = 0; i < this.MonsterPoolList.length; i++) {
            if (name == this.MonsterPoolList[i].name) {
                node.active = false;
                this.MonsterPoolList[i].pool.put(node);
                let com = node.getComponent(monsterCtl);
                let index = this.monsterAllList.indexOf(com);
                if (index != -1) {
                    ArrayUtil.fastRemoveAt(this.monsterAllList, index)
                    // this.monsterAllList.splice(index, 1);
                }
                break;
            }
        }
    }


    /**
     * 获取当前在屏幕内的怪物
     * @param node 
     */
    getInViewMonster(node: Node = null) {
        let tNode = node ? node : Game.Instance.Player.node
        this.screenMonsterAllList = [];
        this.arrayMonsterList = new Array<Array<monsterCtl>>();
        let pos = tNode.getComponent(UITransform).convertToWorldSpaceAR(new Vec3());

        let v2 = view.getViewportRect();
        let realView = new Vec3(v2.width, v2.height, 0);
        let allRect = new Rect(pos.x - realView.x / 2, pos.y - realView.y / 2, realView.x, realView.y);

        let cutRectMonterList = new Array<monsterCtl>();
        this.arrayMonsterList.push(cutRectMonterList);
        for (let j = 0; j < this.monsterAllList.length; j++) {
            let monsterCtl = this.monsterAllList[j];
            let monsterRect = monsterCtl.getCircle(true);
            //顺便获取屏幕里面的怪
            if (Intersection2D.rectCircle(allRect, monsterRect.pos, monsterRect.radius)) {
                this.screenMonsterAllList.push(monsterCtl);
            }
        }
    }

    cutRectCount = 2;
    getCutRectList(node) {
        this.screenMonsterAllList = [];
        this.arrayMonsterList = new Array<Array<monsterCtl>>();
        let pos = node.getComponent(UITransform).convertToWorldSpaceAR(new Vec3());
        let v2 = view.getViewportRect();
        let realView = new Vec3(v2.width, v2.height, 0);
        let allRect = new Rect(pos.x - realView.x / 2, pos.y - realView.y / 2, realView.x, realView.y);
        let rect1 = new Rect(pos.x - realView.x, pos.y, realView.x, realView.y);
        let rect2 = new Rect(pos.x, pos.y, realView.x, realView.y);
        let rect3 = new Rect(pos.x - realView.x, pos.y - realView.y, realView.x, realView.y);
        let rect4 = new Rect(pos.x, pos.y - realView.y, realView.x, realView.y);
        let rectList = [rect1, rect2, rect3, rect4];
        for (let i = 0; i < rectList.length; i++) {
            let rect = rectList[i];
            let cutRectMonterList = new Array<monsterCtl>();
            this.arrayMonsterList.push(cutRectMonterList);
            for (let j = 0; j < this.monsterAllList.length; j++) {
                let monsterCtl = this.monsterAllList[j];
                let monsterRect = monsterCtl.getCircle();
                // let result = rect.intersects(monsterRect);
                // rect.polygonCircle
                let result = Intersection2D.rectCircle(rect, monsterRect.pos, monsterRect.radius)
                //改为矩形圆形判断
                if (result) {
                    cutRectMonterList.push(monsterCtl);
                    monsterCtl.cutRectMonterList = cutRectMonterList;

                }
                //顺便获取屏幕里面的怪
                if (i == 0) {
                    if (Intersection2D.rectCircle(allRect, monsterRect.pos, monsterRect.radius)) {
                        this.screenMonsterAllList.push(monsterCtl);
                    }
                }
            }
        }

    }

}