import { _decorator, Component, instantiate, math, Node, Vec3 } from 'cc';
import { DataManager } from '../Global/DataManager';
import { ItemTreeManager } from './ItemTreeManager';
import { EntityTypeEnum, TreeAniData } from '../Enum/Index';
const { ccclass, property } = _decorator;

@ccclass('TreeManager')
export class TreeManager extends Component {
    @property(Node)
    scatteredTreePoints: Node = null;

    private _treeCount = 0;

    private _treeStartPoint = new Vec3(-36, 0, -16)
    private _treeRow = 14;
    private _treeCol = 4;
    private _frontToBackSpacing = 5.5;
    private _leftToRightSpacing = 5.5;

    public get treeSpacingX(): number {
        return this._leftToRightSpacing;
    }

    public get treeSpacingZ(): number {
        return this._frontToBackSpacing;
    }

    public get treeStartPoint(): Vec3 {
        return this._treeStartPoint.clone();
    }

    start() {
        DataManager.Instance.treeManager = this;
    }

    initTreeSystem() {
        for (let i = 0; i < this.node.children.length; i++) {
            const tree = this.node.children[i];

            DataManager.Instance.gridSystem.updateNode(tree);
        }
    }

    // 受击树   
    affectedTrees(nodes: Node[], isPlayer = true, role) {
        for (let node of nodes) {
            let tree: ItemTreeManager = node.getComponent(ItemTreeManager);
            if (tree) {
                tree.affectedAni(isPlayer, role);
            }
        }
    }

    initTrees() {
        const { _treeRow, _treeCol, _treeStartPoint, _leftToRightSpacing, _frontToBackSpacing } = this;

        for (let r = 0; r < _treeRow; r++) {
            DataManager.Instance.treeMatrix.push([])
            for (let c = 0; c < _treeCol; c++) {
                const treePrefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.Tree);
                const tree = instantiate(treePrefab);
                tree[`__treeNum`] = this._treeCount;
                tree.setParent(this.node);

                // 计算每棵树的位置
                const posX = _treeStartPoint.x + c * _leftToRightSpacing;
                const posZ = _treeStartPoint.z + r * _frontToBackSpacing;
                tree.setPosition(new Vec3(posX, _treeStartPoint.y, posZ));
                tree.children[0].eulerAngles = new Vec3(0, Math.floor(math.random() * 360), 0);
                tree.getComponent(ItemTreeManager).init(r * _treeRow + c);

                this._treeCount++;
                DataManager.Instance.treeMatrix[r].push(tree);
            }
        }

        // 散落在场景中的树
        for (let i = 0; i < this.scatteredTreePoints.children.length; i++) {
            const treePoint = this.scatteredTreePoints.children[i];

            const treePrefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.Tree);
            const tree = instantiate(treePrefab);
            tree[`__treeNum`] = this._treeCount;
            tree.setParent(this.node);

            tree.setPosition(new Vec3(treePoint.position.x, _treeStartPoint.y, treePoint.position.z));
            tree.children[0].eulerAngles = new Vec3(0, Math.floor(math.random() * 360), 0);

            this._treeCount++;
        }
    }

    /** 播动画 */
    public playAni(aniData: TreeAniData[]) {
        let row: number = this._treeRow;
        let indexList: number[] = [];
        for (let i = 0; i < aniData.length; i++) {
            let index: number = aniData[i].tree.y * row + aniData[i].tree.x;
            indexList.push(index);
            //console.log("index",index, aniData[i].tree.x, aniData[i].tree.y);
        }
        for (let i = 0; i < this.node.children.length; i++) {
            let tree: Node = this.node.children[i];
            if (tree) {
                let treeItem: ItemTreeManager = tree.getComponent(ItemTreeManager);
                if (treeItem) {
                    let index: number = treeItem.Index;
                    if (indexList.indexOf(index) !== -1) {
                        treeItem.playAni(aniData[indexList.indexOf(index)].dir);
                    }
                }
            }
        }
    }

    // 查找树
    public findRemoveTree(tree: Node): { r: number; c: number } {
        const M = DataManager.Instance.treeMatrix;
        for (let r = 0; r < M.length; r++) {
            for (let c = 0; c < M[r].length; c++) {
                if (M[r][c] === tree) {
                    M[r][c] = null as any;
                    return { r, c };
                }
            }
        }
        return { r: -1, c: -1 }; // 没找到
    }
}


