// StackManager.ts
import { Vec3, Node as CocosNode, Quat } from 'cc';
import { StackSlot } from './StackSlot';
import { DataManager } from '../Global/DataManager';

export class StackManager {
    private slots: StackSlot[] = [];
    private _coinList: StackSlot[] = [];
    private _nextAvailableIndex: number = 0;
    private _nodeSlotMap: Map<CocosNode, StackSlot> = new Map();

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
        for (let i = this._nextAvailableIndex; i < this.slots.length; i++) {
            const slot = this.slots[i];
            if (!slot.isOccupied) {
                slot.assignedNode = node;
                this._nodeSlotMap.set(node, slot);
                this._nextAvailableIndex = i + 1;
                return slot;
            }
        }
        return null;
    }

    releaseSlot(node: CocosNode) {
        const slot = this._nodeSlotMap.get(node);
        if (slot) {
            slot.release();
            this._nodeSlotMap.delete(node);

            const index = this.slots.indexOf(slot);
            if (index >= 0 && index < this._nextAvailableIndex) {
                this._nextAvailableIndex = index;
            }
        }
    }

    getLastOccupiedSlot(): StackSlot | null {
        for (let i = this._nextAvailableIndex - 1; i >= 0; i--) {
            const slot = this.slots[i];
            if (slot.isOccupied) {
                return slot;
            }
        }
        return null;
    }

    getSlotWorldPos(slot: StackSlot, parent: CocosNode): Vec3 {
        const rotated = new Vec3();
        Vec3.transformQuat(rotated, slot.position, parent.getWorldRotation());
        return parent.getWorldPosition().add(rotated);
    }

    public getAllOccupiedSlots(): StackSlot[] {
        return Array.from(this._nodeSlotMap.values());
    }
}
