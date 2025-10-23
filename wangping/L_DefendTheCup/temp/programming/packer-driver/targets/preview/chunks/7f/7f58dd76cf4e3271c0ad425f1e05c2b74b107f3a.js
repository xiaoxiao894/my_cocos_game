System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Animation, Color, Component, find, Graphics, Vec3, PartnerManager, _dec, _class, _crd, ccclass, property, UIPartnerEnergyBarManager;

  function _reportPossibleCrUseOfPartnerManager(extras) {
    _reporterNs.report("PartnerManager", "../Actor/PartnerManager", _context.meta, extras);
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
      Graphics = _cc.Graphics;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      PartnerManager = _unresolved_2.PartnerManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "1435blD01JHlrbEQKBf3JW/", "UIPartnerEnergyBarManager", undefined);

      __checkObsolete__(['_decorator', 'Animation', 'Color', 'Component', 'find', 'Graphics', 'Node', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("UIPartnerEnergyBarManager", UIPartnerEnergyBarManager = (_dec = ccclass('UIPartnerEnergyBarManager'), _dec(_class = class UIPartnerEnergyBarManager extends Component {
        constructor() {
          super(...arguments);
          this.radius = 25;
          // 更新时间
          this.duration = 12.0;
          this.progressBarGraphics = null;
          this.elapsed = 0;
          this._hasInit = false;
          this._hasPlayedSkillFinish = false;
        }

        start() {
          var camera = find("Main Camera");
          var cameraPos = camera.worldPosition;
          this.node.lookAt(cameraPos, Vec3.UP);
          var circleThree = this.node.getChildByName("Circle3");

          if (!circleThree) {
            console.warn("Circle3 节点未找到");
            return;
          }

          this.progressBarGraphics = circleThree.getComponent(Graphics) || circleThree.addComponent(Graphics);
          this.progressBarGraphics.fillColor = Color.fromHEX(new Color(), "#00FF00");
        }

        createGraphics(node, fillColor, strokeColor, radius) {
          var graphics = node.getComponent(Graphics) || node.addComponent(Graphics);
          graphics.fillColor = Color.fromHEX(new Color(), fillColor);
          graphics.strokeColor = Color.fromHEX(new Color(), strokeColor);
          graphics.circle(0, 0, radius);
          graphics.fill();
          graphics.stroke();
        }

        update(deltaTime) {
          this.updateUiFollow();
          var partnerParent = this.node.parent.getChildByName("PartnerParent");
          var partnerManager = this.node.parent.getComponent(_crd && PartnerManager === void 0 ? (_reportPossibleCrUseOfPartnerManager({
            error: Error()
          }), PartnerManager) : PartnerManager);
          var anim = partnerParent == null ? void 0 : partnerParent.getComponent(Animation);
          var skillState = anim == null ? void 0 : anim.getState("skillALL"); // skillALL 正在播放中，等待完成

          if (skillState != null && skillState.isPlaying) return; // 初次满圈立即释放技能

          if (!this._hasInit) {
            this._hasInit = true;
            this.drawFullCircle();
            this.playSkillAllAndRelease(partnerManager, anim);
            return;
          }

          this.elapsed += deltaTime;
          var progress = this.elapsed / this.duration;

          if (progress >= 1) {
            progress = 1;
            this.drawFullCircle();
            this.playSkillAllAndRelease(partnerManager, anim);
            return;
          } // 绘制冷却进度


          var startAngle = Math.PI / 2;
          var endAngle = startAngle + Math.PI * 2 * progress;
          this.progressBarGraphics.clear();
          this.progressBarGraphics.moveTo(0, 0);
          this.progressBarGraphics.arc(0, 0, this.radius, startAngle, endAngle, true);
          this.progressBarGraphics.lineTo(0, 0);
          this.progressBarGraphics.fill();
        }

        drawFullCircle() {
          this.progressBarGraphics.clear();
          this.progressBarGraphics.moveTo(0, 0);
          this.progressBarGraphics.arc(0, 0, this.radius, Math.PI / 2, Math.PI / 2 + Math.PI * 2, true);
          this.progressBarGraphics.lineTo(0, 0);
          this.progressBarGraphics.fill();
        }

        playSkillAllAndRelease(partnerManager, anim) {
          if (!partnerManager) return;
          partnerManager.isSkillAllPlaying = true;
          var skillState = anim == null ? void 0 : anim.getState("skillALL");

          if (anim && skillState) {
            // 防止重复绑定和重复播放
            anim.off(Animation.EventType.FINISHED);
            anim.stop();
            anim.play("skillALL");
            this._hasPlayedSkillFinish = false;
            anim.once(Animation.EventType.FINISHED, () => {
              if (this._hasPlayedSkillFinish) return;
              this._hasPlayedSkillFinish = true;
              partnerManager.releaseMajorSkills(); // 获取方向动画

              var direction = partnerManager.direction;
              var aniName = partnerManager.node.name.slice(0, -1);
              var clipName = "" + aniName + direction;
              var anim = partnerManager.getComponent(Animation);
              var dirState = anim == null ? void 0 : anim.getState(clipName); // console.log("=========> 播放方向动画", clipName);

              if (dirState) {
                dirState.stop();
                anim.play(clipName); // 第二段动画播放完成后恢复 idle

                anim.once(Animation.EventType.FINISHED, () => {
                  anim.play("idleB");
                  partnerManager.isSkillAllPlaying = false;
                  this.elapsed = 0;
                });
              } else {
                console.warn("\u274C \u672A\u627E\u5230\u65B9\u5411\u52A8\u753B " + clipName);
                anim.play("idleB");
                partnerManager.isSkillAllPlaying = false;
                this.elapsed = 0;
              }
            });
          } else {
            // 没有动画直接执行技能释放
            partnerManager.releaseMajorSkills();
            partnerManager.isSkillAllPlaying = false;
            this.elapsed = 0;
          }
        }

        updateUiFollow() {// 如果需要UI跟随，这里写逻辑
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=7f58dd76cf4e3271c0ad425f1e05c2b74b107f3a.js.map