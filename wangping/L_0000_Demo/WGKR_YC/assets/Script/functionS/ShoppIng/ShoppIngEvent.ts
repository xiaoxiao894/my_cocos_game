import { _decorator, Component } from "cc";
const { ccclass, property } = _decorator;

/**购买事件 */
@ccclass('ShoppIngEvent')
export default abstract class ShoppIngEvent extends Component {
    /**每次购买成功调用 */
    public abstract shoppEvent(): void;
    /**shopping 初始话时自动调用 */
    public abstract init(): void;
    public abstract isUse(): boolean;
}