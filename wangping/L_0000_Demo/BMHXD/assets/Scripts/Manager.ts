import { EffectManager } from "./Game/EffectManager"
import { GameManager } from "./Game/GameManager"
import { PoolManager } from "./Game/PoolManager";
import { DropManager } from "./Game/DropManager";
import { EnemyManager } from "./Game/EnemyManager";

class Manager {
    public get game(): GameManager {
        return GameManager.instance;
    }

    public get effect(): EffectManager {
        return EffectManager.instance;
    }

    public get enemy(): EnemyManager {
        return EnemyManager.instance;
    }

    public get pool(): PoolManager {
        return PoolManager.instance;
    }

    public get drop(): DropManager {
        return DropManager.instance;
    }
}

declare global {
    interface Window {
        manager: Manager;
    }
    const manager: Manager;
}

window.manager = new Manager();