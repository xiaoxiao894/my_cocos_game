System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Animation, Color, Component, find, instantiate, Label, Node, Pool, SkeletalAnimation, tween, Vec3, DataManager, EntityTypeEnum, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _crd, ccclass, property, BoardConManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfDataManager(extras) {
    _reporterNs.report("DataManager", "../Global/DataManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEntityTypeEnum(extras) {
    _reporterNs.report("EntityTypeEnum", "../Enum/Index", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Animation = _cc.Animation;
      Color = _cc.Color;
      Component = _cc.Component;
      find = _cc.find;
      instantiate = _cc.instantiate;
      Label = _cc.Label;
      Node = _cc.Node;
      Pool = _cc.Pool;
      SkeletalAnimation = _cc.SkeletalAnimation;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      DataManager = _unresolved_2.DataManager;
    }, function (_unresolved_3) {
      EntityTypeEnum = _unresolved_3.EntityTypeEnum;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "872eejNArpNsb9jEt1+lmn3", "BoardConManager", undefined);

      __checkObsolete__(['_decorator', 'Animation', 'Color', 'Component', 'find', 'instantiate', 'Label', 'Node', 'Pool', 'SkeletalAnimation', 'tween', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("BoardConManager", BoardConManager = (_dec = ccclass('BoardConManager'), _dec2 = property(Node), _dec3 = property(Node), _dec4 = property(Label), _dec5 = property(Label), _dec6 = property(Label), _dec7 = property(SkeletalAnimation), _dec(_class = (_class2 = class BoardConManager extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "landmarkNode", _descriptor, this);

          _initializerDefineProperty(this, "fireNode", _descriptor2, this);

          _initializerDefineProperty(this, "line", _descriptor3, this);

          // 分母
          _initializerDefineProperty(this, "denominatorLabel", _descriptor4, this);

          // 分子
          _initializerDefineProperty(this, "moleculeLabel", _descriptor5, this);

          _initializerDefineProperty(this, "conveyorAni", _descriptor6, this);

          this._boardPool = null;
          this._boardCount = 300;
          this._isOnceFire = true;
          this._curBoardCount = 0;
          this._speed = 4.7;
          this._direction = new Vec3();
          this._endPos = void 0;
          this._boardList = [];
          this._conveyorAniPlaying = false;
          this._plots = ["Plot0", "Plot2", "Plot3", "Plot4", "Plot9"];
          this._unlock = null;
          // 1 , 0.7, 0.5 , 0.4
          this._elapsedTime = 0;
          this._curSecond = 0;
          // 放在类里
          this._tmp = new Vec3();
        }

        start() {
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.boardManager = this;
          this._unlock = find("THREE3DNODE/Unlock");
        }

        boardManagerInit() {
          this._boardPool = new Pool(() => {
            var boardPrefab = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.prefabMap.get((_crd && EntityTypeEnum === void 0 ? (_reportPossibleCrUseOfEntityTypeEnum({
              error: Error()
            }), EntityTypeEnum) : EntityTypeEnum).Board);
            return instantiate(boardPrefab);
          }, this._boardCount, node => {
            node.removeFromParent();
          });
        }

        createboard() {
          if (!this._boardPool) return;

          var node = this._boardPool.alloc();

          if (node.parent == null) node.setParent(this.node);
          node.active = true;
          return node;
        }

        onDestroy() {
          this._boardPool.destroy();
        } // 回收木桩


        onboardDead(node) {
          node.active = false;

          this._boardPool.free(node);
        }

        boardAni(startNode, endNode) {
          var board = this.createboard();
          if (!board) return;
          board.setPosition(startNode.position);
          board.setScale(0, 0, 0);

          if (!(_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.isConveyerBeltUpgrade) {
            board.setRotationFromEuler(0, 90, 0);
          } else {
            board.setRotationFromEuler(0, 0, 0);
          }

          if (!this._endPos) {
            this._endPos = endNode.worldPosition.clone();
            Vec3.subtract(this._direction, endNode.worldPosition, startNode.worldPosition);
            this._direction = this._direction.normalize();
          }

          tween(board).to(0.15, {
            scale: new Vec3(1.2, 1.2, 1.2)
          }, {
            easing: 'quadOut'
          }).to(0.05, {
            scale: new Vec3(1, 1, 1)
          }, {
            easing: 'quadOut'
          }).call(() => {
            this._boardList.push(board); // if (!this._conveyorAniPlaying) {
            //     this.conveyorAni.play();
            //     this._conveyorAniPlaying = true;
            // }

          }).start();
        }

        _applyFractionFontSize(denLen) {
          if (denLen >= 4) {
            var s = 30;
            this.denominatorLabel.fontSize = s;
            this.denominatorLabel.lineHeight = s;
            this.line.fontSize = s;
            this.line.lineHeight = s;
            this.moleculeLabel.fontSize = s;
            this.moleculeLabel.lineHeight = s;
          } else if (denLen >= 3) {
            var _s = 40;
            this.denominatorLabel.fontSize = _s;
            this.denominatorLabel.lineHeight = _s;
            this.line.fontSize = _s;
            this.line.lineHeight = _s;
            this.moleculeLabel.fontSize = _s;
            this.moleculeLabel.lineHeight = _s;
          }
        }

        _handleArrive(board, dm) {
          // 到达后的收尾动画与状态更新
          tween(board).to(0.05, {
            scale: new Vec3(0, 0, 0)
          }, {
            easing: 'quadOut'
          }).call(() => {
            var _this$denominatorLabe, _this$denominatorLabe2, _this$fireNode, _this$node;

            this._curSecond += 2;
            this._curBoardCount += 1;
            this.moleculeLabel.color = new Color(0, 255, 0, 255);
            this.denominatorLabel.color = new Color(0, 255, 0, 255);
            this.line.color = new Color(0, 255, 0, 255);
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.curQuantityFirewood = Math.max((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.curQuantityFirewood - 1, 0);

            if (this.moleculeLabel) {
              this.moleculeLabel.string = "" + this._curBoardCount;
            } // 根据分母长度调整字形


            var denLen = (_this$denominatorLabe = (_this$denominatorLabe2 = this.denominatorLabel) == null || (_this$denominatorLabe2 = _this$denominatorLabe2.string) == null ? void 0 : _this$denominatorLabe2.length) != null ? _this$denominatorLabe : 0;

            this._applyFractionFontSize(denLen); // 清理木板


            this.onboardDead(board);
            if (board != null && board.isValid) board.removeFromParent(); // 仅触发一次火焰动画

            var fireAni = (_this$fireNode = this.fireNode) == null ? void 0 : _this$fireNode.getComponent(Animation);

            if (fireAni && (_this$node = this.node) != null && _this$node.isValid && this.node.children.length > 0 && this._isOnceFire) {
              this._isOnceFire = false;
              this.fireNode.active = true;
              fireAni.play("TX_huoyan-001");
            }

            dm.isTowerAttack = true;
          }).start();
        }

        update(dt) {
          if (Number(this.denominatorLabel.string) + 1 <= Number(this.moleculeLabel.string) + (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.curQuantityFirewood) {
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.isContinueFillFireWood = false;
          } else {
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.isContinueFillFireWood = true;
          }

          var dm = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance;
          if (!dm.curReduceTemplateTimeArr) return; // 缓存经常用到的量

          var level = dm.conveyorLevel || 1;
          var speedStep = this._speed * dt * level; // === 更新木桩（木板）位置，从后往前安全移除 ===

          for (var i = this._boardList.length - 1; i >= 0; i--) {
            var board = this._boardList[i];

            if (!(board != null && board.isValid)) {
              this._boardList.splice(i, 1);

              continue;
            } // dir = endPos - boardPos


            Vec3.subtract(this._tmp, this._endPos, board.worldPosition); // 到达判定：与前进方向点积 < 0 说明超越终点

            if (Vec3.dot(this._tmp, this._direction) < 0) {
              // 出列并处理抵达
              this._boardList.splice(i, 1);

              this._handleArrive(board, dm);
            } else {
              // 未到：沿方向推进
              Vec3.scaleAndAdd(this._tmp, board.worldPosition, this._direction, speedStep);
              board.setWorldPosition(this._tmp);
            }
          } // 没有触发塔攻击则不继续倒计时


          if (!dm.isTowerAttack) return;

          if (this._curBoardCount > 0) {
            var _dm$curReduceTemplate;

            this._elapsedTime += dt; // 取当前模板减时；默认 2

            var reduceTime = (_dm$curReduceTemplate = dm.curReduceTemplateTimeArr[dm.curReduceTemplateTimeIndex]) != null ? _dm$curReduceTemplate : 2;

            if (this._elapsedTime >= reduceTime) {
              var _this$denominatorLabe3, _this$denominatorLabe4;

              this._elapsedTime = 0;
              this._curBoardCount = Math.max(0, this._curBoardCount - 1);

              if (this.moleculeLabel) {
                this.moleculeLabel.string = "" + this._curBoardCount;
              } // 当分子==分母时收尾


              var denominatorNum = Number((_this$denominatorLabe3 = (_this$denominatorLabe4 = this.denominatorLabel) == null ? void 0 : _this$denominatorLabe4.string) != null ? _this$denominatorLabe3 : "0");

              if (this._curBoardCount === denominatorNum) {
                (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.isContinueFillFireWood = false;
              }
            }
          } else {
            this.moleculeLabel.color = new Color(255, 0, 0, 255);
            this.denominatorLabel.color = new Color(255, 0, 0, 255);
            this.line.color = new Color(255, 0, 0, 255);
            this._isOnceFire = true; // 重置为可再次触发一次

            if (this.fireNode) this.fireNode.active = false;
            dm.isTowerAttack = false; // 归零秒数并清理线圈

            this._curSecond = 0;
            this.cleanElectricCoil();
          }
        } // 清理电圈


        cleanElectricCoil() {
          var _this = this;

          if (!this._unlock) return;

          var _loop = function _loop() {
            var name = _this._plots[i];

            var plot = _this._unlock.children.find(item => {
              return item.name == name;
            });

            if (plot) {
              var elementCon = plot.getChildByName("ElementCon");
              if (!elementCon) return 0; // continue

              var node = elementCon.getChildByName("Node");
              if (!node) return 0; // continue

              var dtai = node.getChildByName("DTani");
              if (!dtai) return 0; // continue

              var dianhuan = dtai.getChildByName("TX_dianhuan");
              if (!dianhuan) return 0; // continue

              dianhuan.active = false;
              var dianqiu = dtai.getChildByName("TX_dianqiu");
              if (!dianqiu) return 0; // continue

              dianqiu.active = false;
            }
          },
              _ret;

          for (var i = 0; i < this._plots.length; i++) {
            _ret = _loop();
            if (_ret === 0) continue;
          }
        }

        denominatorUpgradeAni(minNum, maxNum, interval) {
          var _this2 = this;

          if (interval === void 0) {
            interval = 0.05;
          }

          var label = this.denominatorLabel;
          if (!label || !label.isValid) return;

          var _loop2 = function _loop2(i) {
            _this2.scheduleOnce(() => {
              label.string = String(i);
            }, (i - minNum) * interval);
          };

          for (var i = minNum; i <= maxNum; i++) {
            _loop2(i);
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "landmarkNode", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "fireNode", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "line", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "denominatorLabel", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "moleculeLabel", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "conveyorAni", [_dec7], {
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
//# sourceMappingURL=56f031f542a470eb0bc8ce763d028f9bc2c077d0.js.map