import { Component, Rect, UITransform, v2, v3, Vec2, Vec3, view, _decorator } from "cc";
import QuadTree from "../../common/QuadTree";
import Util from "../../core/utils/Util";
import { Simulator } from "../../RVO/Simulator";
import { monsterCtl } from "../../Test/monsterCtl";
import MonsterFactory from "../../Test/MonsterFactory";
import Game from "../../Test/Test2";

const { ccclass, property } = _decorator;

/**
 */
@ccclass("WaveMng")
export default class WaveMng extends Component {

    public quadTree: QuadTree = null;
    private _wHalf: number = 0;
    private _hHalf: number = 0;
    monsterPrefab: Array<string> = ["A", "B", "C"];
    // monsterPrefab: Array<string> = ["A"];
    

  
    update() {
        this.rebuildTree()
    }

    rebuildTree() {
        if (!Game.Instance.camera) {
            return
        }
        let rect = view.getViewportRect()
        this.quadTree = new QuadTree(rect, 0);
        Game.Instance.Player.monsterList.forEach(enm => {
            let rect = enm.getComponent(UITransform).getBoundingBoxToWorld()
            let treeObj = { x: rect.x, y: rect.y, height: rect.height, width: rect.width, rect: rect, collider: enm }
            this.quadTree.insert(treeObj)
        })

    }
    /**
   */
    _tmpV2: Vec2 = new Vec2()
    _tmpV3: Vec3 = new Vec3()
    createMonster() {
        // if (Game.Instance.Player.monsterList.length <= 0) {
        // return
        if (Game.Instance.Player.monsterList.length >= Game.Instance.limitMonst) {
            return
        }
        // if (this.node.getComponent(WaveMng)) {
        let posArray = this.getPos(0, Math.random() * 20 + 10)
        let speedCfg = [120, 80 , 80]
        let radiusCfg = [20, 18, 18]
        let maxHp = 4
        // return
        for (let idx = 0; idx < posArray.length; idx++) {
            let prefabIdx = Math.floor(Math.random() * this.monsterPrefab.length)
            let prefabName: string = this.monsterPrefab[prefabIdx]//  Math.random() > 0.5 ? this.sphereRed : this.sphereBlue
            let speed = speedCfg[prefabIdx]
            let radius = radiusCfg[prefabIdx]
            let mass = 1
            let sacle = 0.5
            let checkDis = radius * 2
            let hp = Math.floor(Math.random() * maxHp)
            if (prefabIdx != 0) {
                sacle = 0.5
            }

            let p = posArray[idx]
            let agentId = Simulator.instance.addAgent(Util.v3t2(p, this._tmpV2), radius, speed, null, mass);
            let agentObj = Simulator.instance.getAgentByAid(agentId)
            agentObj.neighborDist = checkDis //动态修改每个agent的巡视范围

            MonsterFactory.Instance.creatorMonsterByName(prefabName, p, (node) => {
                node.getComponent(monsterCtl).agentHandleId = agentId
                node.getComponent(monsterCtl).hp = hp
                node.setScale(Util.simpleV3(sacle, this._tmpV3))
                Game.Instance.Player.monsterList.push(node)
            })
        }
    }

    /**
     * 获取四叉树的推荐检测列表
     * @param checkRect 
     */
    getTreeColliderList(checkRect: Rect) {
        if (this.quadTree) {
            return this.quadTree.retrieve(checkRect)
        }
        return []

    }


    _tmpPosVe3: Array<Vec3> = []
    getPos(type: number, numbs: number) {
        this._tmpPosVe3.length = 0
        const size = view.getVisibleSize();
        this._wHalf = size.width * 0.25 + 300 + Math.random() * 300;
        this._hHalf = size.height * 0.25 + 200 + Math.random() * 200;
        let len = numbs
        var w = this._wHalf;//椭圆长
        var h = this._hHalf; //椭圆高
        var angle = 360 / len;
        var x, y;
        const point = Game.Instance.Player.node.getPosition();
        for (let i = 0; i < len; i++) {
            // Mathf.Deg2Rad 单位角度的弧 相当于 1° 的弧度
            x = w * Math.cos(i * (angle / 180) * Math.PI);
            y = h * Math.sin(i * (angle / 180) * Math.PI);
            this._tmpPosVe3.push(v3(x + point.x, y + point.y, 1))
        }
        return this._tmpPosVe3
    }

    protected onEnable(): void {
        
    }

    protected onDisable(): void {
        
    }

}