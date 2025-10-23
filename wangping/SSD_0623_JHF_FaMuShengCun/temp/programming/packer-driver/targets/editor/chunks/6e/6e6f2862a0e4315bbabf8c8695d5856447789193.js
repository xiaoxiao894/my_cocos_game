System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, find, instantiate, Node, Quat, UIOpacity, Vec3, DataManager, EntityTypeEnum, TypeItemEnum, _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _crd, ccclass, property, ArrowManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfDataManager(extras) {
    _reporterNs.report("DataManager", "../Global/DataManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEntityTypeEnum(extras) {
    _reporterNs.report("EntityTypeEnum", "../Enum/Index", _context.meta, extras);
  }

  function _reportPossibleCrUseOfTypeItemEnum(extras) {
    _reporterNs.report("TypeItemEnum", "../Enum/Index", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      find = _cc.find;
      instantiate = _cc.instantiate;
      Node = _cc.Node;
      Quat = _cc.Quat;
      UIOpacity = _cc.UIOpacity;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      DataManager = _unresolved_2.DataManager;
    }, function (_unresolved_3) {
      EntityTypeEnum = _unresolved_3.EntityTypeEnum;
      TypeItemEnum = _unresolved_3.TypeItemEnum;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "4412ddMw4VA8oeb0clrunSA", "ArrowManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'find', 'instantiate', 'Node', 'Quat', 'UIOpacity', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("ArrowManager", ArrowManager = (_dec = ccclass('ArrowManager'), _dec2 = property(Node), _dec3 = property(Node), _dec4 = property({
        tooltip: '脚下遮罩半径（米），半径内不显示箭头'
      }), _dec5 = property({
        tooltip: '遮罩羽化长度（米），0 表示硬边'
      }), _dec(_class = (_class2 = class ArrowManager extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "arrowNode", _descriptor, this);

          _initializerDefineProperty(this, "target", _descriptor2, this);

          _initializerDefineProperty(this, "spacing", _descriptor3, this);

          _initializerDefineProperty(this, "flowSpeed", _descriptor4, this);

          _initializerDefineProperty(this, "arrowHeight", _descriptor5, this);

          // 箭头Y高度
          // —— 脚下遮罩 ——
          // 半径（米）：半径内不显示任何箭头
          _initializerDefineProperty(this, "maskRadius", _descriptor6, this);

          // 羽化长度（米）：0=硬边；>0 时在 [maskRadius, maskRadius+maskFeather] 线性由 0→1
          _initializerDefineProperty(this, "maskFeather", _descriptor7, this);

          this.arrowNodes = [];
          this._plot1 = null;
          this._plot7 = null;
          this._coinCon = null;
          // 解锁帮手地块
          this._unlockHelper = true;
          // 玩家进入同一区域后隐藏箭头的半径
          this.hideRadius = 3;
          // 是否启用“进入同一区域就隐藏箭头”
          this.hideWhileInside = true;
          // 记录上一次指向的目标（用于识别是否刚刚切换目标）
          this._lastArrowTarget = null;
          //
          this._pathStart = new Vec3();
          this._pathEnd = new Vec3();
          this._pathDir = new Vec3(1, 0, 0);
          this._pathLen = 0;
          this._flowOffset = 0;
          // 循环
          this._flowEnabled = false;
        }

        start() {
          // 临时
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.arrowTargetNode = this; // 交付木头

          this._plot1 = find('THREE3DNODE/Unlock/Plot1'); // 收集金币

          this._plot7 = find('THREE3DNODE/Unlock/Plot7'); // 场地金币

          this._coinCon = find('THREE3DNODE/PlacingCon/SceneCoinCon');
        }

        update(deltaTime) {
          // 先推进已有路径的箭头流动
          this._tickArrowFlow(deltaTime);

          if (!(_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.arrowTargetNode && !(_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.player && !(_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.guideTargetList) return;

          if ((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.cameraGuiding) {
            var _Instance$arrow3DMana;

            this.setArrowCount(0);
            this._flowEnabled = false; // 停止流动

            ((_Instance$arrow3DMana = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.arrow3DManager) == null ? void 0 : _Instance$arrow3DMana.node) && ((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.arrow3DManager.node.active = false);
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.currentArrowPointing = null;
            this._lastArrowTarget = null;
            return;
          }

          const guideList = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.guideTargetList;
          const inGuide = !!(guideList && guideList.length > 0 && (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.isEnterPromptArea);

          if (inGuide) {
            var _this$_coinCon$childr, _this$_coinCon, _coinTransitionCon$ch;

            const targetData = guideList.find(item => item.isDisplay);
            const coinTransitionCon = find('THREE3DNODE/CoinTransitionCon');
            const coinBackpack = this.searchBackpackItem((_crd && TypeItemEnum === void 0 ? (_reportPossibleCrUseOfTypeItemEnum({
              error: Error()
            }), TypeItemEnum) : TypeItemEnum).Coin);
            const woodBackpack = this.searchBackpackItem((_crd && TypeItemEnum === void 0 ? (_reportPossibleCrUseOfTypeItemEnum({
              error: Error()
            }), TypeItemEnum) : TypeItemEnum).Wood); // —— 分支一：指向解锁点（targetData.plot）——

            if (targetData && coinBackpack && coinBackpack.children.length >= targetData.initCoinNum / 2 || targetData && coinBackpack && coinBackpack.children.length >= targetData.coinNum) {
              const unlock = find('THREE3DNODE/Unlock');
              const node = unlock == null ? void 0 : unlock.children.find(item => item.name == targetData.plot);

              if (node) {
                if (this.shouldHideForTarget(node,
                /*isTree*/
                false)) {
                  this.hideArrow();
                  (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                    error: Error()
                  }), DataManager) : DataManager).Instance.currentArrowPointing = node;
                  this._lastArrowTarget = node;
                  return;
                } // 显示箭头


                (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.arrow3DManager.node.active = true;
                this.createArrowPathTo(node.worldPosition);
                (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.arrow3DManager.playFloatingEffect(deltaTime, node.worldPosition, true);
                (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.currentArrowPointing = node;
                this._lastArrowTarget = node;
                return;
              }
            } // —— 分支二：满足金币条件则指向 plot7 —— 
            else if (((_this$_coinCon$childr = (_this$_coinCon = this._coinCon) == null ? void 0 : _this$_coinCon.children.length) != null ? _this$_coinCon$childr : 0) + ((_coinTransitionCon$ch = coinTransitionCon == null ? void 0 : coinTransitionCon.children.length) != null ? _coinTransitionCon$ch : 0) > 0 // (
            //     coinTransitionCon &&
            //     targetData &&
            //     (targetData.coinNum <= ((coinBackpack?.children.length ?? 0) + (this._coinCon?.children.length ?? 0) + (coinTransitionCon?.children.length ?? 0)))
            // ) || (
            //     coinTransitionCon && !DataManager.Instance.isUnlockHelper &&
            //     targetData && (1 <= ((coinBackpack?.children.length ?? 0) + (this._coinCon?.children.length ?? 0) + (coinTransitionCon?.children.length ?? 0)))
            // )
            ) {
              (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.onlyGuidanceOnce = false;

              if (this._plot7) {
                // if (this.shouldHideForTarget(this._plot7, /*isTree*/ false)) {
                //     // this.hideArrow();
                //     DataManager.Instance.currentArrowPointing = this._plot7;
                //     this._lastArrowTarget = this._plot7;
                //     return;
                // }
                (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.arrow3DManager.node.active = true;
                this.createArrowPathTo(this._plot7.worldPosition);
                let worldPos = new Vec3(this._plot7.worldPosition.x, this._plot7.worldPosition.y, this._plot7.worldPosition.z - 1);
                (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.arrow3DManager.playFloatingEffect(deltaTime, worldPos, true);
                (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.currentArrowPointing = this._plot7;
                this._lastArrowTarget = this._plot7;
                return;
              }
            } // —— 分支三：仅场地或背包金币满足，指向 plot7 —— 
            else if (targetData && this._coinCon && targetData.coinNum < this._coinCon.children.length) {
              if (this._plot7) {
                if (this.shouldHideForTarget(this._plot7,
                /*isTree*/
                false)) {
                  this.hideArrow();
                  (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                    error: Error()
                  }), DataManager) : DataManager).Instance.currentArrowPointing = this._plot7;
                  this._lastArrowTarget = this._plot7;
                  return;
                }

                (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.arrow3DManager.node.active = true;
                this.createArrowPathTo(this._plot7.worldPosition);
                (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.arrow3DManager.playFloatingEffect(deltaTime, this._plot7.worldPosition, true);
                (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.currentArrowPointing = this._plot7;
                this._lastArrowTarget = this._plot7;
                return;
              }
            } // —— 分支四：木材满载则指向 plot1 —— 
            else if (woodBackpack && woodBackpack.children.length >= 10) {
              if (this._plot1) {
                if (this.shouldHideForTarget(this._plot1,
                /*isTree*/
                false)) {
                  this.hideArrow();
                  (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                    error: Error()
                  }), DataManager) : DataManager).Instance.currentArrowPointing = this._plot1;
                  this._lastArrowTarget = this._plot1;
                  return;
                }

                (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.arrow3DManager.node.active = true;
                this.createArrowPathTo(this._plot1.worldPosition);
                (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.arrow3DManager.playFloatingEffect(deltaTime, this._plot1.worldPosition, true);
                (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.currentArrowPointing = this._plot1;
                this._lastArrowTarget = this._plot1;
                return;
              }
            } // —— 分支五：去砍树（回退，找树永不隐藏箭头）——


            {
              var _Instance$player;

              const playerNode = (_Instance$player = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.player) == null ? void 0 : _Instance$player.node;
              const nearestTree = playerNode ? this.getNearTree(playerNode) : null;

              if (nearestTree && nearestTree.worldPosition && (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.unlockPowerTowersNum < 2 && !(_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.isUnlockHelper) {
                // 找树不隐藏：无论是否在区域内都显示
                this.createArrowPathTo(nearestTree.worldPosition);
                (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.arrow3DManager.node.active = true;
                (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.arrow3DManager.playFloatingEffect(deltaTime, nearestTree.worldPosition, false);
                (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.currentArrowPointing = nearestTree;
                this._lastArrowTarget = nearestTree;
                this.conditionalJudgment();
                return;
              } else {
                this.setArrowCount(0);
                this._flowEnabled = false; // 停止流动

                (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.arrow3DManager.node.active = false;
                (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.currentArrowPointing = null;
                this._lastArrowTarget = null;
                return;
              }
            }
          } else {
            this.setArrowCount(0);
            this._flowEnabled = false; // 停止流动

            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.arrow3DManager.node.active = false;
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.currentArrowPointing = null;
            this._lastArrowTarget = null;
          }
        }

        shouldHideForTarget(target, isTree) {
          if (isTree) return false; // 找树不隐藏

          if (!this.hideWhileInside) return false;
          const targetChanged = target !== this._lastArrowTarget;
          if (targetChanged) return false;
          return this.isPlayerInsideTarget(target);
        }

        isPlayerInsideTarget(target) {
          var _Instance$player2;

          const player = (_Instance$player2 = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.player) == null ? void 0 : _Instance$player2.node;
          if (!this.hideWhileInside || !player || !target || !target.isValid) return false;
          return Vec3.distance(player.worldPosition, target.worldPosition) <= this.hideRadius;
        }

        hideArrow() {
          var _Instance$arrow3DMana2;

          this._flowEnabled = false; // 停止流动

          this.setArrowCount(0);

          if ((_Instance$arrow3DMana2 = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.arrow3DManager) != null && _Instance$arrow3DMana2.node) {
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.arrow3DManager.node.active = false;
          }
        } // 查找背包物品


        searchBackpackItem(typeItem) {
          const playerNode = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.player.node;
          const backpack1 = playerNode.getChildByName('Backpack1');
          const backpack2 = playerNode.getChildByName('Backpack2');
          const backpack3 = playerNode.getChildByName('Backpack3');
          const backpacks = [backpack1, backpack2, backpack3].filter(Boolean);

          let sourceBackpack = this._findBackpackWithItem(backpacks, typeItem);

          return sourceBackpack;
        }

        _findBackpackWithItem(backpacks, typeItem) {
          for (const bag of backpacks) {
            if (bag.children.some(child => child.name.includes(typeItem))) {
              return bag;
            }
          }

          return null;
        } // 条件判断


        conditionalJudgment() {
          const player = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.player.node;

          if ((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.guideTargetIndex == -1) {
            const backpack1 = player.getChildByName('Backpack1');

            if (backpack1 && backpack1.children.length >= 5) {
              (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.guideTargetIndex++;
            }
          }
        }
        /** 记录新路径、生成/排布箭头，并启动实时跟随 */


        createArrowPathTo(targetPos) {
          var _Instance$player3;

          const player = (_Instance$player3 = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.player) == null ? void 0 : _Instance$player3.node;
          if (!player) return;
          player.getWorldPosition(this._pathStart);

          this._pathEnd.set(targetPos);

          Vec3.subtract(this._pathDir, this._pathEnd, this._pathStart);
          this._pathLen = this._pathDir.length();

          if (this._pathLen < 0.01) {
            this.setArrowCount(0);
            this._flowEnabled = false;
            return;
          }

          this._pathDir.normalize(); // 固定间距推算数量


          const spacing = Math.max(0.05, this.spacing || 0.5);
          const totalCount = Math.max(2, Math.floor(this._pathLen / spacing) + 1); // 不重置 _flowOffset（保持连续流动）

          this.setArrowCount(totalCount); // 首帧排一次

          this._layoutArrows();

          this._flowEnabled = true;
        }

        setArrowCount(targetCount) {
          const prefab = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.prefabMap.get((_crd && EntityTypeEnum === void 0 ? (_reportPossibleCrUseOfEntityTypeEnum({
            error: Error()
          }), EntityTypeEnum) : EntityTypeEnum).PathArrow);
          if (!prefab) return; // 只在尾部增/删，已有索引不变 -> 不重排

          while (this.arrowNodes.length < targetCount) {
            const arrow = instantiate(prefab);
            arrow.setParent(this.node);
            this.arrowNodes.push(arrow);
          }

          while (this.arrowNodes.length > targetCount) {
            const arrow = this.arrowNodes.pop();
            arrow.destroy();
          }
        }

        _tickArrowFlow(dt) {
          var _Instance$player4;

          if (!this._flowEnabled || this.arrowNodes.length === 0) return;
          const spacing = Math.max(0.05, this.spacing || 0.5);
          const speed = Math.max(0.001, this.flowSpeed);
          this._flowOffset += speed * dt;
          this._flowOffset = (this._flowOffset % spacing + spacing) % spacing; // 起点实时跟随人物脚下

          const player = (_Instance$player4 = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.player) == null ? void 0 : _Instance$player4.node;
          if (!player) return;
          player.getWorldPosition(this._pathStart); // 重算方向与长度

          Vec3.subtract(this._pathDir, this._pathEnd, this._pathStart);
          this._pathLen = this._pathDir.length();

          if (this._pathLen < 0.01) {
            this.setArrowCount(0);
            return;
          }

          this._pathDir.normalize(); // 根据最新长度按固定间距更新尾部数量


          const needCount = Math.max(2, Math.floor(this._pathLen / spacing) + 1);

          if (needCount !== this.arrowNodes.length) {
            this.setArrowCount(needCount);
          }

          this._layoutArrows();
        }

        _layoutArrows() {
          const rot = new Quat();
          Quat.fromViewUp(rot, this._pathDir, Vec3.UP);
          const count = this.arrowNodes.length;
          if (count <= 0 || this._pathLen < 0.0001) return;
          const spacing = Math.max(0.05, this.spacing || 0.5);
          const fadeInRange = spacing * 1.0;
          const fadeOutRange = spacing * 1.2;
          const NEWBORN_KEY = '__arrow_newborn__';
          const base = new Vec3();
          const pos = new Vec3();
          const distInfos = [];

          for (let i = 0; i < count; i++) {
            // let dist = (i === 0) ? 0 : (i - 1) * spacing + this._flowOffset;
            let dist = i * spacing + this._flowOffset;
            if (dist >= this._pathLen) dist = dist % this._pathLen;else if (dist < 0) dist = (dist % this._pathLen + this._pathLen) % this._pathLen;
            Vec3.multiplyScalar(base, this._pathDir, dist);
            Vec3.add(pos, this._pathStart, base);
            pos.y = this.arrowHeight;
            const arrow = this.arrowNodes[i];
            arrow.setWorldPosition(pos);
            arrow.setWorldRotation(rot);
            const ui = arrow.getComponent(UIOpacity) || arrow.addComponent(UIOpacity);
            const isNewborn = !!arrow[NEWBORN_KEY];

            if (isNewborn) {
              if (dist <= fadeInRange) {
                const tIn = Math.max(0, Math.min(1, dist / fadeInRange));
                ui.opacity = Math.floor(255 * tIn);

                if (tIn >= 1) {
                  // 走出淡入区后
                  delete arrow[NEWBORN_KEY];
                }
              } else {
                ui.opacity = 0; // 还没到脚下，保持不可见
              }

              continue;
            }

            let alpha = 255;

            if (i !== 0 && dist <= fadeInRange) {
              const tIn = Math.max(0, Math.min(1, dist / fadeInRange));
              alpha = Math.min(alpha, Math.floor(255 * tIn));
            }

            const dToEnd = this._pathLen - dist;

            if (dToEnd <= fadeOutRange) {
              const tOut = Math.max(0, Math.min(1, dToEnd / fadeOutRange));
              alpha = Math.min(alpha, Math.floor(255 * tOut));
            }

            distInfos.push({
              i,
              dToEnd
            });
            ui.opacity = alpha;
          }

          for (let i = 0; i < count; i++) {
            const arrow = this.arrowNodes[i];
            const ui = arrow.getComponent(UIOpacity) || arrow.addComponent(UIOpacity);
            ui.opacity = 255;
          }

          distInfos.sort((a, b) => a.dToEnd - b.dToEnd);
          const last3 = distInfos.slice(0, Math.min(3, distInfos.length));
          const fades = [80, 140, 200];

          for (let k = 0; k < last3.length; k++) {
            const idx = last3[k].i;
            const arrow = this.arrowNodes[idx];
            const ui = arrow.getComponent(UIOpacity) || arrow.addComponent(UIOpacity);
            ui.opacity = fades[k];
          }
        } // 动态获取离主角最近的树


        getNearTree(player) {
          if ((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.treeMatrix.length <= 0) return null;
          const treeMRow = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.treeMatrix.length;
          const treeMCol = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.treeMatrix[0].length;

          for (let c = treeMCol - 1; c >= 0; c--) {
            for (let r = 0; r < treeMRow; r++) {
              const treeNode = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.treeMatrix[r][c];

              if (treeNode) {
                return treeNode;
              }
            }
          }

          return null;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "arrowNode", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "target", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "spacing", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.5;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "flowSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 4;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "arrowHeight", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.2;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "maskRadius", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.8;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "maskFeather", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.0;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=6e6f2862a0e4315bbabf8c8695d5856447789193.js.map