
import { _decorator, BoxCollider, Camera, Component, director, instantiate, ITriggerEvent, macro, Node, Pool, Prefab, RigidBody, RigidBody2D, UITransform, Vec3, Animation, MeshRenderer, tween, Color, v4, Material, Texture2D, ParticleSystem, UIOpacity, Sprite, CapsuleCollider, WebView, view, ResolutionPolicy, Widget, Scene, Vec4 } from 'cc';

import { EntityTypeEnum, PrefabPathEnum } from '../Enum';
import { DataManager } from '../Globel/DataManager';
import { ResourceManager } from '../Globel/ResourceManager';
import { Events } from '../Events/Events';
import { TweenMaterial } from '../Mtl/TweenMaterial';
import { Bullet } from '../Type/Type';
//import Platform from '../Common/Platform';
import { ArrowItem } from '../Entity/ArrowItem';
import super_html_playable from '../Common/super_html_playable';

export const BulletDeadTime: number = 10;

const { ccclass, property } = _decorator;

@ccclass('SceneManager')
export class SceneManager extends Component {

    @property(Node)
    threeDNode: Node = null;

    @property(Node)
    cameraRoot: Node = null;

    @property(Node)
    transitionNode: Node = null;

    @property(Node)
    canvasNode: Node = null;

    @property(Camera)
    camera: Camera = null;

    @property(Node)
    shipParent: Node = null;

    @property(Node)
    boomParent: Node = null;

    @property(Texture2D)
    texture: Texture2D = null;

    @property(Node)
    arrowParent: Node = null;

    @property(Material)
    scene2ShipMtl: Material = null;

    bulletCount: number;
    bulletSpeed: number = 10;

    private _bullets: Bullet[] = [];

    private _realView = null;

    onLoad() {
        //跳转链接
        const google_play = "https://play.google.com/store/apps/details?id=com.funplus.st.region";
        const appstore = "https://apps.apple.com/us/app/stormshot2-boom-blast/id6532591623?ct=Tap33752560";

        super_html_playable.set_google_play_url(google_play);
        super_html_playable.set_app_store_url(appstore);
    }

    // 子弹  
    async start() {
        DataManager.Instacne.isDisplayGuidance = true;

        const opacityCom = this.transitionNode.getComponent(UIOpacity);
        opacityCom.opacity = 255;
        //平台初始化
        //Platform.instance.init();

        this.bulletCount = 6;
        await this.loadRes();
        this.initGame();
        DataManager.Instacne.sceneMananger = this;
    }

    async loadRes() {
        const list: Promise<void>[] = [];

        for (const type in PrefabPathEnum) {
            const loadPrefabPromise = ResourceManager.Instance.loadRes(PrefabPathEnum[type], Prefab).then((prefab) => {
                DataManager.Instacne.prefabMap.set(type, prefab);
            });
            list.push(loadPrefabPromise);
        }

        await Promise.all(list);
    }

    async initGame() {
        const opacityCom = this.transitionNode.getComponent(UIOpacity);
        opacityCom.opacity = 255;
        tween(opacityCom)
            .to(1.5, { opacity: 0 })
            .call(() => {

            })
            .start();

        this.createBullet();  // 资源加载完成后创建子弹
        this.createShips(); //创建船
    }

    // 初始化船
    public createShips() {
        this.shipParent.destroyAllChildren();
        this.arrowParent.destroyAllChildren();
        const shipCount = 3;
        let shipPrefab: Prefab;
        if (director.getScene().name == "GamePlay") {
            shipPrefab = DataManager.Instacne.prefabMap.get(EntityTypeEnum.Ship);
        } else {
            shipPrefab = DataManager.Instacne.prefabMap.get(EntityTypeEnum.Ship2);
        }
        const arrowPrefab: Prefab = DataManager.Instacne.prefabMap.get(EntityTypeEnum.Arrow);
        for (let i = 0; i < shipCount; i++) {
            let newShip: Node = instantiate(shipPrefab);
            newShip.active = true;
            // if (director.getScene().name == "GamePlay2") {
            //     const polySurface51 = newShip.getChildByName('polySurface51');
            //     const meshRender = polySurface51.getComponent(MeshRenderer);
            //     meshRender.material = this.scene2ShipMtl;
            // }

            let ani: Animation = newShip.getComponent(Animation);
            if (ani) {
                this.scheduleOnce(() => {
                    ani.play(ani.clips[i].name);
                }, 0);
            }
            this.shipParent.addChild(newShip);

            //船对应的小箭头
            let arrowNode: Node = instantiate(arrowPrefab);
            let arrow: ArrowItem = arrowNode.getComponent(ArrowItem);
            if (arrow) {
                arrow.init(newShip);
                this.arrowParent.addChild(arrowNode);
            }

        }
    }

    // 初始化子弹 
    createBullet() {
        const poolCount = 5;

        DataManager.Instacne.prefabPool = new Pool(() => {
            const bulletPrefab = DataManager.Instacne.prefabMap.get(EntityTypeEnum.Button);
            return instantiate(bulletPrefab);
        }, poolCount, (node: Node) => {
            node.removeFromParent();
        });
    }

    private _originalPos: Vec3 = new Vec3();
    private _isShaking: boolean = false;

    // 右上 → 左下 → 回原位
    shakeRightUpToLeftDownThenReset(duration: number = 0.3, strength: number = 0.05) {
        if (this._isShaking) return;

        this._isShaking = true;
        this._originalPos.set(this.threeDNode.position);

        const rightUpPos = this._originalPos.clone();
        rightUpPos.x += strength; // 向右
        rightUpPos.y += strength; // 向上

        const leftDownPos = this._originalPos.clone();
        leftDownPos.x -= strength; // 向左
        leftDownPos.y -= strength; // 向下

        tween(this.threeDNode)
            .to(duration / 3, { position: rightUpPos }, { easing: 'sineInOut' }) // 先到右上角
            .to(duration / 3, { position: leftDownPos }, { easing: 'sineInOut' }) // 再到左下角
            .to(duration / 3, { position: this._originalPos }, { easing: 'sineInOut' }) // 再回原位
            .call(() => {
                this._isShaking = false;
            })
            .start();
    }


    private _aoriginalPos: Vec3 = new Vec3();
    private _isShakingReverse: boolean = false;

    // 左下 → 右上 → 回原位（反向晃动）
    shakeLeftDownToRightUpThenReset(node, duration: number = 0.3, strength: number = 0.05) {
        if (this._isShakingReverse) return;

        this._isShakingReverse = true;
        this._aoriginalPos.set(node.position);

        const leftDownPos = this._aoriginalPos.clone();
        leftDownPos.x -= strength; // 向左
        leftDownPos.y -= strength; // 向下

        const rightUpPos = this._aoriginalPos.clone();
        rightUpPos.x += strength; // 向右
        rightUpPos.y += strength; // 向上

        tween(node)
            .to(duration / 3, { position: leftDownPos }, { easing: 'sineInOut' }) // 先到左下角
            .to(duration / 3, { position: rightUpPos }, { easing: 'sineInOut' }) // 再到右上角
            .to(duration / 3, { position: this._aoriginalPos }, { easing: 'sineInOut' }) // 最后回原位
            .call(() => {
                this._isShakingReverse = false;
            })
            .start();
    }

    // 发射子弹
    fireBullet() {
        this.shakeRightUpToLeftDownThenReset(0.3, 0.7);
        const cameraWorldPos = this.camera.node.worldPosition.clone();
        const cameraEulerAngles = this.camera.node.eulerAngles.clone();

        DataManager.Instacne.UIManager.hideTitleNode();
        const node = DataManager.Instacne.prefabPool.alloc();
        if (node.parent == null) {
            director.getScene().addChild(node);
        }
        node.active = true;

        const offset = new Vec3(0, -1, 0); // 偏移量，控制发射位置相对于摄像机的下方
        const bulletPosition = cameraWorldPos.add(offset); // 计算发射位置
        node.setPosition(bulletPosition); // 设置子弹的初始位置
        //方向
        let direction: Vec3 = cameraEulerAngles.clone();
        let newDes: Vec3 = new Vec3(0, -90 + direction.y, -direction.x * 1.2);
        node.eulerAngles = newDes;

        // 获取摄像机的前方方向
        const forwardDirection = this.camera.node.forward;

        const velocity = new Vec3();
        Vec3.multiplyScalar(velocity, forwardDirection, this.bulletSpeed);
        velocity.y += 0.2;
        const collider = node.getComponent(CapsuleCollider);
        if (collider) {
            collider.on('onTriggerEnter', this.onTriggerStay, this);
            collider.isTrigger = true;
        }

        const rigidBody = node.getComponent(RigidBody);
        if (rigidBody) {
            rigidBody.useGravity = false;
            rigidBody.linearDamping = 0;        // 线性阻尼
            rigidBody.angularDamping = 0;       // 旋转阻力
        }

        let lizi: Prefab = DataManager.Instacne.prefabMap.get(EntityTypeEnum.Tailing);
        if (lizi) {
            node.addChild(instantiate(lizi));
        }


        // this.shakeLeftDownToRightUpThenReset(node, 0.3, 1)

        this._bullets.push({ node: node, velocity: velocity, time: 0 });
    }

    //  子弹和其他物体发生碰撞
    onTriggerStay(event: ITriggerEvent) {
        const selfCollider = event.selfCollider;
        const selfNode = selfCollider.node;  // 子弹节点
        const otherCollider = event.otherCollider;
        const otherNode = otherCollider.node; // 被击中的节点

        // 停止被击中对象的动画
        otherNode.getComponent(Animation).stop();

        this.shakeRightUpToLeftDownThenReset(0.15, 0.3);

        //爆炸位置
        let pos: Vec3 = new Vec3();
        this.camera.convertToUINode(selfNode.getWorldPosition().clone(), this.boomParent, pos);

        this.onBulletDead(selfNode);
        this.boomEffect(pos.x, pos.y);

        // 爆炸声音
        if (DataManager.Instacne.isTurnSound) {
            DataManager.Instacne.soundManager.boneSoundPlay();
        } else {
            DataManager.Instacne.soundManager.boneSoundPause();
        }

        this.shipFalling(otherNode);
    }

    // 船坠落动哈
    shipFalling(shipNode) {
        // const rigidBody = shipNode.getComponent(RigidBody);
        // rigidBody.useGravity = true;
        // rigidBody.linearDamping = 0.9;

        tween(shipNode)
            .to(3, { position: new Vec3(shipNode.position.x, shipNode.position.y - 7, shipNode.position.z) })
            .start();

        tween(shipNode)
            .delay(1.5)
            .call(() => {
                const polySurface51 = shipNode.getChildByName("polySurface51");
                const mat = polySurface51.getComponent(MeshRenderer);

                const material = new Material();
                material.initialize({
                    effectName: 'builtin-standard',
                    technique: 1,
                    defines: {
                        USE_ALBEDO_MAP: true,
                    },
                });

                const color = new Color(0, 214, 255, 255);
                const startColorVec4 = this.colorToVec4(color);
                material.setProperty('mainTexture', this.texture);
                material.setProperty('mainColor', startColorVec4);
                mat.setMaterial(material, 0);

                const tweenMatObj = new TweenMaterial(polySurface51, startColorVec4.clone());
                tween(tweenMatObj)
                    .to(1.5, {
                        mainColor: new Vec4(startColorVec4.x, startColorVec4.y, startColorVec4.z, 0),
                    }, {
                        onUpdate: () => {
                            material.setProperty('mainColor', tweenMatObj.mainColor);
                        }
                    })
                    .delay(0.2)
                    .call(() => {
                        shipNode.active = false;
                        this.checkAnswer?.();
                    })
                    .start();
            })
            .start();

        //小箭头消失逻辑
        for (let item of this.arrowParent.children) {
            let arrow: ArrowItem = item.getComponent(ArrowItem);
            if (arrow) {
                if (arrow.checkShip(shipNode)) {
                    item.destroy();
                    break;
                }
            } else {
                item.destroy();
            }
        }
    }

    colorToVec4(color: Color): Vec4 {
        return new Vec4(
            color.r / 255,
            color.g / 255,
            color.b / 255,
            color.a / 255
        );
    }

    // 判断是否满足条件
    checkAnswer() {
        if (DataManager.Instacne.sourceManager.node.active || DataManager.Instacne.failManager.node.active) return;

        if (DataManager.Instacne.currentBulletCount > 0) {
            const ship = this.shipParent.children.find(item => { return item.active });

            if (!ship) {
                DataManager.Instacne.UIManager.node.active = false;
                DataManager.Instacne.sourceManager.displaySourcePage();

                DataManager.Instacne.curLevel++;
                tween(this.node)
                    .delay(2)
                    .call(() => {
                        director.loadScene("GamePlay2");
                    })
                    .start();
            }
        } else {
            DataManager.Instacne.UIManager.node.active = false;
            DataManager.Instacne.failManager.displayFailPage();
        }
    }

    onBulletDead(node) {
        if (!node) return;
        for (let i = 0; i < this._bullets.length; i++) {
            if (this._bullets[i].node === node) {
                this._bullets.splice(i, 1);
                break;
            }
        }
        node.active = false;
        //销毁拖尾
        let tailing: Node = node.getChildByName(EntityTypeEnum.Tailing);
        if (tailing) {
            tailing.destroy();
        }
        node.removeFromParent();
        DataManager.Instacne.prefabPool.free(node);
        this.checkAnswer();
    }

    private boomEffect(x: number, y: number) {
        const boomPrefab = DataManager.Instacne.prefabMap.get(EntityTypeEnum.BoomEffect);
        this.boomParent.destroyAllChildren();
        const boomNode = instantiate(boomPrefab);
        this.boomParent.addChild(boomNode);
        let ani: Animation = boomNode.getComponent(Animation);
        boomNode.setPosition(x, y); // 设置爆炸位置
        if (ani) {
            ani.play();
            ani.on(Animation.EventType.FINISHED, () => {
                ani.off(Animation.EventType.FINISHED);
                boomNode.destroy(); // 动画结束后销毁节点
            })
        }
    }

    private _resetFixed: boolean = false;

    update(dt: number) {
        if (this._bullets.length > 0) {
            let i = 0;
            while (i < this._bullets.length) {
                const bullet = this._bullets[i];
                bullet.time += dt;
                if (bullet.node && bullet.node.active && this._bullets[i].time < BulletDeadTime) {
                    let position = bullet.node.position;
                    let deltaMovement = new Vec3();

                    Vec3.multiplyScalar(deltaMovement, bullet.velocity, dt * 2);  // 速度乘以时间间隔和移动速度

                    Vec3.add(position, position, deltaMovement);

                    bullet.node.setPosition(position); // 设置新的位置
                    i++;
                } else {
                    this.onBulletDead(bullet.node);
                }
            }
        }

        const visibleSize = view.getVisibleSize(); // 屏幕可见区域
        // 场景适配
        if (visibleSize.width / visibleSize.height > 1) {
            this._resetFixed = false;
            let w = view.getScaleX();
            view.setDesignResolutionSize(720, 1456, ResolutionPolicy.FIXED_HEIGHT);
            //console.log("wwwwwwwwwwwwwwwwwwwwwwwwwwwwww",w,view.getScaleX())
        } else {
            if (visibleSize.height / visibleSize.width >= 1.63) {
                if (!this._resetFixed) {
                    this._resetFixed = true;
                    let x = view.getScaleX();
                    // 打包跑 xxxxlog数据去算，用width*scalex（当前缩放值view.getScaleX()）/x（原缩放值）
                    view.setDesignResolutionSize(1096, 1792, ResolutionPolicy.FIXED_WIDTH);
                    console.log("xxxxxxxxxxxxxxxx", x, view.getScaleX())
                }
            } else {
                this._resetFixed = false;
                view.setDesignResolutionSize(828, 1792, ResolutionPolicy.FIXED_HEIGHT);
            }

        }
        //音量适配单独修改
        if (visibleSize.height / visibleSize.width > 1.45) {
            DataManager.Instacne.UIManager.setSpeakerScale(1.2);
        } else if (visibleSize.height / visibleSize.width > 1) {
            DataManager.Instacne.UIManager.setSpeakerScale(0.84);
        } else if (visibleSize.height / visibleSize.width > 0.69) {
            DataManager.Instacne.UIManager.setSpeakerScale(1);
        } else {
            DataManager.Instacne.UIManager.setSpeakerScale(1.51);
        }

        if (!this._realView) {
            this._realView = view.getVisibleSizeInPixel();
        }

        let realScale: number = view.getScaleX();
        let newScale = realScale / (1792 / 828 * this._realView.height / 1792);
        let scale: number = Number((0.46 / newScale).toFixed(1));
        if (screen) {
            let screenScale = realScale / (1792 / 828 * screen.height / 1792)
            scale = Number((0.46 / screenScale).toFixed(1));
            //console.log("screenscale", realScale, newScale, screenScale, scale);
        }
        DataManager.Instacne.UIManager.titleScaleNode.setScale(scale, scale, scale);


    }
}

