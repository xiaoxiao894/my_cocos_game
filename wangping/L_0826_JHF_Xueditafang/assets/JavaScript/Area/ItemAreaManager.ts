import { _decorator, Component, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ItemAreaManager')
export class ItemAreaManager extends Component {
    private _duration = 0.3;

    @property({
        tooltip: "技能生成位置的随机偏移范围（单位：米）",
    })
    public radiusRandomOffset: number = 3;

    @property({
        tooltip: "技能释放的整体朝向角度（绕Y轴，单位：度）",
    })
    public directionAngleDeg: number = 0;

    @property({
        tooltip: "技能检测的影响半径（仅XZ平面）",
    })
    public skillDetectRadius: number = 4;

    @property({
        tooltip: "第一圈技能的半径（单位：米）",
    })
    public initialRadius: number = 5;

    @property({
        tooltip: "每一圈向外扩展的间隔距离（单位：米）",
    })
    public ringStep: number = 5;

    @property({
        tooltip: "总共生成多少圈技能效果",
    })
    public ringCount: number = 5;

    @property({
        tooltip: "每一圈释放技能的延迟时间（单位：秒）",
    })
    public delayPerRing: number = 0.3;

    @property({
        tooltip: "技能扇形的覆盖角度（单位：度）",
    })
    public spreadAngle: number = 130;


    displayAni(node) {
        tween(node)
            .to(this._duration, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' }) // 带弹性效果
            .start();
    }
}

