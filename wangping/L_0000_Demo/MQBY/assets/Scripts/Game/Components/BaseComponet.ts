import { _decorator, Color, Component, Node, Vec3 } from 'cc';
import { ComponentEvent } from '../../common/ComponentEvents';
import { ColorEffectType, FrameEventId } from '../../common/CommonEnum';
import { Character } from '../Role/Character';

const { ccclass, property } = _decorator;

/**
 * 基础动画组件 - 所有动画组件的父类，包含通用逻辑
 */
@ccclass('BaseComponet')
export abstract class BaseComponet extends Component {
    protected _character: Character | null = null;

    protected onLoad(): void {
        this.character = this.node.getComponent(Character);
    }

    public get character(): Character {
        return this._character;
    }

    public set character(value: Character) {
        this._character = value;
    }
} 