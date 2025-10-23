import { Node, Vec3 } from "cc"
import { CollisionZoneEnum } from "../Enum/Index"

//类型定义 
export type MoneyItem = {
    pos: Vec3, //世界坐标
    money: Node //
}

export type HonorItem = {
    pos: Vec3, //世界坐标
    honor: Node //
}

/**
 * 引导位置
 */
export type GuideItem = {
    pos:Vec3,
    type:CollisionZoneEnum,
    order:number,
    honor?:number
}