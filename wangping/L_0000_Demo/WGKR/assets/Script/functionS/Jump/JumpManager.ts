import { _decorator, Component, CurveRange, director, instantiate, Node, Prefab, resources, Root, Scene, Vec3 } from 'cc';
import PoolManager, { PoolEnum } from '../../Base/PoolManager';
import Singleton from '../../Base/Singleton';
import { JumpCurve } from './JumpCurve';
import { JumpCurve3D } from './JumpCurve3D';
import { JumpDriveEngine } from './JumpDriveEngine';
import JumpSequenceBase from './JumpSequenceBase';
import BezierCurve, { Vector } from './BezierCurve';
import LayerManager, { SceneType } from '../../Base/LayerManager';

export class JumppManager extends Singleton {

    public static get instacne() {
        return this.getInstance<JumppManager>();
    }

    public static instance: JumppManager;


    public propFlyList: JumpSequenceBase[];



    private constructor() {
        super();
        let node = new Node();
        director.getScene().addChild(node);
        node.addComponent(JumpDriveEngine);
        this.propFlyList = [];
    }

    /**
     * 
     * @param flyNode 飞行节点
     * @param endPosTemp 结束位置
     * @param jumpSpeed 速度
     * @param jumpPower 高度
     * @returns 
     */
    public jumpCurve(flyNode: Node, endPosTemp: Vec3, jumpSpeed: number = 1, jumpPower: number = 1) {
        if (LayerManager.instance.SceneType == SceneType.D2) {
            return this.jumpCurve2D(flyNode, endPosTemp, jumpSpeed, jumpPower);
        } else {
            return this.jumpCurve3D(flyNode, endPosTemp, jumpSpeed, jumpPower);
        }
    }


    /**
     * 
     * @param flyNode 要飞行的节点
     * @param endPosTemp 目标地点 
     * @param jumpPower 力度
     * @param jumpSpeed 飞行速度
     * 
     */
    public jumpCurve2D(flyNode: Node, endPosTemp: Vec3, jumpSpeed: number = 1, jumpPower: number = 1) {
        let propdata = PoolManager.instance.getPool<JumpCurve>(PoolEnum.JumpSequence + JumpCurve);
        if (!propdata) {
            propdata = new JumpCurve();
        }
        propdata.init(flyNode, endPosTemp, jumpPower, jumpSpeed);
        this.propFlyList.push(propdata);
        return propdata;
    }

    /**
   * 
   * @param flyNode 要飞行的节点
   * @param endPosTemp 目标地点 
   * @param jumpPower 力度
   * @param jumpSpeed 飞行速度
   * 
   */
    public jumpCurve3D(flyNode: Node, endPosTemp: Vec3, jumpSpeed: number = 1, jumpPower: number = 1) {
        let propdata = PoolManager.instance.getPool<JumpCurve3D>(PoolEnum.JumpSequence + JumpCurve3D);
        if (!propdata) {
            propdata = new JumpCurve3D();
        }
        propdata.init(flyNode, endPosTemp, jumpPower, jumpSpeed);
        this.propFlyList.push(propdata);
        return propdata;
    }

    /**
     * 自定义贝塞尔 曲线
     * @param flyNode 
     * @param endPosTemp 
     * @param jumpSpeed 
     * @returns 
     */
    public bezierCurve(flyNode: Node, points: Vector[], jumpSpeed: number = 1) {
        const dim = points[0].length;
        if (points.length === 0) {
            console.error("自定义贝塞尔：至少需要一个点");
            return null;
        }
        if (!points.every(p => p.length === dim)) {
            console.error("自定义贝塞尔：所有的点维度必须相同");
            return null;
        }
        let propdata = PoolManager.instance.getPool<BezierCurve>(PoolEnum.JumpSequence + BezierCurve);
        if (!propdata) {
            propdata = new BezierCurve();
        }
        propdata.init(flyNode, points, jumpSpeed);
        this.propFlyList.push(propdata);
        return propdata;
    }



    /**
     * 
     * @param flyNode 
     * @param endPosTemp 
     * @param jumpSpeed 
     * @param jumpPower 
     * @returns 
     */
    public jumpBezierCurve(flyNode: Node, endPosTemp: Vec3, jumpSpeed: number = 1, jumpPower: number = 1) {
        let propdata = PoolManager.instance.getPool<BezierCurve>(PoolEnum.JumpSequence + BezierCurve);
        if (!propdata) {
            propdata = new BezierCurve();
        }
        const startPos = flyNode.worldPosition;
        const endPos = endPosTemp;
        const centerPos = new Vec3();
        Vec3.add(centerPos, startPos, endPos);
        centerPos.multiplyScalar(0.5);
        if (LayerManager.instance.SceneType == SceneType.D2) {
            centerPos.y += 64 * jumpPower;
            const points: Vector[] = [
                new Float32Array([startPos.x, startPos.y]),
                new Float32Array([centerPos.x, centerPos.y]),
                new Float32Array([endPos.x, endPos.y])
            ]
            propdata.init(flyNode, points, jumpSpeed);
        } else {
            centerPos.y += 8 * jumpPower;
            const points: Vector[] = [
                new Float32Array([startPos.x, startPos.y, startPos.z]),
                new Float32Array([centerPos.x, centerPos.y, centerPos.z]),
                new Float32Array([endPos.x, endPos.y, endPos.z])
            ]
            propdata.init(flyNode, points, jumpSpeed);
        }

        this.propFlyList.push(propdata);
        return propdata;
    }



    public JumpCurveTime(propList: Node[], endPosTemp: Vec3, count: number, time: number, curve: CurveRange = null, curveSpeed: CurveRange = null) {
        let t = 0;
        let offT = count / time;
        for (let i = 0; i < count; i++) {
            this.jumpCurve(propList[i], endPosTemp).setDelay(t).setCurveRange(curve).setCurveRangeSpeed(curveSpeed);
            t += offT;
        }
    }




}


