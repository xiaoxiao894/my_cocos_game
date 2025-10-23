export namespace Config {
    export const UNLOCK_CHECK_INTERVAL: number = 0.02; // 每0.02秒检查一次



    // ### 玩家造成的伤害
    // - 普通伤害：`#FFD700`（金黄色）- 明亮而积极，象征玩家的力量
    // - 暴击伤害：`#FF4500`（橙红色）- 更加醒目，表示玩家的强力一击
    // - 技能伤害：`#00BFFF`（深天蓝）- 表示特殊技能的魔法属性

    // ### 敌人造成的伤害
    // - 普通伤害：`#FF6347`（番茄红）- 警示性强，表示受到敌人攻击
    // - 暴击伤害：`#DC143C`（猩红色）- 更深的红色，表示严重威胁
    // - 技能伤害：`#8A2BE2`（紫罗兰）- 表示敌人的特殊攻击

    // ### 其他特殊状态
    // - 治疗效果：`#32CD32`（酸橙绿）- 明亮的绿色，表示生命恢复
    // - 减益效果：`#708090`（灰色）- 表示属性降低
    // - 增益效果：`#1E90FF`（道奇蓝）- 表示属性提升

    export const PLAYER_DAMAGE_COLOR: string = '#FFD700';
    export const PLAYER_CRITICAL_DAMAGE_COLOR: string = '#FF4500';
    export const PLAYER_SKILL_DAMAGE_COLOR: string = '#00BFFF';

    export const ENEMY_DAMAGE_COLOR: string = '#FF6347';
    export const ENEMY_CRITICAL_DAMAGE_COLOR: string = '#DC143C';
    export const ENEMY_SKILL_DAMAGE_COLOR: string = '#8A2BE2';

    export const HEAL_EFFECT_COLOR: string = '#32CD32';
    export const DEBUFF_EFFECT_COLOR: string = '#708090';
    export const BUFF_EFFECT_COLOR: string = '#1E90FF';

    export class EnemyConfig {
        // 当前敌人血量配置
        public static readonly diffCfg : {[difficulty: number]: {
            spawnBatchSize: number, // 每批生成数量
            spawnEliteBatchSize: number, // 每批生成精英怪数量
            batchInterval: number, // 批次间隔（秒）
            enemyInterval: number, // 同批敌人间隔（秒）
            enemyHP: number, // 敌人血量
            eliteEnemyHP: number, // 精英怪血量
        }} = {
            1: {
                spawnBatchSize: 3,  
                spawnEliteBatchSize: 0,
                batchInterval: 2,
                enemyInterval: 0.5,
                enemyHP: 140,
                eliteEnemyHP: 0
            },
            2: {
                spawnBatchSize: 4,
                spawnEliteBatchSize: 0,
                batchInterval: 2,
                enemyInterval: 0.5,
                enemyHP: 120,
                eliteEnemyHP: 0
            },
            3: {
                spawnBatchSize: 5,
                spawnEliteBatchSize: 0,
                batchInterval: 2,
                enemyInterval: 0.5,
                enemyHP: 190,
                eliteEnemyHP: 0
            },
            4: {
                spawnBatchSize: 5,
                spawnEliteBatchSize: 0,
                batchInterval: 2,
                enemyInterval: 0.5,
                enemyHP: 200,
                eliteEnemyHP: 0
            }
        };
    
        // 次要敌人生成器波次配置
        public static readonly subSpawnerCfg : {[wave: number]: {
            spawnBatchSize: number, // 每批生成数量
            spawnEliteBatchSize: number, // 每批生成精英怪数量
            batchInterval: number, // 批次间隔（秒）
            enemyInterval: number, // 同批敌人间隔（秒）
            enemyHP: number, // 敌人血量
            eliteEnemyHP: number, // 精英怪血量
            wave: number, // 波次
        }} = {
            1: {
                spawnBatchSize: 10,
                spawnEliteBatchSize: 1,
                batchInterval: 4,
                enemyInterval: 0.3,
                enemyHP: 250,
                eliteEnemyHP: 2500,
                wave: 2
            },
            2: {
                spawnBatchSize: 10,
                spawnEliteBatchSize: 1,
                batchInterval: 4,
                enemyInterval: 0.3,
                enemyHP: 270,
                eliteEnemyHP: 2500,
                wave: 3
            },
            3: {
                spawnBatchSize: 15,
                spawnEliteBatchSize: 1,
                batchInterval: 6,
                enemyInterval: 0.3,
                enemyHP: 340,
                eliteEnemyHP: 3500,
                wave: 3
            }
        };
    }
}
