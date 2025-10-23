
import { Camera,  Component, dynamicAtlasManager, Node, _decorator } from 'cc';
import WaveMng from '../logics/mng/WaveMng';
import { player } from '../rolectl/player';
import { Vector2 } from '../RVO/Common';
import { Simulator } from '../RVO/Simulator';
import { monsterCtl } from './monsterCtl';
const { ccclass, property } = _decorator;

// 关闭web的动态合图
// dynamicAtlasManager.enabled = false

export default class Game {
    public limitMonst: number = 400
    private static instance: Game = null;
    public static get Instance(): Game {
        if (this.instance == null)
            this.instance = new Game();
        return this.instance;
    }

    private _Player: player;
    public get Player(): player {
        return this._Player;
    }
    public set Player(value: player) {
        this._Player = value;
    }

    private _monsterRootNode: Node;
    public get monsterRootNode(): Node {
        return this._monsterRootNode;
    }
    public set monsterRootNode(value: Node) {
        this._monsterRootNode = value;
    }

    private _camera: Camera;
    public get camera(): Camera {
        return this._camera;
    }
    public set camera(value: Camera) {
        this._camera = value;
    }
}

@ccclass('Test2')
export class Test2 extends Component {
    @property(Camera)
    camera: Camera;
    @property(Node)
    avatarLayer: Node;
    @property(player)
    player: player

    onEnable() {
        Game.Instance.Player = this.player
        Game.Instance.monsterRootNode = this.avatarLayer
        Game.Instance.camera = this.camera// this.node.getComponent(this.camera)
    }

    onDisable() {
    }

    _bigRedBall: Node
    start() {
        // let simulator = Simulator.instance;
        Simulator.instance.setAgentDefaults(60, 3, 1, 0.1, 14, 80, new Vector2(0, 0));
    }

    _framTimes = 0
    _dt: number = 0
    update(dt: number) {
        //测试怪物生成RVO
        this._dt += dt
        if (this._dt > 0.5) {
            this._dt = 0
            this.getComponent(WaveMng).createMonster()
        }

        // 更新逻辑坐标
        Simulator.instance.run(dt);
        this._framTimes = 0
        for (let index = 0; index < Game.Instance.Player.monsterList.length; index++) {
            const monster = Game.Instance.Player.monsterList[index];
            monster.getComponent(monsterCtl).moveByRvo()
        }

    }
}   