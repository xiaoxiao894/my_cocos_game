import Player from "../Player";


export default abstract class State  {
    entity: Player;
    
    constructor(entity: Player) {
        this.entity = entity;
    }
    
    /**进入状态 */
    abstract onEnter(callback?: (...agrs: unknown[]) => void);
    /**更新逻辑 */
    abstract onUpdate(dt: number);
    /**退出状态 */
    abstract onExit(callback?: (...agrs: unknown[]) => void);
}
