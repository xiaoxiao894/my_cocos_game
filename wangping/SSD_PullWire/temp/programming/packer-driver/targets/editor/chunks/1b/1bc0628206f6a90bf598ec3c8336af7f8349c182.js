System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7", "__unresolved_8"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, CCInteger, Component, instantiate, Node, Quat, tween, Vec3, DataManager, MathUtil, CompleteRopeItem, EventManager, EventName, PlugItem, eventMgr, PlotName, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _crd, ccclass, property, RopeManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfDataManager(extras) {
    _reporterNs.report("DataManager", "../Global/DataManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMathUtil(extras) {
    _reporterNs.report("MathUtil", "../Utils/MathUtils", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCompleteRopeItem(extras) {
    _reporterNs.report("CompleteRopeItem", "./CompleteRopeItem", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventManager(extras) {
    _reporterNs.report("EventManager", "../Global/EventManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventName(extras) {
    _reporterNs.report("EventName", "../Common/Enum", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPlugItem(extras) {
    _reporterNs.report("PlugItem", "./PlugItem", _context.meta, extras);
  }

  function _reportPossibleCrUseOfeventMgr(extras) {
    _reporterNs.report("eventMgr", "../core/EventManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPlotName(extras) {
    _reporterNs.report("PlotName", "../core/EventType", _context.meta, extras);
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
      instantiate = _cc.instantiate;
      Node = _cc.Node;
      Quat = _cc.Quat;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      DataManager = _unresolved_2.DataManager;
    }, function (_unresolved_3) {
      MathUtil = _unresolved_3.MathUtil;
    }, function (_unresolved_4) {
      CompleteRopeItem = _unresolved_4.CompleteRopeItem;
    }, function (_unresolved_5) {
      EventManager = _unresolved_5.EventManager;
    }, function (_unresolved_6) {
      EventName = _unresolved_6.EventName;
    }, function (_unresolved_7) {
      PlugItem = _unresolved_7.PlugItem;
    }, function (_unresolved_8) {
      eventMgr = _unresolved_8.eventMgr;
    }, function (_unresolved_9) {
      PlotName = _unresolved_9.PlotName;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "06626kuc7tG5IyRfpfSZFNu", "RopeManager", undefined);

      __checkObsolete__(['_decorator', 'CCInteger', 'Component', 'instantiate', 'Node', 'PointToPointConstraint', 'Quat', 'RigidBody', 'RigidBodyComponent', 'tween', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("RopeManager", RopeManager = (_dec = ccclass('RopeManager'), _dec2 = property(Node), _dec3 = property(Node), _dec4 = property(Node), _dec5 = property(Node), _dec6 = property(CCInteger), _dec7 = property(Node), _dec8 = property(Node), _dec9 = property(Node), _dec10 = property(Node), _dec(_class = (_class2 = class RopeManager extends Component {
        constructor(...args) {
          super(...args);

          /** 电线起点 */
          _initializerDefineProperty(this, "headNodes", _descriptor, this);

          /** 电线终点 */
          _initializerDefineProperty(this, "endNodes", _descriptor2, this);

          /** 电线父节点 */
          _initializerDefineProperty(this, "ropeParent", _descriptor3, this);

          _initializerDefineProperty(this, "completeRope", _descriptor4, this);

          _initializerDefineProperty(this, "leftRopeMoveSpeed", _descriptor5, this);

          _initializerDefineProperty(this, "newEndNode", _descriptor6, this);

          _initializerDefineProperty(this, "Arrow_beast", _descriptor7, this);

          _initializerDefineProperty(this, "Arrow_mining", _descriptor8, this);

          _initializerDefineProperty(this, "Arrow_farmLand", _descriptor9, this);

          this._startRopeNum = 3;
          this._ropes = [];
          //当前rope索引
          this._nowRopeIndex = 0;
          //通知引导更新位置
          this.index = true;
          this.index1 = true;
        }

        start() {
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.Arrow_beast = this.Arrow_beast;
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.Arrow_farmLand = this.Arrow_farmLand;
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.Arrow_mining = this.Arrow_mining;
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.ropeManager = this;

          for (let i = 0; i < this._startRopeNum; i++) {
            this.creatPope(i);
          }

          for (let i = this._startRopeNum; i < this.headNodes.length; i++) {
            this.headNodes[i].active = false;
            this.endNodes[i].active = false;
          }
        }

        onEnable() {
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).inst.on((_crd && EventName === void 0 ? (_reportPossibleCrUseOfEventName({
            error: Error()
          }), EventName) : EventName).PlugStateUpdate, this.onPlugStateUpdate, this);
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).inst.on((_crd && EventName === void 0 ? (_reportPossibleCrUseOfEventName({
            error: Error()
          }), EventName) : EventName).GameOver, this.onGameOver, this);
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).inst.on((_crd && EventName === void 0 ? (_reportPossibleCrUseOfEventName({
            error: Error()
          }), EventName) : EventName).ropeMovePoint, this.ropeMovePointCallback, this);
        }

        onDisable() {
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).inst.off((_crd && EventName === void 0 ? (_reportPossibleCrUseOfEventName({
            error: Error()
          }), EventName) : EventName).PlugStateUpdate, this.onPlugStateUpdate, this);
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).inst.off((_crd && EventName === void 0 ? (_reportPossibleCrUseOfEventName({
            error: Error()
          }), EventName) : EventName).GameOver, this.onGameOver, this);
        }
        /** 创建一根电线 */


        creatPope(index = 0) {
          let newParent = instantiate(this.completeRope);
          let item = newParent.getComponent(_crd && CompleteRopeItem === void 0 ? (_reportPossibleCrUseOfCompleteRopeItem({
            error: Error()
          }), CompleteRopeItem) : CompleteRopeItem);

          if (item) {
            newParent.parent = this.ropeParent;

            this._ropes.push(item);

            item.init(index, this.headNodes[index], this.endNodes[index]);
          }
        }

        creatLeftRopes() {
          let index = 0;

          for (let i = this._startRopeNum; i < this.headNodes.length; i++) {
            if ((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.leftSocket[index] == 3) {
              index += 1;
              this.scheduleOnce(() => {
                this.headNodes[i].setPosition(new Vec3(-0.837, 0, 3));
                this.endNodes[i].setPosition(new Vec3(-1.305, 0, 1.8)); //  this.headNodes[i].setRotation();
                //this.headNodes[i].rotation = this.headNodes[1].rotation;
                //this.endNodes[i].setPosition(new Vec3(-1.4, 0.5, 2.917));

                let rot = new Quat();
                Quat.fromEuler(rot, 0, -26, 0);
                this.endNodes[i].setRotation(rot); // this.endNodes[i].setRotation(this.endNodes[1].rotation);
                // this.endNodes[i].position = this.endNodes[1].position;
                // this.endNodes[i].rotation = this.endNodes[1].rotation;
              }, 0.5);
            }

            this.scheduleOnce(() => {
              this.schedule(() => {
                this.headNodes[i].active = true;
                this.endNodes[i].active = true;
              }, 1);
              this.creatPope(i);
            }, 0.5);
            console.log("DataManager.Instance.leftSocket[index] == ", (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.leftSocket[0]);
            console.log("DataManager.Instance.leftSocket[index] == ", (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.leftSocket[1]); //插销的动作取消改用Animation
            // let pos: Vec3 = this.endNodes[i].getWorldPosition().clone();
            // this.endNodes[i].setWorldPosition(new Vec3(pos.x, pos.y + 5, pos.z));
            // tween(this.endNodes[i]).to(0.15, { worldPosition: pos }).start();
          }
        } // private creatStaticRope(index:number = 0){
        //     let plugTar:Node = this.endNodes[index];
        //     let staticTar:Node = this.headNodes[index];
        //     const curvePoints = MathUtil.generateSmoothPath(plugTar.getWorldPosition().clone(),staticTar.getWorldPosition().clone(),this._ropeLen,-8.35);
        //     let newParent = new Node("Rope"+index);
        //     newParent.parent = this.ropeParent;
        //     this._ropesParent.push(newParent);
        //     console.log("staticPoss",JSON.stringify(curvePoints));
        //     for(let i=0;i<this._ropeLen;i++){
        //         let ropeNode = instantiate(this.ropeNode);
        //         ropeNode.getComponent(RigidBody).type = RigidBody.Type.STATIC;
        //         ropeNode.active = true;
        //         ropeNode.parent = newParent;
        //         ropeNode.setWorldPosition(curvePoints[i].position);
        //         ropeNode.rotation = curvePoints[i].rotation;
        //     }        
        // }


        setRopeStateByIndex(index, state) {
          let item = this._ropes[index];
          item.state = state;
        }

        update(deltaTime) {}

        onPlugStateUpdate() {
          if ((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.leftSocket.length <= 2) {
            this.Arrow_farmLand.active = false;
            this.Arrow_mining.active = false;
            this.Arrow_beast.active = false;
            (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
              error: Error()
            }), EventManager) : EventManager).inst.emit((_crd && EventName === void 0 ? (_reportPossibleCrUseOfEventName({
              error: Error()
            }), EventName) : EventName).ArrowTargetVectorUpdate, null);
            return;
          }

          let pos = new Vec3();
          let state1Index = -1;
          let state0Index = -1;

          for (let i = 0; i < this.endNodes.length; i++) {
            let plug = this.endNodes[i].getComponent(_crd && PlugItem === void 0 ? (_reportPossibleCrUseOfPlugItem({
              error: Error()
            }), PlugItem) : PlugItem);

            if (plug) {
              if (plug.state == 1) {
                state1Index = i;
                break;
              } else if (plug.state == 0 && state0Index == -1) {
                state0Index = i;
              }
            }
          }

          console.log("DataManager.Instance.leftSocket[0] == ", (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.leftSocket[0]);

          if ((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.leftSocket[0] == 0) {
            this.Arrow_farmLand.active = true;
          } else if ((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.leftSocket[0] == 1) {
            this.scheduleOnce(() => {
              if (!this.index) return;
              this.index = false;
              this.Arrow_mining.active = true;
            }, 1);
          } else if ((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.leftSocket[0] == 2) {
            this.scheduleOnce(() => {
              if (!this.index1) return;
              this.index = false;
              this.Arrow_beast.active = true;
            }, 1);
          } //引导到插座


          if (state1Index !== -1) {
            let socketIndex = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.leftSocket[0]; // pos = DataManager.Instance.socketNodes[socketIndex].getWorldPosition();
            // pos.x -= 1.5
            // pos.y += 4;

            pos = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.arrowNodes[socketIndex].getWorldPosition();
          } else if (state0Index !== -1) {
            //引导到插头
            pos = this.endNodes[state0Index].getWorldPosition();
          }

          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).inst.emit((_crd && EventName === void 0 ? (_reportPossibleCrUseOfEventName({
            error: Error()
          }), EventName) : EventName).ArrowTargetVectorUpdate, pos.clone());
        }

        onGameOver() {
          // this.scheduleOnce(() => {
          // this.unbatchAllAndMoveHeads();
          // }, 6)
          //  EventManager.inst.emit(EventName.ropeMovePoint);
          this.creatLeftRopes(); //停顿3秒，给剩下的插上插头
          // this.resetPos();

          this.scheduleOnce(this.connectLeftRopes, 3); //已有电线晃动一下

          for (let i = 0; i < this._startRopeNum; i++) {
            this._ropes[i].shackRope();
          }
        }

        ropeMovePointCallback() {
          this.unbatchAllAndMoveHeads();
        }
        /**
        * 取消所有绳子的合批，移动头节点位置
        */


        unbatchAllAndMoveHeads() {
          for (let i = 0; i < this._ropes.length; i++) {
            const ropeNode = this._ropes[i];
            const ropeComp = ropeNode.getComponent(_crd && CompleteRopeItem === void 0 ? (_reportPossibleCrUseOfCompleteRopeItem({
              error: Error()
            }), CompleteRopeItem) : CompleteRopeItem);

            if (ropeComp) {
              ropeComp.unbatchStaticModel();
            }
          }

          for (let i = 0; i < 5; i++) {
            const pos1 = this.headNodes[i].getPosition();
            this.headNodes[i].setPosition(new Vec3(pos1.x - 0.5, pos1.y + 1.5, pos1.z)); // let pos: Vec3 = this.headNodes[i].getWorldPosition().clone();
            // this.headNodes[i].setWorldPosition(new Vec3(pos.x, pos.y + 1.5, pos.z));
          }
        } //连接剩下的插头
        //this._nowRopeIndex = this._startRopeNum;


        connectLeftRopes() {
          this._nowRopeIndex = 0;
          this.continueFunc(); // for (let index = 0; index < this.endNodes.length; index++) {
          //     if (this.endNodes[index].getComponent(PlugItem).state == 0) {
          //         this.connectLeftOneRope();
          //         break;
          //         //this.plugLinkSocket(index,this.endNodes[index]);
          //     }
          // }
        }

        continueFunc() {
          for (let index = this._nowRopeIndex; index < this.endNodes.length; index++) {
            if (this.endNodes[index].getComponent(_crd && PlugItem === void 0 ? (_reportPossibleCrUseOfPlugItem({
              error: Error()
            }), PlugItem) : PlugItem).state == 0) {
              if ((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.leftSocket[0] == 3) {
                this.newEndNode.getChildByName(`ChaTou${2}`).active = false;
              } else {
                this.newEndNode.getChildByName(`ChaTou${index}`).active = false;
              }

              console.log("continueFunc index == " + index);
              this.connectLeftOneRope();
              break; //this.plugLinkSocket(index,this.endNodes[index]);
            } else {
              this._nowRopeIndex++;
            }
          }
        }

        connectLeftOneRope() {
          let self = this;

          let plug = this.endNodes[this._nowRopeIndex].getComponent(_crd && PlugItem === void 0 ? (_reportPossibleCrUseOfPlugItem({
            error: Error()
          }), PlugItem) : PlugItem);

          if (plug && plug.state == 0) {
            plug.state = 1;
            let socketIndex = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.leftSocket.shift();
            let eulerAngles = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.plugMoveAngles[socketIndex];
            let plugTartetRot = new Quat();
            Quat.fromEuler(plugTartetRot, eulerAngles.x, eulerAngles.y, eulerAngles.z);
            let endPos = this.getEndPos((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.socketNodes[socketIndex]);
            let distance = Vec3.distance(this.endNodes[this._nowRopeIndex].worldPosition, endPos);
            let t = distance / (this.leftRopeMoveSpeed * 1000) + 1.3;
            let cloudHide = false;
            let tweenHandel = tween(this.endNodes[this._nowRopeIndex]).to(t, {
              rotation: plugTartetRot,
              worldPosition: endPos
            }, {
              easing: "cubicOut",

              onUpdate(target, ratio) {
                //检测距离靠近直接走插入动画
                let nowDistan = Vec3.distance(self.endNodes[self._nowRopeIndex].worldPosition, endPos);

                if (nowDistan < (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.plugConnectDistance) {
                  self.plugLinkSocket(socketIndex, self.endNodes[self._nowRopeIndex]);
                  tweenHandel.stop();
                }

                if (!cloudHide && nowDistan < (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.cloudHideDistance) {
                  (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
                    error: Error()
                  }), eventMgr) : eventMgr).emit((_crd && PlotName === void 0 ? (_reportPossibleCrUseOfPlotName({
                    error: Error()
                  }), PlotName) : PlotName)[socketIndex] + "_cloudFadeOut");
                  cloudHide = true;
                }
              }

            }).start();
            this.scheduleOnce(() => {
              this._nowRopeIndex++;

              if (this._nowRopeIndex < this.endNodes.length) {
                //this.connectLeftOneRope();
                this.continueFunc();
              }
            }, 2);
          }
        }
        /* 根据欧拉角计算反方向的移动向量
        * @param eulerAngles 欧拉角（度）
        * @param distance 移动距离
        * @returns 反方向移动向量
        */


        getBackwardMoveVector(eulerAngles, distance) {
          const quat = new Quat();
          Quat.fromEuler(quat, eulerAngles.x, eulerAngles.y, eulerAngles.z); // 初始前方向向量

          const forward = new Vec3(-1, 0, 0);
          const direction = new Vec3();
          Vec3.transformQuat(direction, forward, quat); // 反方向向量

          direction.multiplyScalar(-distance);
          return direction;
        } //插头插入动画，然后解锁地块


        plugLinkSocket(socketIndex, plugNode) {
          let dis = 2;
          let moveDis = this.getBackwardMoveVector((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.plugFinalAngles[socketIndex], dis);
          let endPos = this.getEndPos((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.socketNodes[socketIndex]);
          Vec3.add(moveDis, moveDis, plugNode.worldPosition);
          (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
            error: Error()
          }), eventMgr) : eventMgr).emit((_crd && PlotName === void 0 ? (_reportPossibleCrUseOfPlotName({
            error: Error()
          }), PlotName) : PlotName)[socketIndex] + "_cloudFadeOut");
          tween(plugNode).to(0.5, {
            worldPosition: moveDis,
            eulerAngles: (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.plugFinalAngles[socketIndex]
          }).to(0.3, {
            worldPosition: endPos
          }, {
            easing: "cubicOut"
          }).call(() => {
            let index = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.leftSocket.indexOf(socketIndex);

            if (index >= 0) {
              (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.leftSocket.splice(index, 1);
            }

            plugNode.getComponent(_crd && PlugItem === void 0 ? (_reportPossibleCrUseOfPlugItem({
              error: Error()
            }), PlugItem) : PlugItem).state = 2; //通知解锁

            (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
              error: Error()
            }), eventMgr) : eventMgr).emit((_crd && PlotName === void 0 ? (_reportPossibleCrUseOfPlotName({
              error: Error()
            }), PlotName) : PlotName)[socketIndex] + "_start");
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.sceneManger.checkBuildCanUpdate();
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.mainCamera.moveToCenter();
          }).start();
        } //插座对应插头位置


        getEndPos(socketNode) {
          let endPos = (_crd && MathUtil === void 0 ? (_reportPossibleCrUseOfMathUtil({
            error: Error()
          }), MathUtil) : MathUtil).localToWorldPos3D(new Vec3(0, 0, 1.5), socketNode);
          return endPos;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "headNodes", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "endNodes", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "ropeParent", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "completeRope", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "leftRopeMoveSpeed", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.5;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "newEndNode", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "Arrow_beast", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "Arrow_mining", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "Arrow_farmLand", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=1bc0628206f6a90bf598ec3c8336af7f8349c182.js.map