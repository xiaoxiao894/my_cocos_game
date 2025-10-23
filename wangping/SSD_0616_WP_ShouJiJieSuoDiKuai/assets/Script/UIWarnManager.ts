import { _decorator, Component, Node, Tween, tween, UIOpacity } from 'cc';
import { Global } from './core/Global';
const { ccclass, property } = _decorator;

@ccclass('UIWarnManager')
export class UIWarnManager extends Component {
    private _isTrue = true;

    private tweenWarn: Tween<UIOpacity> | null = null;
    private callFunc: Function = null;
    start() {
        Global.warnUI = this;
        this.node.active = false;
    }

    playWarnFadeAnimation() {
        // 确保节点处于活动状态
        this.node.active = true;

        // 获取或添加UIOpacity组件
        const opacity = this.node?.getComponent(UIOpacity) || this.node?.addComponent(UIOpacity);

        // 停止之前的动画（如果有）
        this.stopWarnFadeAnimation();

        // 设置初始透明度为0（隐藏状态）
        opacity.opacity = 0;

        // 创建动画序列：只包含渐显和渐隐，移除重置透明度的回调
        // 创建动画序列并设置为无限循环
        this.callFunc = () => {
            tween(opacity)
                .to(0.5, { opacity: 255 }, { easing: 'quadOut' })  // 渐显
                .to(0.5, { opacity: 0 }, { easing: 'quadIn' })    // 渐隐
                .call(() => {
                    if (this.callFunc)
                        this.callFunc();
                })
                .start();
        }

        this.callFunc();

    }
    stopWarnFadeAnimation() {
        if (this.callFunc) {
            this.callFunc = null;
        }
    }
}


