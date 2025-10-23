import { _decorator, Component, EventTouch, Input, Animation, screen, instantiate, Node, Prefab, Sprite, tween, UIOpacity, UITransform, Vec3, find, Vec2 } from 'cc';
import { MahjongItemData } from './MahjongItemData';
import { App } from './App';
import { GlobeVariable } from './GlobeVariable';
import { EffectNode } from './EffectNode';
import { SoundManager } from './SoundManager';
import super_html_playable from './super_html_playable';
const { ccclass, property } = _decorator;

@ccclass('MahjongGame')
export class MahjongGame extends Component {
    @property({ type: Prefab })
    elementPrefab: Prefab = null; // 元素预制体

    @property({ type: Node })
    container: Node = null; // 元素容器

    @property({ type: Node })
    effectParent: Node = null; // 元素容器

    @property({ type: Node })
    warnUI: Node = null; // 警告UI

    @property(Node)
    UIBox: Node = null;

    private guideStep: number = 0; // 新手引导步骤
    private guideFristData: MahjongItemData = null; // 新手引导首次选中的元素
    private handeNode: Node = null;
    private guideNormal: boolean = true; //是否安装正常的引导步骤

    rowCount: number = 15; // 行数

    colCount: number = 15; // 列数

    colSpacing: number = 174; // 列间距（水平）

    rowSpacing: number = 213 // 行间距（垂直）

    private elements: MahjongItemData[][] = []; // 二维数组管理元素
    private firstSelect: MahjongItemData | null = null; // 首次选中的元素
    private elementTypes: string[] = ['t_1', 't_2', 't_3', 't_4', 't_6', 't_7', 't_8', 't_9'//条
        , 'b_1', 'b_2', 'b_3', 'b_4', 'b_5', 'b_6', 'b_7', 'b_8', 'b_9' //饼
        , 'w_1', 'w_2', 'w_3', 'w_4', 'w_5', 'w_6', 'w_7', 'w_8', 'w_9' //万
        , 'bamboo', 'chrysanthemum', 'plum'//竹 菊 梅
        , 'spring', 'summer', 'fall'//春夏秋
        , 'east', 'west', 'south', 'nroth'//东西南北
        , 'HZ', 'facai', 'white'//中发白

    ]; // 麻将类型
    init() {
        this.initElements();
    }

    // 初始化元素矩阵（使用行列间距分别计算位置）// 8行7 列  8行9列 保持一样的做新手引导
    async initElements() {
        // 获取元素尺寸（假设预制体有UITransform组件）
        const elementSize = this.getElementSize();
        let typeTemp: string = null;
        // 计算起始位置（让整个矩阵居中显示）
        const totalWidth = (this.colCount - 1) * this.colSpacing;
        const totalHeight = (this.rowCount - 1) * this.rowSpacing;
        const startX = -totalWidth / 2; // 水平居中起点
        const startY = totalHeight / 2; // 垂直居中起点

        let tempIndex: number = 0;
        for (let row = 0; row < this.rowCount; row++) {
            this.elements[row] = [];
            for (let col = 0; col < this.colCount; col++) {
                // 随机生成元素类型
                let type = this.elementTypes[Math.floor(Math.random() * this.elementTypes.length)];
                if (row === 7 && col === 6) {
                    typeTemp = type;
                } else if (row === 7 && col === 8) {
                    type = typeTemp;
                }
                const elementData = new MahjongItemData(type, row, col);

                // 实例化节点
                const node = App.poolManager.getNode(GlobeVariable.prefabPoolName.mahjongItem)//(this.elementPrefab);
                node.active = true;
                node.parent = this.container;
                // 计算位置：列用colSpacing，行用rowSpacing
                node.setPosition(
                    startX + col * this.colSpacing,
                    startY - row * this.rowSpacing,
                    0
                );

                node.setSiblingIndex(tempIndex++);
                node.name = tempIndex.toString();
                let sp = node.getChildByName("Node").getChildByName("Sprite_icon").getComponent(Sprite);
                sp.spriteFrame = App.mahjongAtlas.getSpriteFrame(type);
                // 存储节点引用和数据
                elementData.node = node;
                elementData.zindex = tempIndex;
                this.elements[row][col] = elementData;

                // 绑定点击区域
                // node.on(Input.EventType.TOUCH_END, this.onElementClick.bind(this, elementData), this);
                node.on(Input.EventType.TOUCH_START, this.onElementClick.bind(this, elementData), this);
            }
        }
        this.guideFristData = this.elements[7][6];;
        this.guideFun(this.guideFristData);
    }

    // 新手引导
    guideFun(data: MahjongItemData) {
        let guideStep = this.guideStep;
        let elementData = data;
        let setTimeoutStep = null;
        let setTimeoutStep1 = null;
        const node = App.poolManager.getNode(GlobeVariable.prefabPoolName.handAniPb)//(this.elementPrefab);
        this.handeNode = node
        node.setPosition(
            elementData.node.position.x,
            elementData.node.position.y,
            0
        );
        node.active = true;
        node.parent = this.container;
        let fun = () => {
            this.changeSelectBg(elementData, 1);
            setTimeoutStep = setTimeout(() => {
                this.changeSelectBg(elementData, 0);
                setTimeoutStep1 = setTimeout(() => {
                    // 引导步骤变化时终止循环并清理
                    if (this.guideStep !== guideStep) {
                        // 保留原有终止时的背景状态逻辑
                        this.changeSelectBg(
                            elementData,
                            this.guideStep >= 2 ? 0 : (this.guideNormal ? 1 : 0)
                        );

                        if (node) {
                            node.active = false;
                            node.removeFromParent();
                            node.destroy();
                        }

                        return;
                    }
                    fun();
                }, 400);
            }, 400);
        }
        fun();
    }
    guideFun1(data: MahjongItemData) {
        // 1. 筛选：找出所有与目标类型相同、未被消除的元素（排除自身）
        const sameTypeElements: MahjongItemData[] = [];
        for (let row = 0; row < this.rowCount; row++) {
            for (let col = 0; col < this.colCount; col++) {
                const currentEl = this.elements[row][col];
                // 条件：类型相同 + 未被消除 + 不是当前点击的元素
                if (currentEl.type === data.type && !currentEl.isRemoved && currentEl !== data) {
                    const uiBoxRect = find("Canvas").getComponent(UITransform).getBoundingBoxToWorld();
                   // const uiBoxRect = this.UIBox.getComponent(UITransform).getBoundingBoxToWorld();
                    let isIn = uiBoxRect.containsRect(currentEl.node.getComponent(UITransform).getBoundingBoxToWorld());
                    // const isIn =  uiBoxRect.contains(new Vec2(currentEl.node.worldPosition.x,currentEl.node.worldPosition.y))
                    if (isIn) {
                        this.guideFun(currentEl)
                        return;
                    }
                }
            }
        }
    }
    // 元素点击回调
    onElementClick(elementData: MahjongItemData, event: EventTouch) {

        if (elementData.isRemoved) return; // 已消除的元素不响应
        App.soundManager.playAudio("dlg_show_sd");
        // 首次点击
        if (!this.firstSelect) {
            this.handeNode.active = false;
            this.firstSelect = elementData;
            this.guideStep++;
            if (this.guideFristData == this.firstSelect && this.guideStep == 1) {
                this.guideFun(this.elements[7][8]);
            } else if (this.guideFristData != this.firstSelect && this.guideStep == 1) {
                this.guideNormal = false;
                this.guideFristData = elementData;
                this.guideFun1(elementData);
            }
            this.changeSelectBg(elementData, 1);
            this.highlightElement(elementData, true); // 高亮选中状态
          

        }
        // 二次点击（判断是否相同）
        else if (this.firstSelect !== elementData) {
            if (this.firstSelect.type === elementData.type) {
                this.removeElements(this.firstSelect, elementData); // 消除两个元素
                this.changeSelectBg(elementData, 1);
                this.highlightElement(elementData, true); // 高亮选中状态
                App.soundManager.playAudio("dc_trophy_dlg_sd");
                GlobeVariable.curClickNumLimt++;
            } else {
                this.changeSelectBg(elementData, 2);
                this.changeSelectBg(this.firstSelect, 2);
                this.playWarnFadeAnimation();
                this.highlightErrorElement(this.firstSelect, true); // 取消首次选中高亮
                this.highlightErrorElement(elementData, true); // 高亮错误状态
                App.soundManager.playAudio("error");
                GlobeVariable.curErrorNmuLimit++;
            }
            if (this.handeNode) {
                this.guideStep++;
                this.handeNode.active = false;
                this.handeNode.removeFromParent();
                this.handeNode.destroy();
            }
            this.firstSelect = null; // 重置选中状态
        } else if (elementData === this.firstSelect) { // 点击相同元素 错误状态
            this.changeSelectBg(this.firstSelect, 2);
            this.playWarnFadeAnimation();
            this.highlightErrorElement(this.firstSelect, true);
            this.firstSelect = null; // 重置选中状态
            if (this.handeNode) {
                this.guideStep++;
                this.handeNode.active = false;
                this.handeNode?.removeFromParent();
                this.handeNode?.destroy();
            }
            App.soundManager.playAudio("error");
            GlobeVariable.curErrorNmuLimit++;
        }
        if(GlobeVariable.curErrorNmuLimit >= GlobeVariable.errorNmuLimit ){
            super_html_playable.download();
        }
        if (GlobeVariable.curClickNumLimt >= GlobeVariable.clickNumLimt) {
            App.soundManager.playAudio("verctorry");
            super_html_playable.download();

        }
    }
    // 消除元素并执行动画
    async removeElements(el1: MahjongItemData, el2: MahjongItemData) {
        el1.isRemoved = true;
        el2.isRemoved = true;
        await this.changeSelectBg(el1, 0);
        await this.changeSelectBg(el2, 0);
        el1.node.active = false;
        el2.node.active = false;

        // 播放消除动画

        this.createBombEffect(el1.node, el1.type);
        this.createBombEffect(el2.node, el2.type);

        App.poolManager.returnNode(el1.node, GlobeVariable.prefabPoolName.mahjongItem);
        App.poolManager.returnNode(el2.node, GlobeVariable.prefabPoolName.mahjongItem);
        el1.node.removeFromParent();
        el2.node.removeFromParent();
        this.fillEmptySpaces();
    }
    createBombEffect(node: Node, type: string) {
        const effectNode = App.poolManager.getNode(GlobeVariable.prefabPoolName.mahjongEffect);//(this.elementPrefab);
        effectNode.active = true;
        effectNode.parent = this.effectParent;
        effectNode.setPosition(node.position);
        effectNode.getComponent(EffectNode).setSpriteFrameName(type);
        effectNode.getComponent(EffectNode).playEffect();
        // effectNode.getChildByName("bombEffect").getChildByName("Sprite").getComponent(Animation).play("animation");
    }

    // 填充空缺位置
    fillEmptySpaces() {
        for (let col = 0; col < this.colCount; col++) {
            this.processColumn(col);
        }
    }
    //处理单列填充（使用行间距计算下落位置）
    processColumn(col: number) {
        let emptyCount = 0;

        for (let row = this.rowCount - 1; row >= 0; row--) {
            const element = this.elements[row][col];

            if (element.isRemoved) {
                emptyCount++;
            } else if (emptyCount > 0) {
                const targetRow = row + emptyCount;

                // 更新数据位置
                this.elements[targetRow][col] = element;
                this.elements[row][col] = new MahjongItemData('', row, col);
                element.row = targetRow;

                // 计算下落目标位置（使用rowSpacing）
                if (element.node) {
                    const totalHeight = (this.rowCount - 1) * this.rowSpacing;
                    const startY = totalHeight / 2;
                    const targetY = startY - targetRow * this.rowSpacing;

                    tween(element.node)
                        .to(0.2, { position: new Vec3(element.node.position.x, targetY, 0) })
                        .call(() => {
                            tween(element.node.children[0])
                                .sequence(
                                    tween(element.node.children[0]).to(0.2, { scale: new Vec3(1, 0.95, 1) }),
                                    tween(element.node.children[0]).to(0.2, { scale: new Vec3(1, 1, 1) })
                                )
                                .repeat(2)
                                .start();
                        })
                        .start();
                }
            }
        }
        // 顶部补充新元素
        this.fillNewElements(col, emptyCount);
    }

    // 顶部补充新元素（使用行列间距）
    fillNewElements(col: number, count: number) {
        if (count <= 0) return;

        const totalWidth = (this.colCount - 1) * this.colSpacing;
        const totalHeight = (this.rowCount - 1) * this.rowSpacing;
        const startX = -totalWidth / 2 + col * this.colSpacing;
        const startY = totalHeight / 2 + count * this.rowSpacing; // 从容器上方生成

        for (let i = 0; i < count; i++) {
            const row = i;
            const type = this.elementTypes[Math.floor(Math.random() * this.elementTypes.length)];
            const elementData = new MahjongItemData(type, row, col);

            const node = App.poolManager.getNode(GlobeVariable.prefabPoolName.mahjongItem)
            node.active = true;
            node.parent = this.container;
            node.setPosition(startX, startY - i * this.rowSpacing, 0);

            elementData.node = node;
            this.elements[row][col] = elementData;

            node.on(Input.EventType.TOUCH_START, this.onElementClick.bind(this, elementData), this);


            let sp = node.getChildByName("Node").getChildByName("Sprite_icon").getComponent(Sprite);
            sp.spriteFrame = App.mahjongAtlas.getSpriteFrame(type);
            // 计算目标位置
            const targetY = totalHeight / 2 - row * this.rowSpacing;
            tween(node)
                .to(0.3, { position: new Vec3(startX, targetY, 0) })
                .start();
        }

        // 全量重排：
        for (let row = 0; row < this.rowCount; row++) {
            for (let col = 0; col < this.colCount; col++) {
                const element = this.elements[row][col];
                if (element.node && !element.isRemoved) {
                    const targetIndex = row * this.colCount + col;
                    element.node.setSiblingIndex(targetIndex);
                }
            }
        }
    }
    /*** twee 动作相关的*/
    playWarnFadeAnimation() {
        // 确保节点处于活动状态
        this.warnUI.active = true;
        // 获取或添加UIOpacity组件
        const opacity = this.warnUI?.getComponent(UIOpacity) || this.warnUI?.addComponent(UIOpacity);
        // 设置初始透明度为0（隐藏状态）
        opacity.opacity = 0;
        // 创建动画序列：只包含渐显和渐隐，移除重置透明度的回调
        tween(opacity)
            .sequence(
                tween(opacity).to(0.15, { opacity: 255 }, { easing: 'quadOut' }), // 渐显
                tween(opacity).to(0.15, { opacity: 0 }, { easing: 'quadIn' })    // 渐隐
            )
            .repeat(2)  // 
            .call(() => {
                this.warnUI.active = false;
            })
            .start();
    }
    // 选中错误元素（左右摇摆效果）
    highlightErrorElement(element: MahjongItemData, isHighlight: boolean) {
        if (!element.node) return;
        // 清除可能存在的动画，避免多次触发导致混乱
        tween(element.node).stop();
        if (isHighlight) {
            // 摇摆动画：左右摇摆三次后回到初始角度
            tween(element.node)
                .to(0.2, { angle: -5 })    // 向左摆5度
                .to(0.2, { angle: 5 })     // 向右摆5度
                .to(0.1, { angle: 0 })     // 回到初始角度
                .call(() => {
                    this.changeSelectBg(element, 0);
                })
                .start();
        } else {

        }
    }

    // 高亮选中元素（缩放效果）
    highlightElement(element: MahjongItemData, isHighlight: boolean) {
        if (!element.node) return;

        tween(element.node).stop();
        const targetScale = new Vec3(1.5, 1.5, 1.5);

        // 构建动画序列（仅在高亮时添加波动效果）
        const tweenSeq = tween(element.node);
        if (isHighlight) {
            tweenSeq
                .to(0.2, { scale: new Vec3(1.3, 1.3, 1.3) })  // 初始缩小
                .to(0.2, { scale: targetScale })              // 放大到目标
                // 小幅度波动效果（重复两次）
                .repeat(2,
                    tween().to(0.1, { scale: new Vec3(1.4, 1.4, 1.4) })
                        .to(0.1, { scale: targetScale })
                );
        } else {
            // 未高亮时直接过渡到目标缩放
            tweenSeq.to(0.2, { scale: targetScale });
        }

        tweenSeq.start();
    }
    //根据选中状态更换背景图片
    async changeSelectBg(elementData: MahjongItemData, selectSate: number) {
        if (!elementData.node) return;
        elementData.selectSate = selectSate;
        const sprite = elementData.node.getChildByName("Node").getComponent(Sprite);
        if (sprite) {
            if (elementData.selectSate == 1) {
                sprite.spriteFrame = App.mahjongAtlas.getSpriteFrame(elementData.greenSpriteFrame);
            } else if (elementData.selectSate == 2) {
                sprite.spriteFrame = App.mahjongAtlas.getSpriteFrame(elementData.redSpriteFrame);
            } else {
                sprite.spriteFrame = App.mahjongAtlas.getSpriteFrame(elementData.whiteSpriteFrame);
            }
        }
    }
    // 获取元素尺寸（辅助计算居中位置）
    private getElementSize() {
        if (!this.elementPrefab) return new Vec3(0, 0, 0);
        const tempNode = instantiate(this.elementPrefab);
        const uiTransform = tempNode.getComponent(UITransform);
        const size = uiTransform ? uiTransform.contentSize : new Vec3(0, 0, 0);
        return size;
    }

}


