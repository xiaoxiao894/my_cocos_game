import { _decorator, CCFloat, CCInteger, Component, Node, view } from 'cc';
const { ccclass, property } = _decorator;

/** 8倍镜缩放值 */
@ccclass('LensScale')
export class LensScale extends Component {

    @property({type:CCFloat,tooltip:"缩放最大值"})
    maxScale:number = 1.5;

    @property({type:CCFloat,tooltip:"缩放最小值"})
    minScale:number = 0.5;

    start() {
        //初始化瞄准镜大小
        let scale:number = this.node.getScale().x;
        const visibleSize = view.getVisibleSize(); // 屏幕可见区域
        scale = scale * ((visibleSize.width/visibleSize.height)/(720/1280));
        scale = Math.min(this.maxScale,Math.max(this.minScale,scale));
        this.node.setScale(scale,scale);
    }

    update(deltaTime: number) {
        
    }
}


