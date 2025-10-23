// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


import JPSCheckTag from "./JPSCheckTag";
import JPSNode from "./JPSNode";
import MinHeap from "./MinHeap";
import { addCorde, Corde, makeCorde, makeCordeV2 } from "./Corde";

export default class JPS<T extends JPSNode<DATA, TAG>, DATA, TAG> {

	private static Cost90 = 10;//垂直关系的代价
	private static Cost45 = 14;//斜角关系的代价
	//开放列表
	private openSet: MinHeap<T>;
	private openMap: Set<number>;  // 只存 myIndex
	//关闭列表
	private closeSet: Set<Number>;
	//有改变的点
	private changeSet: Set<number>;

	private startPoint: T;
	private endPoint: T;

	private allPoint: Array<T>;
	private width: number;
	private height: number;

	private _opensetDirty = false;

	//标志量，可走标示，不可走标示，需要提前设定
	private goodTag: JPSCheckTag<TAG>;
	private badTag: JPSCheckTag<TAG>;

	//一些回调
	private searchCB: Function;
	constructor() {
		this.openSet = new MinHeap<T>((a, b) => a.f - b.f); // 按 f 值排序
		this.openMap = new Set<number>();
		this.closeSet = new Set<number>();
		this.changeSet = new Set<number>();
	}

	public init(all: Array<T>, goodTag: JPSCheckTag<TAG>, badTag: JPSCheckTag<TAG>, w: number, h: number): void {
		this.allPoint = all;
		this.goodTag = goodTag;
		this.badTag = badTag;
		this.width = w;
		this.height = h;
	}

	setOnSearchCall(cb: Function) {
		this.searchCB = cb;
	}

	findPath(start: T, end: T): Array<T> {
		this.reset();

		this.startPoint = start;
		this.endPoint = end;

		this.startPoint.parentIndex = -1;
		this.endPoint.parentIndex = -1;
		return this.start();
	}

	private reset(): void {
		if (this.allPoint) {
			for (let index of this.changeSet) {
				this.resetByIndex(index);
			}
		}
		this.openSet.clear();
		this.openMap.clear();
		this.closeSet.clear();
		this.changeSet.clear();
	}

	private resetByIndex(index: number): void {
		let item = this.allPoint[index];
		if (item) {
			item.g = 0;
			item.h = 0;
			item.f = 0;
			item.parentIndex = -1;
			item.currentDir = 0;
		}
	}

	private add = []
	private start(): Array<T> {
		if (this.startPoint && this.endPoint) {
			this.startPoint.g = this.gF(this.startPoint, null);
			this.startPoint.h = this.hF(this.startPoint);
			this.startPoint.f = this.fF(this.startPoint);
			this.startPoint.currentDir = JPSNode.JPS_DIR.NONE;
			this.changeSet.add(this.startPoint.myIndex);
			//起点需要先检查八个方向的邻节点
			this.openSet.push(this.startPoint);
			this.openMap.add(this.startPoint.myIndex);
			this.add.push(1)
			console.log("=====================103", this)
			return this.search();
		}
		return null;
	}

	private arr = [];
	// private search(): Array<T> {
	// 	while (true) {
	// 		if (this.endPoint.parentIndex != -1) {
	// 			console.log("===================,", this.arr);
	// 			return this.makePath();
	// 		}

	// 		// 取 F 值最小的点
	// 		let smallFPoint = this.findSmallestHPoint();
	// 		if (!smallFPoint) {
	// 			// openSet 空了，说明无路可走
	// 			console.log("===================,", this.arr);
	// 			return null;
	// 		}

	// 		this.arr.push(1);
	// 		// 扩展该点
	// 		this.closeSet.add(smallFPoint.myIndex);
	// 		this.goNext(smallFPoint);
	// 	}
	// }
	private search(): Array<T> {
		while (true) {
			if (this.endPoint.parentIndex != -1) {
				console.log("===================,", this.arr);
				return this.makePath();
			}
			const smallFPoint = this._popMinF();
			if (!smallFPoint) return null;

			this.arr.push(1);
			this.closeSet.add(smallFPoint.myIndex);
			this.goNext(smallFPoint);
		}
	}

	private _popMinF(): T | null {
		if (this.openSet.retrunArr().length === 0) return null;
		if (this._opensetDirty) {
			this.openSet.retrunArr().sort((a, b) => a.f - b.f);
			this._opensetDirty = false;
		}
		const node = this.openSet.retrunArr().shift()!;
		this.openMap.delete(node.myIndex);
		return node;
	}

	private makePath(): Array<T> {
		let path = new Array<T>();
		path.push(this.endPoint);
		let parentIndex = this.endPoint.parentIndex;
		let pathNum: number = 0;
		while (parentIndex != -1 && pathNum < 200) {
			let parent = this.allPoint[parentIndex];
			if (parent) {
				path.push(parent);
				parentIndex = parent.parentIndex;
				pathNum++;
			}
		}
		if (pathNum >= 200) {
			console.log("pathNum 路径长度超出限制 parentIndex", parentIndex);
			return [];
		}
		return path.reverse();
	}

	private goNext(point: T) {
		//这里进来的point都是跳点，所以应该是根据他的方向进行多向搜索
		let curdir = point.currentDir;
		if (this.isDirect(curdir) == true) {
			let curcorde = makeCordeV2(point.corde);
			//该搜索他的相对前方，相对左前方，相对右前方
			//相对前方
			this.lineSearch(point, curdir);
			//相对左前方
			let rlfdv = this.relativeLeftForwardCorde(curdir);
			let rlfnode = this.nextPointByCorde(addCorde(curcorde, rlfdv));
			if (rlfnode && this.checkPointGood(rlfnode) == true) {
				rlfnode.currentDir = this.twoPointDir(rlfnode, point);
				rlfnode.parentIndex = point.myIndex;
				this.makeJpGHF(rlfnode, point, rlfnode.currentDir);
				this.changeSet.add(rlfnode.myIndex);
				if (this.slashSearch(rlfnode) == true) {
				}
			}
			//相对右前方
			let rrfdv = this.relativeRightForwardCorde(curdir);
			let rrfnode = this.nextPointByCorde(addCorde(curcorde, rrfdv));
			if (rrfnode && this.checkPointGood(rrfnode) == true) {
				rrfnode.currentDir = this.twoPointDir(rrfnode, point);
				rrfnode.parentIndex = point.myIndex;
				this.makeJpGHF(rrfnode, point, rrfnode.currentDir);
				this.changeSet.add(rrfnode.myIndex);
				if (this.slashSearch(rrfnode) == true) {
				}
			}
			//没有点，则代表垂直方向到边或遇到障碍，退出递归
		} else {
			//这里是非直线方向处理，非直线方向包含了两种情况，
			if (curdir == JPSNode.JPS_DIR.NONE) {
				//1，无方向，即起点处理，需要八个方向分别处理，
				let neighbors = this.findNeighbors(point);
				for (let index = 0; index < neighbors.length; index++) {
					const node = neighbors[index];
					if (node) {
						if (this.isDirect(node.currentDir) == true) {
							this.lineSearch(node, node.currentDir)
						} else {
							if (this.slashSearch(node) == true) {
							}
						}
					}


				}
			} else {
				let curcorde = makeCordeV2(point.corde);
				let ddir = this.splitSlash(point.currentDir);
				for (let index = 0; index < ddir.length; index++) {
					const dir = ddir[index];
					this.lineSearch(point, dir)
				}
				//相向斜角
				let sldv = this.nextSlashDeCorde(curdir);
				let slnode = this.nextPointByCorde(addCorde(curcorde, sldv));
				if (slnode && this.checkPointGood(slnode) == true) {
					slnode.currentDir = curdir;
					slnode.parentIndex = point.myIndex;
					this.makeJpGHF(slnode, point, slnode.currentDir);
					this.changeSet.add(slnode.myIndex);
					if (this.slashSearch(slnode) == true) {
					}
				}
			}
		}
	}

	private lineSearch(point: T, dir: number) {
		let current: T = point;

		while (true) {
			current.visitCount++;
			//搜索直线直到碰到障碍，边界或找到跳点结束，如果找到跳点，则smallfpoint也是跳点
			// 检查强迫邻居（左）
			let ldv = this.relativeLeftCorde(dir);
			let lfdv = this.relativeLeftForwardCorde(dir);
			let forceNeibor = this.checkLinePointHasForceNeighbor(ldv, lfdv, current);
			if (forceNeibor) {
				// let parent = this.allPoint[current.parentIndex];
				// this.putPointInOpenSet(current, parent);
				forceNeibor.currentDir = this.twoPointDir(forceNeibor, current);
				this.putPointInOpenSet(forceNeibor, current);
			}

			// 检查强迫邻居（右）
			let rdv = this.relativeRightCorde(dir);
			let rfdv = this.relativeRightForwardCorde(dir);
			forceNeibor = this.checkLinePointHasForceNeighbor(rdv, rfdv, current);
			if (forceNeibor) {
				// let parent = this.allPoint[current.parentIndex];
				// this.putPointInOpenSet(current, parent);
				forceNeibor.currentDir = this.twoPointDir(forceNeibor, current);
				this.putPointInOpenSet(forceNeibor, current);
			}

			// 前进一格
			let dv = this.nextDirectDeCorde(dir);
			let curcorde = makeCordeV2(current.corde);
			let nextNode = this.nextPointByCorde(addCorde(curcorde, dv));

			if (!nextNode) {
				// 越界
				break;
			}

			if (this.isEndPoint(nextNode)) {
				this.endPoint.parentIndex = current.myIndex;
				break;
			}

			if (!this.checkPointGood(nextNode)) {
				// 遇到障碍
				break;
			}

			// 更新 nextNode
			nextNode.currentDir = dir;
			nextNode.parentIndex = current.myIndex;
			this.makeJpGHF(nextNode, current, nextNode.currentDir);
			this.changeSet.add(nextNode.myIndex);
			// 往下继续
			current = nextNode;
		}
	}

	private slashSearch(start: T): boolean {
		//首先检查这个斜角点的是否是跳点
		let current: T = start;

		while (true) {
			current.visitCount++;

			// 检查垂直分量
			let ddir = this.splitSlash(current.currentDir);
			for (let index = 0; index < ddir.length; index++) {
				this.lineSearch(current, ddir[index]);
			}

			// 这个斜角的垂直分量搜索完毕,继续沿斜角走
			let sldv = this.nextSlashDeCorde(current.currentDir);
			if (!sldv) {
				console.log(" sldv 斜角方向错误");
				break;
			}

			let curcorde = addCorde(current.corde, sldv);
			let nextNode = this.nextPointByCorde(curcorde);

			if (!nextNode) {
				break;
			}

			if (this.checkPointGood(nextNode)) {
				nextNode.currentDir = current.currentDir;
				nextNode.parentIndex = current.myIndex;
				this.makeJpGHF(nextNode, current, nextNode.currentDir);
				this.changeSet.add(nextNode.myIndex);
				current = nextNode; // 继续往下
			} else {
				break;
			}
		}

		return true;

	}

	private checkLinePointHasForceNeighbor(dv: Corde, fdv: Corde, parent: T): T {
		let curcorde = makeCordeV2(parent.corde);
		let node = this.nextPointByCorde(addCorde(curcorde, dv));
		if (node) {
			if (this.checkPointGood(node) == false) {
				//再查他的相对左前方是否可走，如果可走，则它是跳点，它的相对左前方是强迫邻居
				let fnode = this.nextPointByCorde(addCorde(curcorde, fdv));
				if (fnode) {
					if (this.checkPointGood(fnode) == true) {//相对右前方可走
						//node点是跳点
						//fnode是强迫邻居
						return fnode;
					}
				}
			}
		}
		return null;
	}

	private isEndPoint(point: T): boolean {
		return point.myIndex == this.endPoint.myIndex;
	}

	private makeJpGHF(point: T, parent: T, dir: number) {
		point.g = this.gF(point, parent);
		point.h = this.hF(point);
		point.f = this.fF(point);
	}

	//找到相邻的8个节点
	private findNeighbors(point: T): Array<T> {
		let findPoints = new Array();
		if (point) {
			for (let x = -1; x <= 1; x++) {
				for (let y = -1; y <= 1; y++) {
					if (x == 0 && y == 0) {//排除自己
						continue;
					}
					let px = point.corde.x + x;
					let py = point.corde.y + y;
					if (px < 0 || py < 0 || px >= this.width || py >= this.height) {
						continue;
					}
					let index = py * this.width + px;
					let p = this.allPoint[index];

					if (p && this.checkPointInCloseSet(p) == false && this.checkPointGood(p) == true) {
						p.currentDir = this.twoPointDir(p, point);
						p.parentIndex = point.myIndex;
						p.g = this.gF(p, point);
						p.h = this.hF(p);
						p.f = this.fF(p);
						findPoints.push(p);
						this.changeSet.add(p.myIndex);
					}
				}
			}
		}
		return findPoints;
	}

	private splitSlash(dir: number): Array<number> {
		return JPSNode.DIRECTION_CACHE[dir] || [];
	}

	private splitSlashDir(dir: number): Array<Corde> {
		if ((dir ^ JPSNode.JPS_DIR.LD) == 0) {
			return [makeCorde(-1, 0), makeCorde(0, 1)];
		}
		if ((dir ^ JPSNode.JPS_DIR.RD) == 0) {
			return [makeCorde(1, 0), makeCorde(0, 1)];
		}
		if ((dir ^ JPSNode.JPS_DIR.LU) == 0) {
			return [makeCorde(-1, 0), makeCorde(0, -1)];
		}
		if ((dir ^ JPSNode.JPS_DIR.RU) == 0) {
			return [makeCorde(1, 0), makeCorde(0, -1)];
		}
		return [];
	}

	private relativeLeftForwardCorde(currentDir: number): Corde {
		if ((currentDir ^ JPSNode.JPS_DIR.D) == 0) {
			return makeCorde(1, 1);
		}
		if ((currentDir ^ JPSNode.JPS_DIR.U) == 0) {
			return makeCorde(-1, -1);
		}
		if ((currentDir ^ JPSNode.JPS_DIR.L) == 0) {
			return makeCorde(-1, 1);
		}
		if ((currentDir ^ JPSNode.JPS_DIR.R) == 0) {
			return makeCorde(1, -1);
		}
	}

	private relativeLeftCorde(currentDir: number): Corde {
		if ((currentDir ^ JPSNode.JPS_DIR.D) == 0) {
			return makeCorde(1, 0);
		}
		if ((currentDir ^ JPSNode.JPS_DIR.U) == 0) {
			return makeCorde(-1, 0);
		}
		if ((currentDir ^ JPSNode.JPS_DIR.L) == 0) {
			return makeCorde(0, 1);
		}
		if ((currentDir ^ JPSNode.JPS_DIR.R) == 0) {
			return makeCorde(0, -1);
		}
	}

	private relativeRightForwardCorde(currentDir: number): Corde {
		if ((currentDir ^ JPSNode.JPS_DIR.D) == 0) {
			return makeCorde(-1, 1);
		}
		if ((currentDir ^ JPSNode.JPS_DIR.U) == 0) {
			return makeCorde(1, -1);
		}
		if ((currentDir ^ JPSNode.JPS_DIR.L) == 0) {
			return makeCorde(-1, -1);
		}
		if ((currentDir ^ JPSNode.JPS_DIR.R) == 0) {
			return makeCorde(1, 1);
		}
	}

	private relativeRightCorde(currentDir: number): Corde {
		if ((currentDir ^ JPSNode.JPS_DIR.D) == 0) {
			return makeCorde(-1, 0);
		}
		if ((currentDir ^ JPSNode.JPS_DIR.U) == 0) {
			return makeCorde(1, 0);
		}
		if ((currentDir ^ JPSNode.JPS_DIR.L) == 0) {
			return makeCorde(0, -1);
		}
		if ((currentDir ^ JPSNode.JPS_DIR.R) == 0) {
			return makeCorde(0, 1);
		}
	}

	// private nextDirectDeCorde(currentDir: number): Corde {
	// 	if ((currentDir ^ JPSNode.JPS_DIR.D) == 0) {//下,返回下，右下，左下
	// 		return makeCorde(0, 1);
	// 	} else if ((currentDir ^ JPSNode.JPS_DIR.L) == 0) {
	// 		return makeCorde(-1, 0);
	// 	} else if ((currentDir ^ JPSNode.JPS_DIR.R) == 0) {
	// 		return makeCorde(1, 0);
	// 	} else if ((currentDir ^ JPSNode.JPS_DIR.U) == 0) {
	// 		return makeCorde(0, -1);
	// 	}
	// }
	private nextDirectDeCorde(d: number): Corde {
		switch (d) {
			case JPSNode.JPS_DIR.D: return makeCorde(0, 1);
			case JPSNode.JPS_DIR.L: return makeCorde(-1, 0);
			case JPSNode.JPS_DIR.R: return makeCorde(1, 0);
			case JPSNode.JPS_DIR.U: return makeCorde(0, -1);
			default: throw new Error(`==============>${d}`);
		}
	}

	private nextSlashDeCorde(dir: number): Corde {
		if ((dir ^ JPSNode.JPS_DIR.LD) == 0) {
			return makeCorde(-1, 1);
		}
		if ((dir ^ JPSNode.JPS_DIR.RD) == 0) {
			return makeCorde(1, 1);
		}
		if ((dir ^ JPSNode.JPS_DIR.LU) == 0) {
			return makeCorde(-1, -1);
		}
		if ((dir ^ JPSNode.JPS_DIR.RU) == 0) {
			return makeCorde(1, -1);
		}
		console.log("error dir");
	}

	private nextPointByCorde(corde: Corde): T {
		if (corde.x < 0 || corde.x >= this.width || corde.y < 0 || corde.y >= this.height) {
			return null;
		}
		let index = corde.y * this.width + corde.x;
		let next = this.allPoint[index];
		return next;
	}

	private twoPointDir(p1: T, p2: T): number {
		let dx = p1.corde.x - p2.corde.x;
		let dy = p1.corde.y - p2.corde.y;
		if (dx > 0 && dy > 0) {
			return JPSNode.JPS_DIR.RD;
		}
		if (dx < 0 && dy > 0) {
			return JPSNode.JPS_DIR.LD;
		}
		if (dx > 0 && dy < 0) {
			return JPSNode.JPS_DIR.RU;
		}
		if (dx < 0 && dy < 0) {
			return JPSNode.JPS_DIR.LU;
		}
		if (dx < 0) {
			return JPSNode.JPS_DIR.L;
		}
		if (dy < 0) {
			return JPSNode.JPS_DIR.U;
		}
		if (dx > 0) {
			return JPSNode.JPS_DIR.R;
		}
		if (dy > 0) {
			return JPSNode.JPS_DIR.D;
		}
		console.log("twoPointDir error");
		return JPSNode.JPS_DIR.NONE;
	}

	private isDirect(dir: number): boolean {
		return ((JPSNode.JPS_DIR.L ^ dir) == 0) || ((JPSNode.JPS_DIR.R ^ dir) == 0) ||
			((JPSNode.JPS_DIR.D ^ dir) == 0) || ((JPSNode.JPS_DIR.U ^ dir) == 0);
	}

	private isSlash(dir: number): boolean {
		return ((JPSNode.JPS_DIR.LD ^ dir) == 0) || ((JPSNode.JPS_DIR.LU ^ dir) == 0) ||
			((JPSNode.JPS_DIR.RD ^ dir) == 0) || ((JPSNode.JPS_DIR.RU ^ dir) == 0);
	}

	private checkPointGood(point: T): boolean {
		return point.myTag.compare(this.goodTag) || this.isEndPoint(point);
	}

	private checkPointInCloseSet(point: T): boolean {
		return this.closeSet.has(point.myIndex);
	}

	private findSmallestFPoint(list: Array<T>): T {
		list.sort((a, b) => a && b && (a.f - b.f));
		return list.shift();
	}
	// private findSmallestHPoint(): T {
	// 	return this.openSet.pop();
	// }

	private findSmallestHPoint(): T | null {
		return this._popMinF();
	}

	// private putPointInOpenSet(point: T, parent: T) {
	// 	if (this.checkPointInCloseSet(point) == true) {
	// 		return;
	// 	}
	// 	this.changeSet.add(point.myIndex);
	// 	let p = point;
	// 	if (this.openMap.has(point.myIndex)) {//如果已经在开放列表中，再次计算他的g值是否比原来的小

	// 		let g = this.gF(p, parent);
	// 		if (g < p.g) {
	// 			p.g = g;
	// 			p.f = this.fF(p);//从新计算f
	// 			p.parentIndex = parent.myIndex;
	// 			if (this.searchCB) {
	// 				this.searchCB(p);
	// 			}
	// 		}
	// 		return;
	// 	}

	// 	//计算他的g，h，f值
	// 	//计算该点的ghf
	// 	p.g = this.gF(p, parent);
	// 	p.h = this.hF(p);
	// 	p.f = this.fF(p);
	// 	p.isJump = true;
	// 	if (this.searchCB) {
	// 		this.searchCB(p);
	// 	}
	// 	//把它的父节点设置为当前节点
	// 	p.parentIndex = parent.myIndex;
	// 	this.openSet.push(point);

	// }

	private putPointInOpenSet(point: T, parent: T) {
		if (this.checkPointInCloseSet(point)) return;

		// 已在
		if (this.openMap.has(point.myIndex)) {
			const newG = this.gF(point, parent);
			if (newG < point.g) {
				point.g = newG;
				point.f = this.fF(point);
				point.parentIndex = parent.myIndex;
				if (this.searchCB) this.searchCB(point);
				this._opensetDirty = true;
			}
			return;
		}

		point.g = this.gF(point, parent);
		point.h = this.hF(point);
		point.f = this.fF(point);
		point.isJump = true;
		point.parentIndex = parent.myIndex;
		if (this.searchCB) this.searchCB(point);

		this.openSet.push(point);
		this.openMap.add(point.myIndex);
		this._opensetDirty = true;
	}

	private gF(point: T, parent: T): number {
		if (parent == null) {
			return 0;
		}
		let dx = Math.abs(point.corde.x - parent.corde.x);
		let dy = Math.abs(point.corde.y - parent.corde.y);
		let cost = 0;
		if (dx * dy == 0) {//垂直关系
			cost = parent.g + JPS.Cost90;
		} else {//斜角关系
			cost = parent.g + JPS.Cost45;
		}
		return cost;
	}

	private hF(point: T): number {
		let dx = Math.abs(point.corde.x - this.endPoint.corde.x);
		let dy = Math.abs(point.corde.y - this.endPoint.corde.y);
		let cost = dx * JPS.Cost90 + dy * JPS.Cost90;
		return cost;
	}

	private fF(point: T): number {
		return point.g + point.h;
	}

	//更新周边所有跳点
	public updateAroundJumpPoint(minGrid: Corde, maxGrid: Corde) {
		let minX = Math.max(0, minGrid.x - 3);
		let minY = Math.max(0, minGrid.y - 3);
		let maxX = Math.min(this.width, maxGrid.x + 3);
		let maxY = Math.min(this.height, maxGrid.y + 3);
		// 遍历周围的跳点区域
		for (let x = minX; x <= maxX; x++) {
			for (let y = minY; y <= maxY; y++) {
				// 获取当前节点
				let node = this.allPoint[y * this.width + x];

				// 如果当前节点有效，并且是跳点
				if (node && node.isJump) {
					// 对每个跳点，更新它的跳点直线可达性
					this.updateJumpPointDistance(node);
				}
			}
		}
	}

	// 更新跳点的直线距离和方向
	private updateJumpPointDistance(node: T): void {
		// 遍历8个方向
		const directions = [
			JPSNode.JPS_DIR.L, JPSNode.JPS_DIR.R, JPSNode.JPS_DIR.U, JPSNode.JPS_DIR.D,
			JPSNode.JPS_DIR.LU, JPSNode.JPS_DIR.LD, JPSNode.JPS_DIR.RU, JPSNode.JPS_DIR.RD
		];

		// 遍历每个方向，检查直线可达性并记录距离
		for (let dir of directions) {
			// 查找当前方向上的邻居节点
			let neighbor = this.getNeighborInDirection(node, dir);

			// 如果邻居有效且可到达
			if (neighbor && this.checkPointGood(neighbor)) {
				// 计算当前跳点到邻居的直线距离
				let distance = node.calculateDistance(neighbor);

				// 更新该方向的跳点距离
				node.setJumpDistance(dir, distance);
			} else {
				// 如果该方向不可达，清除对应的跳点距离
				node.setJumpDistance(dir, 0);  // 0 表示不可达
			}
		}
	}

	// 获取当前节点在给定方向上的邻居节点
	private getNeighborInDirection(node: T, direction: number): T {
		const cordOffset = this.getDirectionOffset(direction);
		const newCorde = addCorde(node.corde, cordOffset);
		return this.nextPointByCorde(newCorde);
	}

	// 获取方向对应的坐标偏移
	private getDirectionOffset(direction: number): Corde {
		switch (direction) {
			case JPSNode.JPS_DIR.L:
				return makeCorde(-1, 0);
			case JPSNode.JPS_DIR.R:
				return makeCorde(1, 0);
			case JPSNode.JPS_DIR.U:
				return makeCorde(0, -1);
			case JPSNode.JPS_DIR.D:
				return makeCorde(0, 1);
			case JPSNode.JPS_DIR.LU:
				return makeCorde(-1, -1);
			case JPSNode.JPS_DIR.LD:
				return makeCorde(-1, 1);
			case JPSNode.JPS_DIR.RU:
				return makeCorde(1, -1);
			case JPSNode.JPS_DIR.RD:
				return makeCorde(1, 1);
			default:
				return makeCorde(0, 0);  // 默认值
		}
	}
}
