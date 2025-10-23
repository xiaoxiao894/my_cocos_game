export class Singleton {
    private static instances: {[key: string]: any} = {};

    constructor() {
        const className = this.constructor.name;
        if (Singleton.instances[className]) {
            return Singleton.instances[className];
        }
        Singleton.instances[className] = this;
    }

    public static getInstance<T extends {}>(this: new () => T): T {
        if (!Singleton.instances[this.name]) {
            Singleton.instances[this.name] = new this();
        }
        return Singleton.instances[this.name];
    }
}
