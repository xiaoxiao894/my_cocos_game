System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, Vec3, Mat4, StackSlot, StackManager, _crd;

  function _reportPossibleCrUseOfStackSlot(extras) {
    _reporterNs.report("StackSlot", "./StackSlot", _context.meta, extras);
  }

  _export("StackManager", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      Vec3 = _cc.Vec3;
      Mat4 = _cc.Mat4;
    }, function (_unresolved_2) {
      StackSlot = _unresolved_2.StackSlot;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "d02a0ps8GhKyLPYN/yhFydu", "StackManager", undefined); // StackManager.ts


      __checkObsolete__(['Vec3', 'Node', 'Mat4']);

      _export("StackManager", StackManager = class StackManager {
        constructor(row, col, gapX, gapZ, gapY, maxLayer) {
          if (gapY === void 0) {
            gapY = 0.5;
          }

          if (maxLayer === void 0) {
            maxLayer = 100;
          }

          this.slots = [];

          for (var layer = 0; layer < maxLayer; layer++) {
            for (var r = 0; r < row; r++) {
              for (var c = 0; c < col; c++) {
                var pos = new Vec3(c * gapX, layer * gapY, r * gapZ);
                this.slots.push(new (_crd && StackSlot === void 0 ? (_reportPossibleCrUseOfStackSlot({
                  error: Error()
                }), StackSlot) : StackSlot)(pos));
              }
            }
          }
        } // ====== 你的原始逻辑：不改 ======


        assignSlot(node) {
          var slot = this.slots.find(s => !s.isOccupied);
          if (!slot) return null;
          slot.assignedNode = node;
          return slot;
        }

        releaseSlot(node) {
          for (var slot of this.slots) {
            if (slot.assignedNode === node) {
              slot.release();
              break;
            }
          }
        }

        getLastOccupiedSlot() {
          var lastOccupiedSlot = null;

          for (var i = 0; i < this.slots.length; i++) {
            if (this.slots[i].isOccupied) lastOccupiedSlot = this.slots[i];else return lastOccupiedSlot;
          }

          return lastOccupiedSlot;
        }
        /**  更稳的世界坐标获取：包含位移/旋转/缩放/层级 */


        getSlotWorldPos(slot, parent) {
          var out = new Vec3();
          var m = new Mat4();
          parent.getWorldMatrix(m);
          Vec3.transformMat4(out, slot.position, m); // 本地 -> 世界

          return out;
        }

        getAllOccupiedSlots() {
          return this.slots.filter(s => s.assignedNode);
        }
        /** 按索引取槽位 */


        getSlotByIndex(index) {
          return index >= 0 && index < this.slots.length ? this.slots[index] : null;
        }
        /** 槽位转索引 */


        indexOfSlot(slot) {
          return this.slots.indexOf(slot);
        }
        /** 在 index 之前寻找最靠前的空洞位（返回索引；找不到返回 -1） */


        findLowestVacantBefore(index) {
          for (var i = 0; i < index; i++) {
            var s = this.slots[i];
            if (!s.isOccupied) return i;
          }

          return -1;
        }
        /**
         * 将 item 的占用从 fromIndex 移到 toIndex
         * 仅更新占用关系，不改变外部飞行动画逻辑
         */


        moveAssignment(item, fromIndex, toIndex) {
          var from = this.getSlotByIndex(fromIndex);
          var to = this.getSlotByIndex(toIndex);
          if (!from || !to) return false;
          if (from.assignedNode !== item) return false;
          if (to.isOccupied) return false;
          from.assignedNode = null;
          to.assignedNode = item;
          return true;
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=0317a63f09c3b59c5e55400d86c5f2ee6ef1f2fb.js.map