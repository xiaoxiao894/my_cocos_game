import { Component } from "cc";
import Entity from "../entitys/Entity";

export default abstract class State extends Component {
    entity: Entity;
 
    /**进入状态 */
    abstract onEnter(callback?: (...agrs: unknown[]) => void);
    /**更新逻辑 */
    abstract onUpdate(dt: number);
    /**退出状态 */
    abstract onExit(callback?: (...agrs: unknown[]) => void);
}
