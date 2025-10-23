import { Node } from "cc";
export interface DamageData {
    damage: number;
    damageSource: Node;
    /** 是否无视免疫 */
    ignoreImmunity: boolean;
}