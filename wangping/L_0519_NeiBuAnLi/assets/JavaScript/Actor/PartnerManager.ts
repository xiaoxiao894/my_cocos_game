import { _decorator, Color, Component, Graphics, instantiate, Node, Quat, Vec3 } from 'cc';
import { DataManager } from '../Global/DataManager';
import { EntityTypeEnum } from '../Enum/Index';
import { EachPartnerManager } from './EachPartnerManager';
const { ccclass, property } = _decorator;

@ccclass('PartnerManager')
export class PartnerManager extends Component {
    start() {
        DataManager.Instance.partnerManager = this;
    }

    // 在场景中添加一个伙伴
    addPartner(name: EntityTypeEnum) {
        const prefab = DataManager.Instance.prefabMap.get(name);
        const partner = instantiate(prefab);
        const eachPartnerManager = partner.getComponent(EachPartnerManager) || partner.addComponent(EachPartnerManager);
        eachPartnerManager.init();
        partner.setParent(this.node);
    }

    getHalfCirclePositions(center: Vec3, forward: Vec3, radius: number, count: number): Vec3[] {
        const result: Vec3[] = [];

        if (count <= 0) return result;

        const baseDir = new Vec3();
        Vec3.negate(baseDir, forward);
        baseDir.normalize();
        baseDir.multiplyScalar(radius);

        if (count === 1) {
            const pos = center.clone().add(baseDir);
            result.push(pos);
            return result;
        }

        const angleStep = Math.PI / (count - 1);

        for (let i = 0; i < count; i++) {
            const angle = -Math.PI / 2 + i * angleStep;
            const rot = new Quat();
            Quat.fromAxisAngle(rot, Vec3.UP, angle);

            const offset = Vec3.transformQuat(new Vec3(), baseDir, rot);

            const lateralOffset = (i % 2 === 0 ? 1 : -1) * 0.3 * Math.floor(i / 2);
            offset.x += lateralOffset;

            const pos = center.clone().add(offset);
            result.push(pos);
        }

        return result;
    }
}


