// 轻量坐标结构
export interface Corde {
    x: number;
    y: number;
}

// 工具函数
export function makeCorde(x: number, y: number): Corde {
    return { x, y };
}

export function makeCordeV2(corde: Corde): Corde {
    return { x: corde.x, y: corde.y };
}

export function addCorde(a: Corde, b: Corde): Corde {
    return { x: a.x + b.x, y: a.y + b.y };
}

export function subCorde(a: Corde, b: Corde): Corde {
    return { x: a.x - b.x, y: a.y - b.y };
}

export function equalCorde(a: Corde, b: Corde): boolean {
    return a.x === b.x && a.y === b.y;
}

export function dist(a: Corde, b: Corde): number {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}
