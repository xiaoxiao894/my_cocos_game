import { Vec3,Node } from "cc"

//坐标信息
export type TranstormItem={
    depth:number,
    pos:Vec3
}

export type RopePoint = {
    tree:Vec3,
    ropeNode:Node,
    pointNode:Node,
    pointConstraint:any,
    distanceConstraint:any,
}

export type TreeAniData = {
    dir:Vec3,//控制树倒的幅度方向
    tree: {
        x:number,
        y:number
    }
}

