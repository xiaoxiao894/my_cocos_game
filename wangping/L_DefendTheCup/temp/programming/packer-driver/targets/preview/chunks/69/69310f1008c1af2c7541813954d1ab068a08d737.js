System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7", "__unresolved_8"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Animation, Button, Component, director, EventHandler, instantiate, Label, Node, Prefab, tween, UIOpacity, Vec3, DataManager, CollisionEntityEnum, EntityTypeEnum, MathUtil, ItemAreaManager, PartnerManager, Actor, StateDefine, LanguageManager, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, CardConManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfDataManager(extras) {
    _reporterNs.report("DataManager", "../Global/DataManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCollisionEntityEnum(extras) {
    _reporterNs.report("CollisionEntityEnum", "../Enum/Index", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEntityTypeEnum(extras) {
    _reporterNs.report("EntityTypeEnum", "../Enum/Index", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMathUtil(extras) {
    _reporterNs.report("MathUtil", "../Util/MathUtil", _context.meta, extras);
  }

  function _reportPossibleCrUseOfItemAreaManager(extras) {
    _reporterNs.report("ItemAreaManager", "../Area/ItemAreaManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPartnerManager(extras) {
    _reporterNs.report("PartnerManager", "../Actor/PartnerManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfActor(extras) {
    _reporterNs.report("Actor", "../Actor/Actor", _context.meta, extras);
  }

  function _reportPossibleCrUseOfStateDefine(extras) {
    _reporterNs.report("StateDefine", "../Actor/StateDefine", _context.meta, extras);
  }

  function _reportPossibleCrUseOfLanguageManager(extras) {
    _reporterNs.report("LanguageManager", "../Language/LanguageManager", _context.meta, extras);
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
      Button = _cc.Button;
      Component = _cc.Component;
      director = _cc.director;
      EventHandler = _cc.EventHandler;
      instantiate = _cc.instantiate;
      Label = _cc.Label;
      Node = _cc.Node;
      Prefab = _cc.Prefab;
      tween = _cc.tween;
      UIOpacity = _cc.UIOpacity;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      DataManager = _unresolved_2.DataManager;
    }, function (_unresolved_3) {
      CollisionEntityEnum = _unresolved_3.CollisionEntityEnum;
      EntityTypeEnum = _unresolved_3.EntityTypeEnum;
    }, function (_unresolved_4) {
      MathUtil = _unresolved_4.MathUtil;
    }, function (_unresolved_5) {
      ItemAreaManager = _unresolved_5.ItemAreaManager;
    }, function (_unresolved_6) {
      PartnerManager = _unresolved_6.PartnerManager;
    }, function (_unresolved_7) {
      Actor = _unresolved_7.Actor;
    }, function (_unresolved_8) {
      StateDefine = _unresolved_8.StateDefine;
    }, function (_unresolved_9) {
      LanguageManager = _unresolved_9.LanguageManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "4cc32RIWipFr7J9tX8nrce8", "CardConManager", undefined);

      __checkObsolete__(['_decorator', 'Animation', 'Button', 'Component', 'director', 'EventHandler', 'instantiate', 'Label', 'Node', 'Prefab', 'Sprite', 'tween', 'UIOpacity', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("CardConManager", CardConManager = (_dec = ccclass('CardConManager'), _dec2 = property(Node), _dec3 = property(Prefab), _dec(_class = (_class2 = class CardConManager extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "maskBg", _descriptor, this);

          _initializerDefineProperty(this, "bornEffect", _descriptor2, this);

          this.otherNode = null;
          this.opacity = null;
          this._isCreatingCards = false;
          this.isUnlockDeliveryAreas6 = true;
          this.maskBgOpacity = null;
        }

        start() {
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.cardConManager = this;
          this.opacity = this.node.getComponent(UIOpacity) || this.node.addComponent(UIOpacity);
          this.maskBgOpacity = this.maskBg.getComponent(UIOpacity) || this.maskBg.addComponent(UIOpacity);
          this.maskBg.active = false;
        } // 生成两张卡片


        createCards(otherNode) {
          if (this._isCreatingCards) return;
          this._isCreatingCards = true;
          if (this.node.children.length > 0) this.node.removeAllChildren();
          var actor = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.player.node.getComponent(_crd && Actor === void 0 ? (_reportPossibleCrUseOfActor({
            error: Error()
          }), Actor) : Actor);
          actor.changState((_crd && StateDefine === void 0 ? (_reportPossibleCrUseOfStateDefine({
            error: Error()
          }), StateDefine) : StateDefine).Idle);
          actor.stopMove();
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.isDeactivateVirtualJoystick = true;
          this.node.active = true;
          this.otherNode = otherNode; // 显示并渐显遮罩背景

          this.maskBg.active = true;
          this.maskBgOpacity.opacity = 0;
          tween(this.maskBgOpacity).to(1, {
            opacity: 120
          }, {
            easing: 'quadOut'
          }).start();
          var results = (_crd && MathUtil === void 0 ? (_reportPossibleCrUseOfMathUtil({
            error: Error()
          }), MathUtil) : MathUtil).staticgetTwoDistinctRandom((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.cardDatas);
          if (!results) return;
          results.forEach((cardData, index) => {
            this.scheduleOnce(() => {
              var _Instance$soundManage;

              var cardPrefab = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.prefabMap.get(cardData.card);

              if (!cardPrefab) {
                console.warn('未找到卡片预制体:', cardData.card);
                return;
              }

              var cardNode = instantiate(cardPrefab);
              cardNode.setParent(this.node); // 设置位置（左右分布）

              cardNode.setPosition(index === 0 ? -140 : 140, 0, 0); // 添加点击事件

              this.addCardClickEvent(cardNode, cardData);
              var card = cardNode.children[0];
              var labelCom = card.getChildByName("Label").getComponent(Label);

              if ((labelCom == null ? void 0 : labelCom.string) == "Stagbeetle") {
                var text = (_crd && LanguageManager === void 0 ? (_reportPossibleCrUseOfLanguageManager({
                  error: Error()
                }), LanguageManager) : LanguageManager).t('Stagbeetle');

                if (text) {
                  labelCom.string = text;
                }
              } else if ((labelCom == null ? void 0 : labelCom.string) == "Beetle") {
                var _text = (_crd && LanguageManager === void 0 ? (_reportPossibleCrUseOfLanguageManager({
                  error: Error()
                }), LanguageManager) : LanguageManager).t('Beetle');

                if (_text) {
                  labelCom.string = _text;
                }
              } else if ((labelCom == null ? void 0 : labelCom.string) == "Beetlewarrior") {
                var _text2 = (_crd && LanguageManager === void 0 ? (_reportPossibleCrUseOfLanguageManager({
                  error: Error()
                }), LanguageManager) : LanguageManager).t('Beetlewarrior');

                if (_text2) {
                  labelCom.string = _text2;
                }
              }

              var ani = card.getComponent(Animation);

              if (ani) {
                ani.play("cardCS");
              }

              var effect = card.getChildByName("Effect");

              if (effect) {
                var sprite = effect.getChildByName("Sprite");

                if (sprite) {
                  var spriteAni = sprite.getComponent(Animation);

                  if (spriteAni) {
                    spriteAni.play("Effect");
                    spriteAni.once(Animation.EventType.FINISHED, () => {
                      sprite.active = false;
                    });
                  }
                }
              }

              (_Instance$soundManage = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.soundManager) == null || _Instance$soundManage.CardEjectSoundPlay();
            }, index * 0.5);
          });
        }

        addCardClickEvent(node, cardData) {
          var button = node.getComponent(Button) || node.addComponent(Button);
          var handler = new EventHandler();
          handler.target = this.node;
          handler.component = "CardConManager";
          handler.handler = 'onCardClick';
          handler.customEventData = JSON.stringify(cardData);
          button.clickEvents = [handler];
        } // 点击处理函数


        onCardClick(event, customData) {
          customData = JSON.parse(customData); // const cardIndex = DataManager.Instance.cardDatas.findIndex(item => {
          //     return item.card == customData.card;
          // })

          var target = event.target;
          target["__isClick"] = true; // if (cardIndex < 0) return;
          // DataManager.Instance.cardDatas.splice(cardIndex, 1);

          for (var i = 0; i < this.node.children.length; i++) {
            var cardCon = this.node.children[i];
            var card = cardCon.children[0];
            var ani = card.getComponent(Animation);

            if (ani) {
              if (cardCon["__isClick"]) {
                ani.play("cardXS");
              } else {
                ani.play("cardXS02");
              }
            }
          }

          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.soundManager.ClickCardSoundPlay();
          this.scheduleOnce(() => {
            this.addPartner(customData.partner);
            this._isCreatingCards = false;
          }, 1);
        } // 添加伙伴


        addPartner(name) {
          this.node.active = false;
          tween(this.maskBgOpacity).to(1, {
            opacity: 0
          }, {
            easing: 'quadIn'
          }).call(() => {
            this.maskBg.active = false;
          }).start();
          var prefab = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.prefabMap.get(name);
          var partner = instantiate(prefab);
          var partnerManager = partner.getComponent(_crd && PartnerManager === void 0 ? (_reportPossibleCrUseOfPartnerManager({
            error: Error()
          }), PartnerManager) : PartnerManager) || partner.addComponent(_crd && PartnerManager === void 0 ? (_reportPossibleCrUseOfPartnerManager({
            error: Error()
          }), PartnerManager) : PartnerManager);
          partnerManager.init();
          partner.setParent(this.otherNode);
          var worldPos = partner.worldPosition;
          var effectPrafab = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.prefabMap.get((_crd && EntityTypeEnum === void 0 ? (_reportPossibleCrUseOfEntityTypeEnum({
            error: Error()
          }), EntityTypeEnum) : EntityTypeEnum).TX_shengjiLZ);
          var skillExplosion = instantiate(effectPrafab);
          director.getScene().addChild(skillExplosion);
          skillExplosion.setWorldPosition(new Vec3(worldPos.x, worldPos.y + 1.5, worldPos.z));
          var anim = skillExplosion == null ? void 0 : skillExplosion.getComponent(Animation);

          if (anim) {
            anim.play("TX_shengjiLZ");
            anim.once(Animation.EventType.FINISHED, () => {
              skillExplosion.destroy();
            });
          } else {
            // 没动画时，延迟回收
            this.scheduleOnce(() => {
              skillExplosion.destroy();
            }, 1);
          } // 解锁地块6


          if (this.isUnlockDeliveryAreas6) {
            this.isUnlockDeliveryAreas6 = false;
            var deliveryAreas6 = this.otherNode.parent.getChildByName((_crd && CollisionEntityEnum === void 0 ? (_reportPossibleCrUseOfCollisionEntityEnum({
              error: Error()
            }), CollisionEntityEnum) : CollisionEntityEnum).DeliveryAreas6);

            if (deliveryAreas6) {
              var itemAreaManager = deliveryAreas6.getComponent(_crd && ItemAreaManager === void 0 ? (_reportPossibleCrUseOfItemAreaManager({
                error: Error()
              }), ItemAreaManager) : ItemAreaManager);
              itemAreaManager == null || itemAreaManager.displayAni();
            }
          }

          if (this.node.children.length > 0) this.node.removeAllChildren();
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.isDeactivateVirtualJoystick = false;
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.soundManager.CreatePartnerSoundPlay();
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "maskBg", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "bornEffect", [_dec3], {
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
//# sourceMappingURL=69310f1008c1af2c7541813954d1ab068a08d737.js.map