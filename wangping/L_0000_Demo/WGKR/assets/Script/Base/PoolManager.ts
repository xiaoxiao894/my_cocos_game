import { ccenum } from "cc";
import Singleton from "./Singleton";

export default class PoolManager extends Singleton {


    public static get instance() {
        return this.getInstance<PoolManager>();
    }

    private _pool: { [key: string]: any[] };


    private constructor() {
        super();
        this._pool = {};
    }
    /**
     * 获取缓存对象
     * @param key key=PoolEnum+当前Pool类型枚举     举例道具Key：PoolEnum.prop+PropEnum.gold
     * 
     * @returns 
     */
    public getPool<T>(key: string): T {
        let arr = this._pool[key];
        if (!arr) {
            this._pool[key] = arr = [];
            return null;
        }
        if (arr.length) {
            return arr.pop();
        }
        return null;
    }
    /**
     * 将对象添加的缓存池
     * @param key key=PoolEnum+当前Pool类型枚举     举例道具Key：PoolEnum.prop+PropEnum.gold
     * @param node 添加的对象
     */
    public setPool(key: string, node: any) {
        let arr = this._pool[key];
        if (!arr) {
            arr = this._pool[key] = [];
        }
        arr.push(node);
    }
}
export enum PoolEnum {
    Prop = "Prop_",
    JumpSequence = "JumpSequence_",
    bullet = "bullet_",
    monsterManager = "MonsterManager_",
    bullet_hit = "Bullet_hit_",
    skill = "skill_",
    skill_hit = "skill_hit_",
    effect = "effect_",
    AI = "AI_",
    EffectSq = "EffectSq_",
}
ccenum(PoolEnum)