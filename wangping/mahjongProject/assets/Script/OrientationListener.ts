import { _decorator, Component, screen,Node } from 'cc';
const { ccclass, property } = _decorator;
@ccclass('OrientationListener')
export class OrientationListener extends Component {
    // 记录上一次的屏幕方向（用于判断是否发生旋转）
    private _lastIsLandscape: boolean = false;
    @property(Node)
    private containerNode: Node = null;

    private lastheight:number = 0

    onLoad() {
        // 初始化时记录当前方向
        const { width, height } = screen.windowSize;
        this._lastIsLandscape = width > height;
        this.lastheight = height;
        
        // 监听屏幕尺寸变化（包括旋转）
        screen.on('window-resize', this.onWindowResize, this);
    }

    // 屏幕尺寸变化时触发（旋转会导致宽高变化）
    private onWindowResize() {
        const { width, height } = screen.windowSize;
        const currentIsLandscape = width > height;

        // 判断是否发生了横竖屏切换（从竖屏→横屏 或 横屏→竖屏）
        if (currentIsLandscape !== this._lastIsLandscape) {
            if (currentIsLandscape) {
                console.log('竖屏切换为横屏');
                // 执行横屏逻辑（如调整UI布局、重新计算位置等）
              //  this.handleLandscape();
            } else {
                console.log('横屏切换为竖屏');
                // 执行竖屏逻辑
               // this.handlePortrait();
            }
            this.containerNode.setScale(  this.lastheight / height,  this.lastheight / height)
          
            // 更新记录的方向
            this._lastIsLandscape = currentIsLandscape;
        }
    }

    // 横屏处理逻辑
    private handleLandscape() {
        // 例如：调整节点位置、修改布局参数等
        this.containerNode.setScale(2, 2);
    }

    // 竖屏处理逻辑
    private handlePortrait() {
        // 例如：恢复节点位置、调整字体大小等
        this.containerNode.setScale(1, 1);
    }

    onDestroy() {
        // 移除事件监听，避免内存泄漏
        screen.off('window-resize', this.onWindowResize, this);
    }
}