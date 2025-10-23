import { _decorator, Component, gfx, renderer, Material, Texture2D, SkinnedMeshRenderer, MeshRenderer, tween, Tween } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 溶解效果组件
 * 用于控制3D模型的溶解动画效果，支持多种溶解模式
 */
@ccclass('Dissolve')
export class Dissolve extends Component {
    @property({
        type: MeshRenderer,
        displayName: '蒙皮网格渲染器',
        tooltip: '用于渲染3D模型'
    })
    mr: MeshRenderer | null = null;

    private _progress = { dissolve: 0 };

    Dissolve() {
        Tween.stopAllByTarget(this._progress);
        this._progress.dissolve = 0;
        tween(this._progress).delay(0.1*Math.random()).to(2, { dissolve: 1 }, { onUpdate: (target, ratio) => {
            this.mr.material.setProperty('dissolveThreshold', target.dissolve, 0);
            this.mr.material.setProperty('dissolveThreshold', target.dissolve, 1);
        }}).start();
        
    }

    reset(){
        Tween.stopAllByTarget(this._progress);
        this._progress.dissolve = 0;
        this.mr.material.setProperty('dissolveThreshold', 0, 0);
        this.mr.material.setProperty('dissolveThreshold', 0, 1);
    }

}

