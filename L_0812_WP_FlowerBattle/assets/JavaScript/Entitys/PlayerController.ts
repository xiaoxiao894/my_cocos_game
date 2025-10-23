import { _decorator, Component, Node, Vec3 } from 'cc';
import { Player } from './Player';
import { App } from '../App';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController {
    private player: Player = null;//玩家
    public static _instance: PlayerController = null;

    public static get Instance() {
        if (this._instance == null) {
            this._instance = new PlayerController();
        }
        return this._instance;
    }
    continueGame() {
        this.player.continue();
       // this.initPlayer();
       
    }
    getPlayer() {
        return this.player;
    }
    initPlayer() {
        this.player = App.sceneNode.player;
        this.player.idle();
    }
    playMove() {
        this.player.move();
    }
    playIdle() {
        this.player.idle();
    }
    playMoveAttack() {
        this.player.moveAttack();
    }
    update(dt: number) {
        //this.player.update(dt);
     

    }



}


