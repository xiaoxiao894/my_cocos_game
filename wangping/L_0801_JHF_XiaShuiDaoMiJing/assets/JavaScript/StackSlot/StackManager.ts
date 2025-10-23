// StackManager.ts
import { Vec3, Node as CocosNode, Quat, find } from 'cc';
import { StackSlot } from './StackSlot';
import { DataManager } from '../Global/DataManager';

export class StackManager {
    private slots: StackSlot[] = [];
    private _coinList = [];

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

        // 从第一个开始遍历，找到最后一个符合条件的槽位
        for (let i = 0; i < this.slots.length; i++) {
            if (this.slots[i].isOccupied) {
                lastOccupiedSlot = this.slots[i];  // 更新最后一个符合条件的槽位
            } else {
                return lastOccupiedSlot;
            }
        }


        // for (let i = this.slots.length - 1; i >= 0; i--) {
        //     if (this.slots[i].isOccupied) {
        //         return this.slots[i];
        //     }
        // }
        return null;
    }

    getSlotWorldPos(slot: StackSlot, parent: CocosNode): Vec3 {
        const rotated = new Vec3();
        Vec3.transformQuat(rotated, slot.position, parent.getWorldRotation());
        return parent.getWorldPosition().add(rotated);
    }

    public getAllOccupiedSlots(): StackSlot[] {
        if (DataManager.Instance.coinCon) {
            const childrenLength = DataManager.Instance.coinCon.children.length + 100;
            this._coinList = []

            label: for (let i = 0; i < this.slots.length; i++) {
                if (i < childrenLength) {
                    if (this.slots[i].assignedNode) {
                        this._coinList.push(this.slots[i]);
                    }
                } else {
                    break label;
                }
            }

            return this._coinList;
        } else {
            return this.slots.filter((s) => s.assignedNode);
        }
    }
}