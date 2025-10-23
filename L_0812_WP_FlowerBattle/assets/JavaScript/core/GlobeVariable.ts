import { _decorator } from 'cc';

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

    // 是否开始游戏
    public static isJoyStickBan = false;

    
    public static isCameraMove = false;
    //出生镜头是否结束
    public static isCameraMoveEnd = false;
    // 待机里的回调是否执行
    public static isIdel = false;

    //甲虫的引导是否结束 结束第一次时候移动想镜头
    public static isBeetleGuild = false;

    public static allEnemyNumLimit = 500;

    /** 最大拾取范围的平方 */
    public static maxSquareDis: number = 130;

    public static bearAttackPalingNum_audio: number = 0; //攻击三次不再播放
    public static bearDiegNum_audio: number = 0; //攻击三次不再播放
    public static pylonAttackNum_audio: number = 0; //攻击三次不再播放

    //拦截拒马是否存在
    public static isBlock = false;
    public static isFirstBlock = true;
    public static blockLockNum: number = 0;
    public static blockRest: boolean = true; //拒马交付区域是否显示


    //初始出现的位置
    public static initEnemyBirthPosNumLimit = 10;
    public static initEnemyBirthPosCurUnm = 0;



    //拦截拒马跟前位置下标
    public static blockIndex: number = 0;
    public static restQueue: boolean = false;
    // rvo结束后时间蜘蛛从新移动时间

    public static rvoRestTime: number = 0.6;
    public static rvoRestTimeLimit: number = 0.6;

    // 冲锋甲虫是否冲锋
    public static beetleIsMove: boolean = false;

    //甲虫冲锋不创建敌人
    public static beetleIsMoveEnemy: boolean = false;
    public static beetleLockNum: number = 0;

    //几个之后创建一个大蜘蛛
    public static enemySpiderNumBig: number = 10;
    public static curEnemySpiderNum: number = 1;
    public static bigHp: number = 5;

    public static beetleNumLimit = 10;
    public static beetleCurNum = 0;



    //************************ prefab的路径 ************************ */
    public static prefabPath = {
        // 玩家
        player: 'Prefabs/player/Player',
        // 敌人熊
        EnemyBear: 'Prefabs/xiaoPrefab/BearPrefab',
        // 敌人蜘蛛
        EnemySpider: 'Prefab/Monster/Spider',
        // 敌人蜘蛛
        EnemySpiderL: 'Prefab/Monster/Spider_L',
        // //血条
        BloodBar: 'Prefabs/UI/BloodBar',
        // 爆炸
        TX_Attack_hit: "Prefabs/TX/TX_Attack_hit",
        // 火柴箭塔
        FireArrow: "Prefab/Cons/HuoChaiGun",
        // 炮塔
        TurretBullet: "Prefab/Cons/JiaoNang",
        //冲锋甲虫
        Beetle: "Prefab/JiaChong",
        // 金币
        Coin: "Prefab/Icon/dropItem",
        // 引导箭头3d
        Guid_Arrow3D: "Prefab/Tip/Arrow",
        // 引导箭头
        Guid_ArrowPath: "Prefab/Tip/PathArrow",
        // 花瓣特效
        FlowerTx: "Prefab/TX/TX_huaban",
        // 炮塔攻击
        TurretTx: "Prefab/TX/TX_fashe",
        // 炮塔攻击
        TurretBombTx: "Prefab/TX/TX_jizhong_10",
        ArrowTX: "Prefab/TX/TX_jizhong_08",
        BeetleCollideTx: "Prefab/TX/TX_jizhong_12",

    }

    public static entifyName = {
        // 玩家
        player: 'Player',
        // 敌人
        EnemyBear: 'BearPrefab',
        // 敌人蜘蛛
        EnemySpider: 'Spider',
        //血条
        BloodBar: 'BloodBar',
        // 爆炸
        TX_Attack_hit: "TX_Attack_hit",
        // 火柴箭塔
        FireArrow: "HuoChaiGun",
        // 炮塔
        TurretBullet: "TurretBullet",
        //冲锋甲虫
        Beetle: "JiaChong",
        // 金币
        Coin: "Coin",
        // 引导箭头
        Guid_ArrowPath: "PathArrow",
        // 花瓣特效
        FlowerTx: "TX_huaban",
        // 炮塔攻击
        TurretTx: "TX_fashe",
        // 炮塔攻击
        TurretBombTx: "TX_jizhong_10",
        ArrowTX: "TX_jizhong_08",
        // 敌人蜘蛛
        EnemySpiderL: 'Spider_L',
        BeetleCollideTx: "TX_jizhong_12",

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
    // public static handVoer = {
    //     pass_1: {
    //         maxCoin: 10,//10
    //         curCoin: 0,
    //         isShow: false,
    //     }, pass_2: {
    //         maxCoin: 15,//15
    //         curCoin: 0,
    //         isShow: false,
    //     }, pass_3: {
    //         maxCoin: 45,//45
    //         curCoin: 0,
    //         isShow: false,
    //     }
    //     , pass_4: {
    //         maxCoin: 45,//45
    //         curCoin: 0,
    //         isShow: false,
    //     }
    //     , pass_5: {
    //         maxCoin: 10,//10
    //         curCoin: 0,
    //         isShow: false,
    //     }
    //     , pass_6: {
    //         maxCoin: 10,//10
    //         curCoin: 0,
    //         isShow: false,
    //     }
    //     , pass_7: {
    //         maxCoin: 45,//45
    //         curCoin: 0,
    //         isShow: false,
    //     }
    //     , pass_8: {
    //         maxCoin: 95,//95
    //         curCoin: 0,
    //         isShow: false,
    //     }
    //     , pass_9: {
    //         maxCoin: 95,//95
    //         curCoin: 0,
    //         isShow: false,
    //     }
    //     , pass_10: {
    //         maxCoin: 120,//120
    //         curCoin: 0,
    //         isShow: false,
    //     }

    // }

    /**
     * maxCoin 解锁区域 需要的金币 和
     * curCoin 当前区域 已获得的金币
     * isShow 是否显示
     *  12 初始两个塔区域  3 4 围栏升级 塔区域   5 是扩建地块区域
     *  6 金矿出金币机器 
     */
    public static handVoer = {
        "UI_jianta": {
            maxCoin: 5,//5
            curCoin: 0,
            isShow: false,
            showCoin: 0,

        }, "UI_paota": {
            maxCoin: 60,//60
            curCoin: 0,
            isShow: false,
            showCoin: 0,
        }, "UI_juma": {
            maxCoin: 20,//20
            curCoin: 0,
            isShow: false,
            showCoin: 0,
        }
        , "UI_juma-001": {
            maxCoin: 200,//200
            curCoin: 0,
            isShow: false,
            showCoin: 0,
        }
        , "UI_jiachong": {
            maxCoin: 150,//150
            curCoin: 0,
            isShow: false,
            showCoin: 0,
        }
        , "UI_jiachong-001": {
            maxCoin: 50,//50
            curCoin: 0,
            isShow: false,
            showCoin: 0,
        }
        , "UI_shirenhua": {
            maxCoin: 100,//100
            curCoin: 0,
            isShow: false,
            showCoin: 0,
        }

    }
    public static handOverArea: string[] = ["UI_jianta", "UI_paota", "UI_juma", "UI_juma-001", "UI_jiachong", "UI_jiachong-001", "UI_shirenhua"]

    public static continueGame() {
        GlobeVariable.handVoer = {
            "UI_jianta": {
                maxCoin: 5,//5
                curCoin: 0,
                isShow: false,
                showCoin: 0,

            }, "UI_paota": {
                maxCoin: 60,//60
                curCoin: 0,
                isShow: false,
                showCoin: 0,
            }, "UI_juma": {
                maxCoin: 20,//20
                curCoin: 0,
                isShow: false,
                showCoin: 0,
            }
            , "UI_juma-001": {
                maxCoin: 200,//200
                curCoin: 0,
                isShow: false,
                showCoin: 0,
            }
            , "UI_jiachong": {
                maxCoin: 150,//150
                curCoin: 0,
                isShow: false,
                showCoin: 0,
            }
            , "UI_jiachong-001": {
                maxCoin: 50,//50
                curCoin: 0,
                isShow: false,
                showCoin: 0,
            }, "UI_shirenhua": {
                maxCoin: 200,//200
                curCoin: 0,
                isShow: false,
                showCoin: 0,
            }

        }
    }
}


