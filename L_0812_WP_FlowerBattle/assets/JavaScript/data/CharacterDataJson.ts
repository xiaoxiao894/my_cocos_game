export interface CharacterDataJson {
    /** 角色唯一ID */
    id: number;
    /** 角色名称 */
    name: string;
    /** 移动速度 */
    moveSpeed: number;
    /** 攻击范围 */
    attackRange: number;
    /** 攻击伤害 */
    attackDamage: number;
    /** 攻击间隔 */
    attackInterval: number;
    /** 初始生命值 */
    hp: number;
    /** 最大生命值 */
    maxHp: number;
    /**最大数量  可选-1表示没有此属性*/
    maxNum: number;

}