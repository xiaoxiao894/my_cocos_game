import { _decorator, Component, Node } from 'cc';
import { CloudParticleEffect } from './CloudParticleEffect';
import { eventMgr } from './EventManager';
import { EventType } from './EventType';
const { ccclass, property } = _decorator;

@ccclass('LandCloudFade')
export class LandCloudFade extends Component {
    @property(CloudParticleEffect)
    cloudOne: CloudParticleEffect = null;

    @property(CloudParticleEffect)
    cloudOne1: CloudParticleEffect = null;

    @property(CloudParticleEffect)
    cloudTwo: CloudParticleEffect = null;

    @property(CloudParticleEffect)
    cloudTwo1: CloudParticleEffect = null;

    @property(CloudParticleEffect)
    cloudThree: CloudParticleEffect = null;

    @property(CloudParticleEffect)
    cloudThree1: CloudParticleEffect = null;

    @property(CloudParticleEffect)
    cloudFour: CloudParticleEffect = null;

    @property(CloudParticleEffect)
    cloudFour1: CloudParticleEffect = null;

    start() {
        eventMgr.on(EventType.MapLand_allCloudFade, this.allCloudFade, this);
    }

    allCloudFade() {
        this.cloudOne.cloudFadeEffct(false);
        this.cloudOne1.cloudFadeEffct(false);
        this.cloudTwo.cloudFadeEffct(false);
        this.cloudTwo1.cloudFadeEffct(false);
        this.cloudThree.cloudFadeEffct(false);
        this.cloudThree1.cloudFadeEffct(false);
        this.cloudFour.cloudFadeEffct(false);
        this.cloudFour1.cloudFadeEffct(false);
    }

    update(deltaTime: number) {

    }
}


