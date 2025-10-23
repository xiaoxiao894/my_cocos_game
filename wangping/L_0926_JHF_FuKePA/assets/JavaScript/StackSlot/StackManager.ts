// StackManager.ts
import { Vec3, Node as CocosNode, Mat4 } from 'cc';
import { StackSlot } from './StackSlot';

export class StackManager {
    private slots: StackSlot[] = [];

    constructor(row: number, col: number, gapX: number, gapZ: number, gapY: number = 0.5, maxLayer: number = 100) {
        for (let layer = 0; layer < maxLayer; layer++) {
            for (let r = 0; r < row; r++) {
                for (let c = 0; c < col; c++) {
                    const pos = new Vec3(c * gapX, layer * gapY, r * gapZ);
                    this.slots.push(new StackSlot(pos));
                }
            }
        }
    }

    // ====== 你的原始逻辑：不改 ======
    assignSlot(node: CocosNode): StackSlot | null {
        const slot = this.slots.find(s => !s.isOccupied);
        if (!slot) return null;
        slot.assignedNode = node;
        return slot;
    }

    releaseSlot(node: CocosNode) {
        for (const slot of this.slots) {
            if (slot.assignedNode === node) {
                slot.release();
                break;
            }
        }
    }

    getLastOccupiedSlot(): StackSlot | null {
        let lastOccupiedSlot: StackSlot | null = null;
        for (let i = 0; i < this.slots.length; i++) {
            if (this.slots[i].isOccupied) lastOccupiedSlot = this.slots[i];
            else return lastOccupiedSlot;
        }
        return lastOccupiedSlot;
    }

    /**  更稳的世界坐标获取：包含位移/旋转/缩放/层级 */
    getSlotWorldPos(slot: StackSlot, parent: CocosNode): Vec3 {
        const out = new Vec3();
        const m = new Mat4();
        parent.getWorldMatrix(m);
        Vec3.transformMat4(out, slot.position, m); // 本地 -> 世界
        return out;
    }

    public getAllOccupiedSlots(): StackSlot[] {
        return this.slots.filter(s => s.assignedNode);
    }


    /** 按索引取槽位 */
    public getSlotByIndex(index: number): StackSlot | null {
        return (index >= 0 && index < this.slots.length) ? this.slots[index] : null;
    }

    /** 槽位转索引 */
    public indexOfSlot(slot: StackSlot): number {
        return this.slots.indexOf(slot);
    }

    /** 在 index 之前寻找最靠前的空洞位（返回索引；找不到返回 -1） */
    public findLowestVacantBefore(index: number): number {
        for (let i = 0; i < index; i++) {
            const s = this.slots[i];
            if (!s.isOccupied) return i;
        }
        return -1;
    }

    /**
     * 将 item 的占用从 fromIndex 移到 toIndex
     * 仅更新占用关系，不改变外部飞行动画逻辑
     */
    public moveAssignment(item: CocosNode, fromIndex: number, toIndex: number): boolean {
        const from = this.getSlotByIndex(fromIndex);
        const to = this.getSlotByIndex(toIndex);
        if (!from || !to) return false;
        if (from.assignedNode !== item) return false;
        if (to.isOccupied) return false;
        from.assignedNode = null;
        to.assignedNode = item;
        return true;
    }

    public clear() {
        for (const slot of this.slots) {
            slot.release();
        }
    }
}
