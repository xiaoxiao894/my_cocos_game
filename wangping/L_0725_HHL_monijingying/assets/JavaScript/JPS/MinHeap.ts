/**
 * 最小堆 (MinHeap)
 * 用于在寻路算法里高效取出 f 值最小的节点
 * 
 * 特点：
 * - 插入元素：O(log n)
 * - 取最小值：O(1)
 * - 删除最小值：O(log n)
 */
export default class MinHeap<T> {
    private heap: T[];                       // 堆存储数组
    private compare: (a: T, b: T) => number; // 比较函数，返回负数表示 a < b

    constructor(compareFn: (a: T, b: T) => number) {
        this.heap = [];
        this.compare = compareFn;
    }

    /** 当前堆的元素数量 */
    size(): number {
        return this.heap.length;
    }

    /** 判断堆是否为空 */
    isEmpty(): boolean {
        return this.heap.length === 0;
    }

    /** 查看堆顶（最小值），不移除 */
    peek(): T | undefined {
        return this.heap[0];
    }

    /**
     * 插入一个元素到堆
     */
    push(value: T): void {
        this.heap.push(value);            // 放到数组最后
        this.bubbleUp(this.heap.length - 1); // 往上调整，保持最小堆
    }

    // 返回整个数组
    retrunArr() {
        return this.heap;
    }

    /**
     * 弹出堆顶（最小值）
     */
    pop(): T | undefined {
        if (this.isEmpty()) return undefined;
        if (this.heap.length === 1) return this.heap.pop();

        const min = this.heap[0];                  // 取堆顶
        this.heap[0] = this.heap.pop() as T;       // 用最后一个元素填充堆顶
        this.bubbleDown(0);                        // 往下调整
        return min;
    }

    /**
     * 清空堆
     */
    clear(): void {
        this.heap = [];
    }

    /**
     * 上浮操作（插入时调用）
     * 从 index 开始，往上对比父节点，如果比父节点小就交换
     */
    private bubbleUp(index: number): void {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.compare(this.heap[index], this.heap[parentIndex]) < 0) {
                this.swap(index, parentIndex);
                index = parentIndex;
            } else {
                break;
            }
        }
    }

    /**
     * 下沉操作（删除时调用）
     * 从 index 开始，和左右子节点比较，把最小的交换上来
     */
    private bubbleDown(index: number): void {
        const length = this.heap.length;
        while (true) {
            let left = index * 2 + 1;
            let right = index * 2 + 2;
            let smallest = index;

            if (left < length && this.compare(this.heap[left], this.heap[smallest]) < 0) {
                smallest = left;
            }

            if (right < length && this.compare(this.heap[right], this.heap[smallest]) < 0) {
                smallest = right;
            }

            if (smallest !== index) {
                this.swap(index, smallest);
                index = smallest;
            } else {
                break;
            }
        }
    }

    /** 交换堆中两个元素 */
    private swap(i: number, j: number): void {
        const temp = this.heap[i];
        this.heap[i] = this.heap[j];
        this.heap[j] = temp;
    }
}
