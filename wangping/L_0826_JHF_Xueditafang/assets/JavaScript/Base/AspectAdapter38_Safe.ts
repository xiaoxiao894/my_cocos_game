import {
  _decorator, Component, view, ResolutionPolicy,
  director, Widget, Layout
} from 'cc';
import { DataManager } from '../Global/DataManager';
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('AspectAdapter38_Safe')
@executeInEditMode()
export class AspectAdapter38_Safe extends Component {
  @property({ tooltip: '设计分辨率宽' }) designWidth = 720;
  @property({ tooltip: '设计分辨率高' }) designHeight = 1280;
  @property({ tooltip: '宽高比值' }) threshold = 1.0;
  @property({ tooltip: '镜头小于1:1' }) greaterThanCameraZoomRatio = 1;
  @property({ tooltip: '镜头大于1:1' }) lessThanCameraZoomRatio = 2;

  private _pending = false;          
  private _applying = false;         
  private _lastKey: string | null = null; 

  onLoad() {
    this._onResize();
  }

  onEnable() {
    view.on('canvas-resize', this._onResize, this);
    this._onResize();                 // 启用时触发一次
  }

  onDisable() {
    view.off('canvas-resize', this._onResize, this);
  }

  private _onResize = () => {
    if (this._pending) return;
    this._pending = true;
    // 延后一帧处理，等引擎内部尺寸稳定
    this.scheduleOnce(this._applyNow, 0);
  };

  private _applyNow = () => {
    this._pending = false;
    if (this._applying) return;
    this._applying = true;

    const { width: sw, height: sh } = view.getCanvasSize();
    if (sw <= 0 || sh <= 0) { this._applying = false; return; }

    const aspect = sw / sh;

    if (aspect >= this.threshold) {
      // 宽/高 ≥ 1：保持 1:1，不再变化 高
      const side = this.designWidth;
      const policy = ResolutionPolicy.FIXED_HEIGHT;
      const key = `${policy}:${side}x${side}`;
      if (this._lastKey !== key) {
        this._lastKey = key;
        view.setDesignResolutionSize(side, side, policy);
        this.scheduleOnce(this._refreshUIOnce, 0);
        DataManager.Instance.mainCamera.camera.orthoHeight = this.greaterThanCameraZoomRatio;
        console.log("大于1： 1");
      }

    } else {
      // 宽/高 < 1：正常缩放  宽
      const dw = this.designWidth, dh = this.designHeight;
      const policy = ResolutionPolicy.FIXED_WIDTH;  // 随宽
      const key = `${policy}:${dw}x${dh}`;
      if (this._lastKey !== key) {
        this._lastKey = key;
        view.setDesignResolutionSize(dw, dh, policy);
        this.scheduleOnce(this._refreshUIOnce, 0);
        DataManager.Instance.mainCamera.camera.orthoHeight = this.lessThanCameraZoomRatio;
        console.log("小于1： 1");

      }
    }
    this._applying = false;
  };

  private _refreshUIOnce = () => {
    const scene = director.getScene();
    if (!scene) return;

    for (const w of scene.getComponentsInChildren(Widget)) w.updateAlignment();
    for (const l of scene.getComponentsInChildren(Layout)) l.updateLayout();
  };
}