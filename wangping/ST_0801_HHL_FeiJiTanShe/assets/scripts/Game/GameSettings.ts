import { _decorator, Component, Node, v3, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameSettings')
export class GameSettings extends Component {

    @property({ displayName: "飞机初始坐标" })
    aircraftInitPos: Vec3 = v3(0.0, 1.0, 0.0);

    @property({ displayName: "飞机质量" })
    aircraftMass: number = 0.2;

    @property({ displayName: "飞机线性阻尼" })
    aircraftLinearDamping: number = 0.1

    @property({ displayName: "飞机旋转阻尼" })
    aircraftAngularDamping: number = 0.8

    @property({ displayName: "发射力度" })
    aircraftFireImpulseScalar: number = 18

    @property({displayName:"大力弹射翻机概率 0-1"})
    aircraftStartRolloverProbability:number = 0.9

    @property({ displayName: "摇杆提供转向力" })
    aircraftJoystickInputTorqueScale: number = 0.6

    @property({ displayName: "摇杆提供竖向力缩放" })
    aircraftJoystickInputVerticalScale: number = 0.2

    @property({ displayName: "摇杆提供横向力缩放" })
    aircraftJoystickInputHorizontalScale: number = 0.5

    @property({ displayName: "飞机自身动力" })
    aircraftForwardImpulseScaler: number = 1.0

    @property({ displayName: "飞机上升减缓高度" })
    aircraftUpSlowDownHeight: number = 100

    @property({ displayName: "飞机上升减缓速度Y",tooltip:"飞机上升向上的速度大于此值开始减缓" })
    aircraftUpSlowDownSpeed: number = 10

    @property({ displayName: "飞机低头力度" })
    aircraftInputingDownForce: number = 0.001

    @property({ displayName: "风的波动周期" })
    aircraftWaveTime: number = 1.5

    @property({ displayName: "风:飞机低头力度" })
    aircraftDownWaveScaler: number = 0.3

    @property({ displayName: "风:飞机抬头力度" })
    aircraftUpWaveScaler: number = 0.15

    @property({ displayName: "落地翻滚力" })
    aircraftDropLocalTorque: Vec3 = v3(400,0,0)

}