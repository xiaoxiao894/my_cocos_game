System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Camera, Component, geometry, Input, PhysicsSystem, Animation, Vec3, EnemyTree, eventMgr, EventType, BehaviourType, Global, BubbleFead, super_html_playable, _dec, _dec2, _class, _class2, _descriptor, _crd, ccclass, property, touchEvent;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfEnemyTree(extras) {
    _reporterNs.report("EnemyTree", "../entitys/EnemyTree", _context.meta, extras);
  }

  function _reportPossibleCrUseOfeventMgr(extras) {
    _reporterNs.report("eventMgr", "./EventManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventType(extras) {
    _reporterNs.report("EventType", "./EventType", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBehaviourType(extras) {
    _reporterNs.report("BehaviourType", "../entitys/Character", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGlobal(extras) {
    _reporterNs.report("Global", "./Global", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBubbleFead(extras) {
    _reporterNs.report("BubbleFead", "../BubbleFead", _context.meta, extras);
  }

  function _reportPossibleCrUseOfsuper_html_playable(extras) {
    _reporterNs.report("super_html_playable", "../../super_html_playable", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Camera = _cc.Camera;
      Component = _cc.Component;
      geometry = _cc.geometry;
      Input = _cc.Input;
      PhysicsSystem = _cc.PhysicsSystem;
      Animation = _cc.Animation;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      EnemyTree = _unresolved_2.EnemyTree;
    }, function (_unresolved_3) {
      eventMgr = _unresolved_3.eventMgr;
    }, function (_unresolved_4) {
      EventType = _unresolved_4.EventType;
    }, function (_unresolved_5) {
      BehaviourType = _unresolved_5.BehaviourType;
    }, function (_unresolved_6) {
      Global = _unresolved_6.Global;
    }, function (_unresolved_7) {
      BubbleFead = _unresolved_7.BubbleFead;
    }, function (_unresolved_8) {
      super_html_playable = _unresolved_8.default;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "6df3f9UGEhIib8CUusgNFp+", "touchEvent", undefined);

      __checkObsolete__(['_decorator', 'Camera', 'Component', 'EventTouch', 'geometry', 'Input', 'PhysicsSystem', 'Animation', 'Vec3', 'Quat']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("touchEvent", touchEvent = (_dec = ccclass('touchEvent'), _dec2 = property(Camera), _dec(_class = (_class2 = class touchEvent extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "mainCamera", _descriptor, this);

          this.originalScale = new Vec3(1, 1, 1);
          // 存储原始缩放值
          this.upgradeNode = null;
          this.upgradeNode1 = null;
          this.clickTreeUI = null;
          this.cornLandArrow = null;
          this.nameUUId = null;
          // 记录上次点击的时间
          this.lastTouchTime = 0;
          // 点击间隔时间，单位：毫秒
          this.clickInterval = 100;
          this.nameUIID = [];
        }

        start() {//this.mainCamera = WorldMap.instance.mainCamera;
        }

        update(deltaTime) {}

        onEnable() {
          this.node.on(Input.EventType.TOUCH_START, this.onTouchStart.bind(this), this);
          ;
          this.node.on(Input.EventType.TOUCH_MOVE, this.onTouchMove.bind(this), this);
          this.node.on(Input.EventType.TOUCH_END, this.onTouchEnd.bind(this), this);
          this.node.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd.bind(this), this);
        }

        onDisable() {
          this.node.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
          ;
          this.node.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
          this.node.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
          this.node.off(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        }

        onTouchStart(event) {
          var currentTime = Date.now(); // 检查距离上次点击是否超过设定的间隔时间

          if (currentTime - this.lastTouchTime < this.clickInterval) {
            return;
          } // 更新上次点击时间


          this.lastTouchTime = currentTime;
          var touchPos = event.getLocation();
          var ray = new geometry.Ray();
          this.mainCamera.screenPointToRay(touchPos.x, touchPos.y, ray);
          var mask = 1 << 1;
          var maxDistance = 10000000;
          var queryTrigger = true;
          console.log("mask mask == " + mask); // 调用射线检测，返回是否检测到碰撞体

          if (PhysicsSystem.instance.raycastClosest(ray, mask, maxDistance, queryTrigger)) {
            var result = PhysicsSystem.instance.raycastClosestResult;

            if (result.collider) {
              this.clickTreeUI = null; //this.clickTreeUI.scale = new Vec3(0.8, 0.8, 0.8);

              var nodeName = result.collider.node.name;

              if (nodeName.startsWith("UI_famuzhiyin")) {
                var _result$collider$node;

                //点击了树
                if (!this.nameUUId) {
                  this.nameUUId = result.collider.node.uuid;
                } else {
                  if (this.nameUUId != result.collider.node.uuid) {
                    this.nameUUId = result.collider.node.uuid; // this.nameUIID

                    if (this.nameUIID.indexOf(this.nameUUId) === -1) {
                      this.nameUIID.push(this.nameUUId);
                      (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                        error: Error()
                      }), Global) : Global).clickNum += 1;
                    } // this.nameUIID.push(result.collider.node.uuid);
                    // 

                  }
                }

                if ((_result$collider$node = result.collider.node.parent.getChildByName("UI_ZYXS")) != null && _result$collider$node.active) {
                  result.collider.node.parent.getChildByName("UI_ZYXS").active = false;
                }

                this.clickTreeUI = result.collider.node;
                this.clickTreeUI.scale = this.clickTreeUI.scale.clone().multiplyScalar(0.8);

                if (!(_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                  error: Error()
                }), Global) : Global).isClickUpLandTree) {
                  return;
                }

                var enemyTree = result.collider.node.parent.getComponent(_crd && EnemyTree === void 0 ? (_reportPossibleCrUseOfEnemyTree({
                  error: Error()
                }), EnemyTree) : EnemyTree);
                var isFind = enemyTree.getFindState();

                if ((_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                  error: Error()
                }), Global) : Global).isClickEnemy && result.collider.node.getComponent(_crd && BubbleFead === void 0 ? (_reportPossibleCrUseOfBubbleFead({
                  error: Error()
                }), BubbleFead) : BubbleFead).getFeadState() == false) {
                  isFind = true;
                }

                if (isFind) {
                  //渐变消失效果
                  if (result.collider.node.getComponent(_crd && BubbleFead === void 0 ? (_reportPossibleCrUseOfBubbleFead({
                    error: Error()
                  }), BubbleFead) : BubbleFead)) {
                    result.collider.node.getComponent(_crd && BubbleFead === void 0 ? (_reportPossibleCrUseOfBubbleFead({
                      error: Error()
                    }), BubbleFead) : BubbleFead).hideFead();
                  } //已经被寻找
                  //enemyTree.setFindState(false);


                  (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
                    error: Error()
                  }), eventMgr) : eventMgr).emit((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
                    error: Error()
                  }), EventType) : EventType).ENTITY_MOVE_TREE, enemyTree, (_crd && BehaviourType === void 0 ? (_reportPossibleCrUseOfBehaviourType({
                    error: Error()
                  }), BehaviourType) : BehaviourType).Tree);
                }
              } else if (nodeName == "upgradeNode") {
                var _result$collider$node2;

                //点击的交付木材按钮
                if ((_result$collider$node2 = result.collider.node.getChildByName("UI_ZYXS")) != null && _result$collider$node2.active) {
                  result.collider.node.getChildByName("UI_ZYXS").active = false;
                }

                this.upgradeNode = result.collider.node;
                this.upgradeNode.scale = new Vec3(0.8, 0.8, 0.8);
                (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                  error: Error()
                }), Global) : Global).treeHandOver = true;
                (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
                  error: Error()
                }), eventMgr) : eventMgr).emit((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
                  error: Error()
                }), EventType) : EventType).ENTITY_MOVE_HAND_OVER, result.collider, (_crd && BehaviourType === void 0 ? (_reportPossibleCrUseOfBehaviourType({
                  error: Error()
                }), BehaviourType) : BehaviourType).HandOver);
              } else if (nodeName == "upgradeNode-001") {
                if ((_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                  error: Error()
                }), Global) : Global).isUpgrade) {
                  var _result$collider$node3;

                  if (!(_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                    error: Error()
                  }), Global) : Global).isClickUpgradeEnemy) {
                    (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                      error: Error()
                    }), Global) : Global).isClickUpgradeEnemy = true;
                    (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                      error: Error()
                    }), Global) : Global).soundManager.playWarnSound();
                    var red = result.collider.node.getChildByName("2dNode").getChildByName("scaleNode").getChildByName("Sprite-red");
                    red.active = true;
                    result.collider.node.getComponent(Animation).stop();
                    result.collider.node.getComponent(Animation).play("shanhong");
                    (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
                      error: Error()
                    }), eventMgr) : eventMgr).emit((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
                      error: Error()
                    }), EventType) : EventType).SHOW_ENEMY, result.collider, (_crd && BehaviourType === void 0 ? (_reportPossibleCrUseOfBehaviourType({
                      error: Error()
                    }), BehaviourType) : BehaviourType).EnemyHnadOverPos); // if (Global.upgradeUIAnimtion != 3) {
                    //     Global.upgradeUIAnimtion = 3;
                    // }
                  }

                  if (!(_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                    error: Error()
                  }), Global) : Global).isClickUpgrade) {
                    (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                      error: Error()
                    }), Global) : Global).soundManager.playWarnSound();
                    return;
                  }

                  if ((_result$collider$node3 = result.collider.node.getChildByName("UI_ZYXS")) != null && _result$collider$node3.active) {
                    result.collider.node.getChildByName("UI_ZYXS").active = false;
                  }

                  if ((_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                    error: Error()
                  }), Global) : Global).upgradeUIAnimtion != 3) {
                    (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                      error: Error()
                    }), Global) : Global).upgradeUIAnimtion = 3;
                  }

                  this.upgradeNode1 = result.collider.node;
                  this.upgradeNode1.scale = new Vec3(0.8, 0.8, 0.8);
                  (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
                    error: Error()
                  }), eventMgr) : eventMgr).emit((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
                    error: Error()
                  }), EventType) : EventType).ENTITY_ENEMY_HAND_OVER, result.collider, (_crd && BehaviourType === void 0 ? (_reportPossibleCrUseOfBehaviourType({
                    error: Error()
                  }), BehaviourType) : BehaviourType).EnemyHnadOverPos);
                }
              } else if (nodeName == "TreeArrow") {
                var _result$collider$node4;

                //tree 点击传送下个地块
                if ((_result$collider$node4 = result.collider.node.getChildByName("UI_ZYXS")) != null && _result$collider$node4.active) {
                  result.collider.node.getChildByName("UI_ZYXS").active = false;
                }

                (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                  error: Error()
                }), Global) : Global).isMoveCamreToCorn = true;
                (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
                  error: Error()
                }), eventMgr) : eventMgr).emit((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
                  error: Error()
                }), EventType) : EventType).ENTITY_TREE_TRANSMIT, result.collider.node);
              } else if (nodeName.startsWith("Arrow")) {
                var _result$collider$node5;

                if (!(_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                  error: Error()
                }), Global) : Global).isClickUpLandCorn || (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                  error: Error()
                }), Global) : Global).isMoveCamreToCorn) {
                  return;
                }

                if ((_result$collider$node5 = result.collider.node.getChildByName("UI_ZYXS")) != null && _result$collider$node5.active) {
                  result.collider.node.getChildByName("UI_ZYXS").active = false;
                }

                var arrowNum = parseInt(nodeName.replace("Arrow", ""));
                (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                  error: Error()
                }), Global) : Global).clickCornLand[arrowNum] = 1;
                this.cornLandArrow = result.collider.node;
                this.cornLandArrow.scale = this.cornLandArrow.scale.clone().multiplyScalar(0.8);
                (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
                  error: Error()
                }), eventMgr) : eventMgr).emit((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
                  error: Error()
                }), EventType) : EventType).ENTITY_CORN_CUT, result.collider.node);
              } else if (nodeName.startsWith("TreeArrow-001")) {
                var _result$collider$node6;

                if ((_result$collider$node6 = result.collider.node.getChildByName("UI_ZYXS")) != null && _result$collider$node6.active) {
                  result.collider.node.getChildByName("UI_ZYXS").active = false;
                }

                (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
                  error: Error()
                }), eventMgr) : eventMgr).emit((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
                  error: Error()
                }), EventType) : EventType).ENTITY_ENEMY_TRANSMIT, result.collider.node);
              } else if (nodeName.startsWith("SangshiPrefab")) {
                var _result$collider$node7;

                if ((_result$collider$node7 = result.collider.node.parent.getChildByName("UI_gongji_3").getChildByName("UI_ZYXS")) != null && _result$collider$node7.active) {
                  result.collider.node.parent.getChildByName("UI_gongji_3").getChildByName("UI_ZYXS").active = false;
                } //  result.collider.enabled = false;
                //  result.collider.destroy()


                if (result.collider.node.getComponent(_crd && BubbleFead === void 0 ? (_reportPossibleCrUseOfBubbleFead({
                  error: Error()
                }), BubbleFead) : BubbleFead)) {
                  if (result.collider.node.getComponent(_crd && BubbleFead === void 0 ? (_reportPossibleCrUseOfBubbleFead({
                    error: Error()
                  }), BubbleFead) : BubbleFead).getFeadState()) {
                    return;
                  } else {
                    result.collider.node.getComponent(_crd && BubbleFead === void 0 ? (_reportPossibleCrUseOfBubbleFead({
                      error: Error()
                    }), BubbleFead) : BubbleFead).hideFead();
                    (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
                      error: Error()
                    }), eventMgr) : eventMgr).emit((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
                      error: Error()
                    }), EventType) : EventType).ENTITY_CLICK_ENEMY, result.collider.node);
                  }
                }
              }

              console.log("点击到了模型:", result.collider.node.name); // 在这里写点击模型后的逻辑
            }
          } else {
            console.log("未检测到碰撞体");
          }
        }

        onTouchMove(event) {}

        onTouchEnd(event) {
          if (this.upgradeNode) {
            this.upgradeNode.scale = new Vec3(1, 1, 1);
          }

          if (this.upgradeNode1) {
            this.upgradeNode1.scale = new Vec3(1, 1, 1);
          }

          if (this.clickTreeUI) {
            //this.clickTreeUI.scale = new Vec3(1, 1, 1);
            this.clickTreeUI.scale = this.clickTreeUI.scale.clone().multiplyScalar(1.2);
          }

          if (this.cornLandArrow) {
            this.cornLandArrow.scale = new Vec3(1, 1, 1);

            if (!(_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
              error: Error()
            }), Global) : Global).isClickUpLandCorn) {
              return;
            } ///this.cornLandArrow.scale.clone().multiplyScalar(1.2);

          }
        }

        btnDown() {
          (_crd && super_html_playable === void 0 ? (_reportPossibleCrUseOfsuper_html_playable({
            error: Error()
          }), super_html_playable) : super_html_playable).download();
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "mainCamera", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=952136b2e8b614496429a1e1df80a81f6ffac026.js.map