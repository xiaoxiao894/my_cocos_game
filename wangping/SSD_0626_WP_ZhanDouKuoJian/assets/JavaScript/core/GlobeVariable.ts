import { _decorator, Prefab, Vec3, Node } from 'cc';


import { UIJoyStick } from '../UI/UIJoyStick';
import { EnemyBear } from '../Entitys/EnemyBear';

const { ccclass, property } = _decorator;

@ccclass('GlobeVariable')
export class GlobeVariable {


    // ****** 关于摇杆的全家条件判断
    public static isTouching = false;
    public static isDeactivateVirtualJoystick = false;
    // 是否结束游戏
    public static isGameEnd = false;
    // 是否开始游戏
    public static isStartGame = false;


    public static allEnemyNumLimit = 8;
    private static enemyNumPhase = 0;

    public static enemyDelayedTime: number = 1;


    /** 最大拾取范围的平方 */
    public static maxSquareDis: number = 150;

    public static bearAttackPalingNum_audio: number = 0; //攻击三次不再播放
    public static bearDiegNum_audio: number = 0; //攻击三次不再播放
    public static pylonAttackNum_audio: number = 0; //攻击三次不再播放

    // public static handOverArea:boolean = false; //是否交付区域
    // public static handOverPhase:boolean = false; //是否交付阶段
    // public static collectCoin:boolean = false; //是否收集金币


    public static addEnemyPhase() {
        this.enemyNumPhase += 1;



        // 定义阶段对应的敌人数量限制，索引0对应阶段1，索引1对应阶段2，以此类推
        let limits = [12, 20, 30, 35, 60, 75];
        let limits1 = [0.4, 0.15, 0.05, 0.05, 0.1, 0.075];
        this.enemyDelayedTime -= limits1[this.enemyNumPhase - 1];


        // 取对应阶段的值，如果超过定义的阶段数则使用最后一个值
        if (this.enemyNumPhase <= limits.length) {
            this.allEnemyNumLimit = limits[this.enemyNumPhase - 1];
        } else {
            this.allEnemyNumLimit = limits[limits.length - 1];
        }
    }


    //************************ prefab的路径 ************************ */
    public static prefabPath = {
        // 玩家
        player: 'Prefabs/player/Player',
        // 敌人
        EnemyBear: 'Prefabs/xiaoPrefab/BearPrefab',
        //血条
        BloodBar: 'Prefabs/UI/BloodBar',
        // 金币
        Coin: "Prefab/Icon/dropItem",
        // 子弹
        bulletEffect: "Prefab/Prop/Electricity",

        // 伙伴
        Parter: 'Prefabs/parter',
        // 爆炸
        TX_Attack_hit: "Prefabs/TX/TX_hit",
        // 引导箭头3d
        Guid_Arrow3D: "Prefab/Tip/Arrow",
        // 引导箭头
        Guid_ArrowPath: "Prefab/Tip/PathArrow",
        PalingBloodBar: "Prefabs/UI/BloodPaling",
        ElectricBullet: "TX_dian/TX_dian_v1",


    }

    public static entifyName = {
        // 玩家
        player: 'Player',
        // 敌人
        EnemyBear: 'BearPrefab',
        //血条
        BloodBar: 'BloodBar',
        // 金币
        Coin: "Coin",
        //子弹
        bulletEffect: "pylonAttackEffect",

        // 伙伴
        Parter: "parter",
        // 爆炸
        TX_Attack_hit: "TX_hit",
        // 引导箭头
        Guid_ArrowPath: "PathArrow",
        PalingBloodBar: "PalingBloodBar",
        ElectricBullet: "TX_dian_v1",


    }

    // 金币数量
    public static globCoinNum = 0;
    //金币初始数量
    public static coinStartNum = 5;
    //当前碰撞的区域
    public static g_curArea = 1;

    public static playerLevel = 0;

    /**
     * maxCoin 解锁区域 需要的金币 和
     * curCoin 当前区域 已获得的金币
     * isShow 是否显示
     *  12 初始两个塔区域  3 4 围栏升级 塔区域   5 是扩建地块区域
     *  6 金矿出金币机器 
     */
    public static handVoer = {
        pass_1: {
            maxCoin: 10,//10
            curCoin: 0,
            showCoin: 0,
            isShow: false,
        }, pass_2: {
            maxCoin: 10,//10
            curCoin: 0,
            showCoin: 0,

            isShow: false,
        }, pass_3: {
            maxCoin: 45,//45
            curCoin: 0,
            showCoin: 0,

            isShow: false,
        }
        , pass_4: {
            maxCoin: 45,//45
            curCoin: 0,
            showCoin: 0,

            isShow: false,
        }
        , pass_5: {
            maxCoin: 10,//10
            curCoin: 0,
            showCoin: 0,

            isShow: false,
        }
        , pass_6: {
            maxCoin: 10,//10
            curCoin: 0,
            showCoin: 0,

            isShow: false,
        }
        , pass_7: {
            maxCoin: 45,//45
            curCoin: 0,
            showCoin: 0,

            isShow: false,
        }
        , pass_8: {
            maxCoin: 95,//95
            curCoin: 0,
            showCoin: 0,

            isShow: false,
        }
        , pass_9: {
            maxCoin: 95,//95
            curCoin: 0,
            showCoin: 0,

            isShow: false,
        }
        , pass_10: {
            maxCoin: 120,//120
            curCoin: 0,
            showCoin: 0,

            isShow: false,
        }

    }



}


