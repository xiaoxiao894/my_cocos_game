// StackSlot.ts
import { Vec3, Node as CocosNode } from 'cc';

export class StackSlot {
    public position: Vec3;
    public assignedNode: CocosNode | null = null;
    reservedNode: CocosNode;

    constructor(pos: Vec3) {
        this.position = pos;
    }

    get isOccupied(): boolean {
        return this.assignedNode !== null;
    }

    release() {
        this.assignedNode = null;
    }
}