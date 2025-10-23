import { _decorator, Color, Component, math, MeshRenderer, Node, Vec3, Vec4 } from 'cc';
import EventManager from '../../EventManager/EventManager';
import EventType from '../../EventManager/EventType';
const { ccclass, property } = _decorator;

@ccclass('WallController')
export class WallController extends Component {

    @property(MeshRenderer)
    meshRenderer: MeshRenderer = null

    start() {
        // this.meshRenderer.enabled = false;
        EventManager.addEventListener(EventType.UPDATE_MAIN_PLAYER_POS, this.onUpdateMainPlayerPos, this)
    }

    onDestroy(): void {
        EventManager.remveEventListener(EventType.UPDATE_MAIN_PLAYER_POS, this.onUpdateMainPlayerPos, this)
    }

    onUpdateMainPlayerPos(pos: Vec3) {
        // if(pos.z >= 800.0 && this.meshRenderer.enabled == false) {
        // this.meshRenderer.enabled = true;
        // }
        const z = pos.z;
        const wallDistance = this.node.worldPositionZ; 
        const beginValue = wallDistance * 0.75;
        const endValue = wallDistance * 0.9;
        if(z >= beginValue) {
            const maxValue = endValue - beginValue;
            const curValue = z - beginValue;
            const t = curValue / maxValue;
            const a = math.lerp(0, 255, t);
            const material = this.meshRenderer.materials[0];
            const mainColorOffsetProperty = material.getProperty('mainColor');
            const v = mainColorOffsetProperty.valueOf() as Color
            v.a = a;
            material.setProperty('mainColor', v);
            // this.meshRenderer.materials[0] = material;
        }
    }

    update(deltaTime: number) {
        this.scroll(deltaTime)
    }

    scroll(deltaTime: number) {
        const speed = deltaTime
        const material = this.meshRenderer.materials[0];
        const tilingOffsetProperty = material.getProperty('tilingOffset');
        const v = tilingOffsetProperty.valueOf() as Vec4
        v.z += speed;
        v.w += speed;
        material.setProperty('tilingOffset', v);
        // this.meshRenderer.materials[0] = material;
    }

}

