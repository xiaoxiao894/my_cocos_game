import { _decorator, Component, Node } from 'cc';
import { EnemyTree } from '../entitys/EnemyTree';
const { ccclass, property } = _decorator;

@ccclass('TreeController')
export class TreeController  {

    private enemyTreeList: EnemyTree[] = [];
    public static _instance: TreeController = null;
    public static get Instance() {
        if (this._instance == null) {
            this._instance = new TreeController();
        }
        return this._instance;
    }
    //初始第一进入地块 解锁4 个砍伐一个在解锁一个
    //private squenceTree: number = 4;
    private curCutTreeIndex: number = 0;
    //第一解锁多少
    private unLockTreeNum: number = 4;
    private parentNode: Node = null;
    initAllTree(parentNode: Node) {
        this.parentNode = parentNode;
        for (let i = 0; i < this.parentNode.children.length; i++) { //this.parentNode.children.length
            let enemyTree = this.parentNode.children[i];
            let enemyTreeComp = enemyTree.getComponent(EnemyTree);
            if (i < this.unLockTreeNum) {

                enemyTreeComp.setFindState(true);
                enemyTreeComp.showArrowTarger();
                this.curCutTreeIndex += 1;
            }

            this.enemyTreeList.push(enemyTreeComp);
            
        }
    }
    onLoad() {


    }
    netxTree() {
        if (this.curCutTreeIndex >= this.enemyTreeList.length) {
            //this.curCutTreeIndex = 0;
            return;
        }
        let enemyTreeComp = this.enemyTreeList[this.curCutTreeIndex]
        enemyTreeComp.setFindState(true);
        enemyTreeComp.showArrowTarger();
        this.curCutTreeIndex += 1;


    }

    update(deltaTime: number) {

    }
}
// 导出全局单例
export const treeController = TreeController.Instance;


