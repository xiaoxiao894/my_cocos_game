import { _decorator, Component, Node, Size, Vec2, screen, view, Widget, UITransform, director, Canvas, Enum, Vec3, math } from 'cc';
import EventManager from '../../EventManager/EventManager';
import EventType from '../../EventManager/EventType';
const { ccclass, property } = _decorator;

@ccclass('AdapterResize')
export class AdapterResize extends Component {

    @property
    designResolution: Size = new Size(1080, 1920)

    @property
    keepScaler: boolean = false;

    @property
    debug: boolean = false;

    _rootNode: Node = null;

    protected onLoad(): void {
        // let wgt = this.node.getComponent(Widget);
        // wgt && (wgt.enabled = false);
        this._rootNode = director.getScene().getComponentInChildren(Canvas).node;
        EventManager.addEventListener(EventType.VIEW_CANVAS_RESIZE, this.updateAdapter, this);
    }

    protected onDestroy(): void {
        EventManager.remveEventListener(EventType.VIEW_CANVAS_RESIZE, this.updateAdapter, this);
    }

    protected onEnable(): void {
        this.updateAdapter();
    }

    private updateAdapter(): void {

        const rootUt = this._rootNode.getComponent(UITransform);
        // const rootScaler = this._rootNode.scale;

        const ut = this.node.getComponent(UITransform);
        let heightScaler = rootUt.height / this.designResolution.height;
        let widthScaler = rootUt.width / this.designResolution.width;

        if (this.debug) {
            console.log("01 - widthScaler:", widthScaler, "heightScaler: ", heightScaler)
        }

        if (this.keepScaler) {
            if (widthScaler == 1.0) {
                widthScaler = heightScaler;
            } else if (heightScaler == 1.0) {
                heightScaler = widthScaler;
            }
            // if(widthScaler < heightScaler) {
            //     widthScaler = heightScaler;
            // }
            // heightScaler = widthScaler;
        }

        if (this.debug) {
            console.log("02 - widthScaler:", widthScaler, "heightScaler: ", heightScaler)
        }

        ut.node.setScale(widthScaler, heightScaler);
    }
}
