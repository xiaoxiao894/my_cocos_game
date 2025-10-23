System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7", "__unresolved_8", "__unresolved_9"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, CCInteger, Component, geometry, Input, Node, PhysicsSystem, Quat, tween, Vec2, Vec3, DataManager, TransformPositionUtil, PlugItem, MathUtil, EventManager, EventName, eventMgr, PlotName, RopeUtils, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, RepoTouchComponent;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfDataManager(extras) {
    _reporterNs.report("DataManager", "../Global/DataManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfTransformPositionUtil(extras) {
    _reporterNs.report("TransformPositionUtil", "../Utils/TransformPositionUtil", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPlugItem(extras) {
    _reporterNs.report("PlugItem", "../Repo/PlugItem", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMathUtil(extras) {
    _reporterNs.report("MathUtil", "../Utils/MathUtils", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventManager(extras) {
    _reporterNs.report("EventManager", "../Global/EventManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventName(extras) {
    _reporterNs.report("EventName", "../Common/Enum", _context.meta, extras);
  }

  function _reportPossibleCrUseOfeventMgr(extras) {
    _reporterNs.report("eventMgr", "../core/EventManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPlotName(extras) {
    _reporterNs.report("PlotName", "../core/EventType", _context.meta, extras);
  }

  function _reportPossibleCrUseOfRopeUtils(extras) {
    _reporterNs.report("RopeUtils", "../Repo/RopeUtils", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      CCInteger = _cc.CCInteger;
      Component = _cc.Component;
      geometry = _cc.geometry;
      Input = _cc.Input;
      Node = _cc.Node;
      PhysicsSystem = _cc.PhysicsSystem;
      Quat = _cc.Quat;
      tween = _cc.tween;
      Vec2 = _cc.Vec2;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      DataManager = _unresolved_2.DataManager;
    }, function (_unresolved_3) {
      TransformPositionUtil = _unresolved_3.default;
    }, function (_unresolved_4) {
      PlugItem = _unresolved_4.PlugItem;
    }, function (_unresolved_5) {
      MathUtil = _unresolved_5.MathUtil;
    }, function (_unresolved_6) {
      EventManager = _unresolved_6.EventManager;
    }, function (_unresolved_7) {
      EventName = _unresolved_7.EventName;
    }, function (_unresolved_8) {
      eventMgr = _unresolved_8.eventMgr;
    }, function (_unresolved_9) {
      PlotName = _unresolved_9.PlotName;
    }, function (_unresolved_10) {
      RopeUtils = _unresolved_10.default;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "c8e562ql3lMIIS9yK4j4+YD", "RepoTouchComponent", undefined);

      __checkObsolete__(['_decorator', 'Camera', 'CCInteger', 'Collider', 'Component', 'EventTouch', 'geometry', 'Input', 'Node', 'PhysicsSystem', 'Quat', 'tween', 'Vec2', 'Vec3', 'Vec4']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("RepoTouchComponent", RepoTouchComponent = (_dec = ccclass('RepoTouchComponent'), _dec2 = property(Node), _dec3 = property(CCInteger), _dec(_class = (_class2 = class RepoTouchComponent extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "touchNode", _descriptor, this);

          //相机滑动灵敏度
          _initializerDefineProperty(this, "sensitivity", _descriptor2, this);

          //插头初始位置
          this._plugStartPos = null;
          //插头初始方向
          this._plugStartRot = null;
          //当前插座 index
          this._nowSocketIndex = 0;
          //插头旋转速度
          this._plugRotateSpeed = 3;
          //插头最终旋转方向
          this._plugTartetRot = null;
          this._lastTouchPos = null;
          //是否正在移动插头
          this._movingPlug = false;
          //是否正在移动摄像机
          this._movingCamera = false;
          //插头是否正在回弹
          this._plugBacking = false;
          //插头正在插入
          this._pluglinking = false;
          //检测点击升级
          this._checkTowerBtn = false;
          this._lastPlotIndex = -1;
          this.cameraMoveSpeed = 1;
        }

        start() {
          this._movingPlug = false;
        }

        onEnable() {
          this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
          ;
          this.node.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
          this.node.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
          this.node.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).inst.on((_crd && EventName === void 0 ? (_reportPossibleCrUseOfEventName({
            error: Error()
          }), EventName) : EventName).PlugStateUpdate, this.onPlugStateUpdate, this);
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).inst.on((_crd && EventName === void 0 ? (_reportPossibleCrUseOfEventName({
            error: Error()
          }), EventName) : EventName).TowerUpgradeButtonShow, this.onTowerUpgradeBtnShow, this);
        }

        onDisable() {
          this.node.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
          ;
          this.node.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
          this.node.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
          this.node.off(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).inst.off((_crd && EventName === void 0 ? (_reportPossibleCrUseOfEventName({
            error: Error()
          }), EventName) : EventName).PlugStateUpdate, this.onPlugStateUpdate, this);
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).inst.off((_crd && EventName === void 0 ? (_reportPossibleCrUseOfEventName({
            error: Error()
          }), EventName) : EventName).TowerUpgradeButtonShow, this.onTowerUpgradeBtnShow, this);
        }

        onTouchStart(event) {
          console.log("touch start");
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).inst.emit((_crd && EventName === void 0 ? (_reportPossibleCrUseOfEventName({
            error: Error()
          }), EventName) : EventName).TouchSceenStart);
          this._lastTouchPos = null;

          if ((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.isGameOver) {
            return;
          } //  if(this._checkTowerBtn){


          if (this.checkTowerBtnClick(event)) {
            (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
              error: Error()
            }), EventManager) : EventManager).inst.emit((_crd && EventName === void 0 ? (_reportPossibleCrUseOfEventName({
              error: Error()
            }), EventName) : EventName).TowerUpgradeBtnClick);
            return;
          } // }


          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.mainCamera.stopTweenAni();

          if (this._plugBacking || this._pluglinking) {
            this._movingCamera = true;
            return;
          }

          let cameraMain = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.mainCamera.camera;
          let ray = new geometry.Ray();
          const touchPos = event.getLocation();
          console.log("touchPos:", touchPos);
          cameraMain.screenPointToRay(touchPos.x, touchPos.y, ray); // 以下参数可选

          const mask = 1 << 1;
          const maxDistance = 10000000;
          const queryTrigger = true;

          if (PhysicsSystem.instance.raycastClosest(ray, mask, maxDistance, queryTrigger)) {
            const raycastClosestResult = PhysicsSystem.instance.raycastClosestResult;
            const plug = raycastClosestResult.collider;

            if (plug) {
              let plugItem = plug.node.getComponent(_crd && PlugItem === void 0 ? (_reportPossibleCrUseOfPlugItem({
                error: Error()
              }), PlugItem) : PlugItem);

              if (plugItem && plugItem.state == 0) {
                this._movingPlug = true;
                (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.nowPlug = plug.node;
                this._plugStartPos = plug.node.worldPosition.clone();
                this._plugStartRot = plug.node.getRotation().clone();
                (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.soundManager.playPlugSound(); //更新状态

                plugItem.state = 1;
                console.log("move start");
                return;
              }
            }

            console.log("raycastClosest success");
          } else {
            console.log("no raycastClosest");
          }

          console.log("move camera");
          this._movingCamera = true;
        }

        onTouchMove(event) {
          if (this._lastTouchPos) {
            if (this._movingPlug) {
              this.movePlug(event);
            } else if (this._movingCamera) {
              this.moveCamera(event);
            }
          }

          this._lastTouchPos = event.getLocation();
        } //滑动摄像机


        moveCamera(event) {
          const touchPos = event.getLocation();

          if (!this._lastTouchPos) {
            return;
          }

          let deltaPos = touchPos.clone();
          deltaPos.subtract(this._lastTouchPos);
          deltaPos.x = -deltaPos.x;
          const cameraMain = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.mainCamera.camera; // 1. 将屏幕滑动向量转换为世界空间移动方向

          const moveDir = this.screenToWorldDirection(deltaPos, cameraMain.node); // 2. 保持Y轴不变

          moveDir.y = 0;
          moveDir.normalize(); // 3. 计算移动距离(应用灵敏度)

          const moveDistance = deltaPos.length() * this.sensitivity; // 4. 更新摄像机位置

          let cameraPos = cameraMain.node.getWorldPosition().clone();
          Vec3.scaleAndAdd(cameraPos, cameraPos, moveDir, moveDistance);
          let cameraLimit = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.cameraLimit;
          cameraPos.x = Math.min(Math.max(cameraPos.x, cameraLimit.y), cameraLimit.x);
          cameraPos.z = Math.min(Math.max(cameraPos.z, cameraLimit.w), cameraLimit.z);
          cameraMain.node.setWorldPosition(cameraPos);
          console.log(`像机的位置 ${cameraMain.node.getPosition()}`); //console.log(`camera newPos ${String(cameraPos)}  moveDir ${String(moveDir)}  moveDistance ${moveDistance}`);
        }

        // 相机移动速度
        cameraFoollowPlug(event) {
          const touchPos = event.getLocation();

          if (!this._lastTouchPos) {
            this._lastTouchPos = touchPos.clone(); // return; // 初始化后不移动摄像机，等待下一次触摸移动
          }

          let deltaPos = touchPos.clone();
          deltaPos.subtract(this._lastTouchPos);
          deltaPos.y = -deltaPos.y;
          const cameraMain = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.mainCamera.camera;
          const moveDir = this.screenToWorldDirection(deltaPos, cameraMain.node);
          moveDir.y = 0;
          moveDir.normalize();
          console.log(`this._lastTouchPos ${this._lastTouchPos}`); // const minMoveDistance = 1.5; 
          // const moveDistance = Math.max(deltaPos.length() * this.sensitivity * 4, minMoveDistance);

          const minMoveDistance = 0.5;
          const maxMoveDistance = 1; // 限制最大移动距离，防止飞出

          let moveDistance = deltaPos.length() * this.sensitivity * 1;
          moveDistance = Math.min(Math.max(moveDistance, minMoveDistance), maxMoveDistance);
          console.log(`moveDistance ${moveDistance}`);
          let cameraPos = cameraMain.node.getWorldPosition().clone();
          Vec3.scaleAndAdd(cameraPos, cameraPos, moveDir, moveDistance);
          let cameraLimit = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.cameraLimit;
          cameraPos.x = Math.min(Math.max(cameraPos.x, cameraLimit.y), cameraLimit.x);
          cameraPos.z = Math.min(Math.max(cameraPos.z, cameraLimit.w), cameraLimit.z);
          cameraMain.node.setWorldPosition(cameraPos);
          console.log(`像机的位置111111 ${cameraMain.node.getPosition()}`); // 更新_lastTouchPos，保证下一次计算deltaPos正确

          this._lastTouchPos = touchPos.clone();
        } //移动插头


        movePlug(event) {
          this.checkTargetSocket(); //如果足够近直接播动画插上去

          let endWorldPos = (_crd && MathUtil === void 0 ? (_reportPossibleCrUseOfMathUtil({
            error: Error()
          }), MathUtil) : MathUtil).worldToLocal((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.nowSocket.worldPosition, (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.sceneManger.node); //DataManager.Instance.nowSocket.worldPosition;

          let nowPlugPos = (_crd && MathUtil === void 0 ? (_reportPossibleCrUseOfMathUtil({
            error: Error()
          }), MathUtil) : MathUtil).worldToLocal((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.nowPlug.worldPosition, (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.sceneManger.node);
          let distance = Vec3.distance(nowPlugPos, endWorldPos); //    let endWorldPos: Vec3 = DataManager.Instance.nowSocket.worldPosition;
          //     let distance: number = Vec3.distance(DataManager.Instance.nowPlug.worldPosition, endWorldPos);
          // 4 是最后一个地块，不允许手动解锁

          if (this._nowSocketIndex == 3) {
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.plugConnectDistance = 3.5;
          } else {
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.plugConnectDistance = 6;
          }

          if (distance < (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.plugConnectDistance && (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.leftSocket.indexOf(this._nowSocketIndex) != -1 && this._nowSocketIndex !== 4) {
            console.log("this._nowSocketIndex == ", this._nowSocketIndex);
            let cameraLimit = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.cameraLimit;

            if (this._nowSocketIndex == 2) {
              //野兽
              let cameraPos = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.mainCamera.node.getWorldPosition();

              if (cameraPos.x < cameraLimit.x) {
                // 使用 tween 实现平滑移动到 x=14，持续时间0.5秒
                tween((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.mainCamera.node).to(0.8, {
                  worldPosition: new Vec3(cameraLimit.x - 1, cameraPos.y, cameraPos.z)
                }).start();
              }
            } else if (this._nowSocketIndex == 3) {
              //野兽 油桶
              let cameraPos = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.mainCamera.node.getWorldPosition();

              if (cameraPos.x > cameraLimit.y + 5) {
                // 使用 tween 实现平滑移动到 x=14，持续时间0.5秒
                tween((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.mainCamera.node).to(0.8, {
                  worldPosition: new Vec3(cameraLimit.y + 5, cameraPos.y, cameraPos.z)
                }).start();
              }
            } else if (this._nowSocketIndex == 1) {
              //矿场
              let cameraPos = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.mainCamera.node.getWorldPosition();

              if (cameraPos.x < cameraLimit.x) {
                // 使用 tween 实现平滑移动到 x=14，持续时间0.5秒
                tween((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.mainCamera.node).to(0.8, {
                  worldPosition: new Vec3(cameraLimit.x - 1, cameraPos.y, cameraPos.z)
                }).start();
              }
            } else if (this._nowSocketIndex == 0) {
              //农场
              let cameraPos = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.mainCamera.node.getWorldPosition();

              if (cameraPos.x > cameraLimit.y + 5) {
                // 使用 tween 实现平滑移动到 x=14，持续时间0.5秒
                tween((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.mainCamera.node).to(0.8, {
                  worldPosition: new Vec3(cameraLimit.y + 5, cameraPos.y, cameraPos.z)
                }).start();
              }
            }

            this.plugLinkSocket();
            return;
          }

          let plot = (_crd && RopeUtils === void 0 ? (_reportPossibleCrUseOfRopeUtils({
            error: Error()
          }), RopeUtils) : RopeUtils).getPlotIndexByPos((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.nowPlug.worldPosition);

          if (plot !== this._lastPlotIndex) {
            //  eventMgr.emit(PlotName[this._lastPlotIndex] + "_cloudFadeIn");
            if (plot === -1) {} else {
              (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
                error: Error()
              }), eventMgr) : eventMgr).emit((_crd && PlotName === void 0 ? (_reportPossibleCrUseOfPlotName({
                error: Error()
              }), PlotName) : PlotName)[plot] + "_cloudFadeOut");
            }

            this._lastPlotIndex = plot;
          } //屏幕坐标转3d坐标,拖动插头移动


          const touchPos = event.getLocation(); // const cameraMain:Camera = DataManager.Instance.mainCamera.camera;
          // const z:number= this.getDepthByPos(touchPos);
          // let outPos:Vec3 = new Vec3();
          // cameraMain.screenToWorld(new Vec3(touchPos.x,touchPos.y,z),outPos);

          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.nowPlug.setWorldPosition(this.getPlugPos(touchPos)); //console.log("move plug",outPos);
          //插头移动方向

          let eulerAngles = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.plugMoveAngles[this._nowSocketIndex];
          this._plugTartetRot = new Quat();
          Quat.fromEuler(this._plugTartetRot, eulerAngles.x, eulerAngles.y, eulerAngles.z); //console.log(`euler ${String(eulerAngles)}  tartetRot ${String(this._plugTartetRot)}`);

          if ((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.nowPlug.getRotation().equals(this._plugTartetRot)) {
            this.cameraFoollowPlug(event);
            return;
          } //转动插头方向


          let moveLen = Vec2.distance(touchPos, this._lastTouchPos); // 计算旋转步长（转换为弧度）

          const maxAngle = this._plugRotateSpeed * moveLen * Math.PI / 180; // 使用球面线性插值(Slerp)

          let currentRot = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.nowPlug.getRotation();
          Quat.slerp(currentRot, currentRot, this._plugTartetRot, Math.min(1, maxAngle / (_crd && MathUtil === void 0 ? (_reportPossibleCrUseOfMathUtil({
            error: Error()
          }), MathUtil) : MathUtil).getAngleBetweenQuats(currentRot, this._plugTartetRot)));
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.nowPlug.setRotation(currentRot);
          this.cameraFoollowPlug(event);
        }

        onTouchEnd(event) {
          console.log("touch end");

          if (this._movingPlug) {
            this._movingPlug = false; //处理插头、插座 弹回去 在此期间不能操作插头

            this._plugBacking = true;

            let endPos = this._plugStartPos.clone();

            tween((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.nowPlug).to(1, {
              worldPosition: endPos,
              rotation: this._plugStartRot
            }, {
              easing: "cubicOut"
            }).call(() => {
              let plugItem = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.nowPlug.getComponent(_crd && PlugItem === void 0 ? (_reportPossibleCrUseOfPlugItem({
                error: Error()
              }), PlugItem) : PlugItem);

              if (plugItem) {
                plugItem.state = 0;
              }

              this.cleanNowPlug();
              this._plugBacking = false;
            }).start();

            if (this._lastPlotIndex !== -1) {
              //云恢复
              //  eventMgr.emit(PlotName[this._lastPlotIndex] + "_cloudFadeIn");
              this._lastPlotIndex = -1;
            }
          } else {
            this._movingCamera = false;
          }
        }

        plugLinkSocket() {
          this._movingPlug = false;
          this._pluglinking = true;
          let nowPlug = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.nowPlug;
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.ropeManager.plugLinkSocket(this._nowSocketIndex, nowPlug);
        }

        cleanNowPlug() {
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.nowPlug = null;
          this._plugStartPos = null;
          this._plugStartRot = null;
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.nowSocket = null;
          this._nowSocketIndex = -1;
          this._plugTartetRot = null;
          this._lastPlotIndex = -1;
        }

        getDepthByPos(pos) {
          let z = 0; //世界坐标

          let startWorldPos = this._plugStartPos.clone();

          let endWorldPos = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.nowSocket.getWorldPosition().clone();

          if (startWorldPos && endWorldPos) {
            const cameraMain = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.mainCamera.camera; //相机深度比值

            const startDepth = (_crd && TransformPositionUtil === void 0 ? (_reportPossibleCrUseOfTransformPositionUtil({
              error: Error()
            }), TransformPositionUtil) : TransformPositionUtil).getDepthRatio(cameraMain, startWorldPos);
            const endDepth = (_crd && TransformPositionUtil === void 0 ? (_reportPossibleCrUseOfTransformPositionUtil({
              error: Error()
            }), TransformPositionUtil) : TransformPositionUtil).getDepthRatio(cameraMain, endWorldPos); //屏幕坐标

            const startSceenPos = cameraMain.worldToScreen(startWorldPos);
            const endSceenPos = cameraMain.worldToScreen(endWorldPos); //插头距离比值

            const ropePosRatio = (_crd && TransformPositionUtil === void 0 ? (_reportPossibleCrUseOfTransformPositionUtil({
              error: Error()
            }), TransformPositionUtil) : TransformPositionUtil).getProjectionRatio(new Vec2(startSceenPos.x, startSceenPos.y), new Vec2(endSceenPos.x, endSceenPos.y), new Vec2(pos.x, pos.y)); //插头深度

            z = ropePosRatio * (endDepth - startDepth) + startDepth;
          } else {
            console.log("socketPos or plugStartPos is null", startWorldPos, endWorldPos);
          }

          return z;
        } //计算Y轴高度，基于距离原点的水平距离
        // public calculateHeight(x: number, z: number): number {
        //     let maxDistance = 13;
        //     let minDistance = 4;
        //     // 计算水平距离（忽略y轴）
        //     const distance = Math.sqrt(x * x + z * z);
        //     if(distance<minDistance){
        //         return 11;
        //     }
        //     // 限制最大距离为10
        //     const normalizedDistance = Math.min(distance, maxDistance);
        //     // 高度计算：距离0时最高，距离10时最低(3)
        //     // 你可以调整这个公式来改变高度曲线
        //     const height = 11 - (7 * (normalizedDistance - minDistance) / (maxDistance-minDistance));
        //     return height;
        // }
        //2d 转3d坐标


        getPlugPos(pos) {
          const camera = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.mainCamera.camera;
          const ray = camera.screenPointToRay(pos.x, pos.y);
          const lastPos = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.nowPlug.worldPosition.clone(); // 计算射线上距离lastPos最近的点

          const closestPoint = this.getClosestPointOnRay(ray, lastPos); // 应用高度计算

          closestPoint.y = this.calculateHeight(closestPoint.x, closestPoint.z);
          console.log("closestPoint == ", new Vec3((closestPoint.x - lastPos.x) * 0.3, (closestPoint.y - lastPos.y) * 0.3, (closestPoint.z - lastPos.z) * 0.3)); // 添加平滑过渡 (可选)

          return new Vec3(lastPos.x + (closestPoint.x - lastPos.x) * 0.5, lastPos.y + (closestPoint.y - lastPos.y) * 0.5, lastPos.z + (closestPoint.z - lastPos.z) * 0.5);
        }
        /**
         * 计算射线上距离目标点最近的点
         */


        getClosestPointOnRay(ray, targetPoint) {
          // 计算射线方向向量
          const rayDirection = ray.d.normalize(); // 计算从射线起点到目标点的向量

          const rayToPoint = Vec3.subtract(new Vec3(), targetPoint, ray.o); // 计算投影长度

          const projection = Vec3.dot(rayToPoint, rayDirection); // 如果投影为负，说明最近点是射线起点

          if (projection <= 0) {
            return ray.o.clone();
          } // 返回射线上最近的点


          return ray.o.add(rayDirection.multiplyScalar(projection));
        }
        /**
         * 改进的高度计算函数
         */


        calculateHeight(x, z) {
          const distance = Math.sqrt(x * x + z * z);
          const normalizedDistance = Math.min(distance, 15); //console.log("distance",distance,"normalizedDistance",normalizedDistance);
          // 使用平滑的曲线过渡

          const height = 4 + 6 * (1 - normalizedDistance / 15) * (1 - normalizedDistance / 15);
          return height;
        } //检查范围内插座、更新目标插头


        checkTargetSocket() {
          //  let pos: Vec3 = DataManager.Instance.nowPlug.worldPosition.clone();
          let pos = (_crd && MathUtil === void 0 ? (_reportPossibleCrUseOfMathUtil({
            error: Error()
          }), MathUtil) : MathUtil).worldToLocal((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.nowPlug.worldPosition.clone(), (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.sceneManger.node); //DataManager.Instance.nowSocket.worldPosition;
          // pos.x -= 5;
          // pos.z += 5;

          let index = 0;

          if (pos.x > Math.abs(pos.z)) {
            index = 1;
          } else if (pos.z > Math.abs(pos.x)) {
            index = 2;
          } else if (-pos.x > Math.abs(pos.z)) {
            index = 3;
          }

          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.nowSocket = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.socketNodes[index];
          this._nowSocketIndex = index; //console.log("find socket",DataManager.Instance.nowSocket.worldPosition);
        }
        /**
         * 将屏幕滑动方向转换为世界空间方向
         */


        screenToWorldDirection(screenDelta, cameraNode) {
          // 获取摄像机变换方向
          // 屏幕右方向对应世界空间的摄像机右方向
          const cameraRight = new Vec3();
          Vec3.transformQuat(cameraRight, Vec3.RIGHT, cameraNode.worldRotation);
          cameraRight.y = 0;
          cameraRight.normalize(); // 屏幕上方向对应世界空间的摄像机前方向(去掉Y分量)

          const cameraForward = new Vec3();
          Vec3.transformQuat(cameraForward, Vec3.FORWARD, cameraNode.worldRotation);
          cameraForward.y = 0;
          cameraForward.normalize(); // 组合世界空间移动方向

          const worldDir = new Vec3();
          Vec3.scaleAndAdd(worldDir, worldDir, cameraRight, screenDelta.x);
          Vec3.scaleAndAdd(worldDir, worldDir, cameraForward, -screenDelta.y); // 屏幕Y轴与世界Z轴相反

          return worldDir;
        }

        onPlugStateUpdate(state) {
          if (state === 2 && this._pluglinking) {
            this.cleanNowPlug();
            this._pluglinking = false;
          }
        }

        onTowerUpgradeBtnShow() {
          this._checkTowerBtn = true;
        }

        checkTowerBtnClick(event) {
          let cameraMain = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.mainCamera.camera;
          let ray = new geometry.Ray();
          const touchPos = event.getLocation();
          console.log("touchPos:", touchPos);
          cameraMain.screenPointToRay(touchPos.x, touchPos.y, ray); // 以下参数可选

          const mask = 1 << 2;
          const maxDistance = 10000000;
          const queryTrigger = true;

          if (PhysicsSystem.instance.raycastClosest(ray, mask, maxDistance, queryTrigger)) {
            return true;
          }

          return false;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "touchNode", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "sensitivity", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.05;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=99eb36d611a4f54f297801996314b18650465e18.js.map