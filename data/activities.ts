export interface ActivitiesJSON {
    id: string;
    label: string;
    description: string;
    emoji?: string;
    readonly value: string | ReadonlyArray<ActivitiesJSON>;
}

export class Activities {
    id: string;
    label: string;
    description: string;
    emoji?: string;
    readonly value: string | ReadonlyArray<ActivitiesJSON>;

    isSubgroup() {
        return Array.isArray(this.value);
    }

    constructor(model: ActivitiesJSON) {
        this.id = model.id;
        this.label = model.description;
        this.description = model.description;
        this.emoji = model.emoji;
        
        if (Array.isArray(model.value)) {
            const _constructor = this.constructor as new (...args: any[]) => this;
            this.value = model.value.map(child => new _constructor(child));
        }
        else {
            this.value = model.value;
        }
    }
}