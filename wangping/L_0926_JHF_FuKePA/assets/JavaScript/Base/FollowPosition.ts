import { _decorator, Component, Node, Vec3, Quat } from 'cc';
const { ccclass, property } = _decorator;

const vTmp = new Vec3();

@ccclass('FollowPosition')
export class FollowPosition extends Component {
  @property(Node)
  target: Node = null!;           // 跟随的“当前节点”（移动的那个）

  @property({ tooltip: '是否随目标旋转一起旋转偏移' })
  useRotation = true;

  @property({ tooltip: '是否锁定Y轴高度（保持初始高度不变）' })
  lockY = false;

  private _offsetLocal = new Vec3();   // 目标坐标系下的偏移
  private _initHeight = 0;             // 锁Y时用

  onLoad() {
    if (!this.target) {
      console.warn('[FollowPosition] target 未设置');
      return;
    }

    // 计算“初始相对位置”
    const targetPos = this.target.worldPosition;
    const selfPos = this.node.worldPosition;

    // 将世界偏移转换为“目标的本地方向偏移”
    // 等价：offsetLocal = inv(R_target) * (selfPos - targetPos)
    const rot = this.target.worldRotation;
    const inv = new Quat();
    Quat.invert(inv, rot);

    Vec3.subtract(this._offsetLocal, selfPos, targetPos);
    Vec3.transformQuat(this._offsetLocal, this._offsetLocal, inv);

    // 记录初始高度（可选）
    this._initHeight = selfPos.y;
  }

  lateUpdate() {
    if (!this.target) return;

    // 得到世界空间下的偏移
    if (this.useRotation) {
      // 偏移随目标旋转
      Vec3.transformQuat(vTmp, this._offsetLocal, this.target.worldRotation);
    } else {
      // 偏移不随目标旋转（仅保持初始方向和距离）
      vTmp.set(this._offsetLocal);
    }

    // 世界位置 = 目标世界位置 + 偏移
    Vec3.add(vTmp, vTmp, this.target.worldPosition);

    if (this.lockY) {
      vTmp.y = this._initHeight;
    }

    this.node.setWorldPosition(vTmp);
  }
}
