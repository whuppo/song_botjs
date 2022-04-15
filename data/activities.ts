import { plainToInstance, Type } from "class-transformer";
import { MessageSelectOptionData } from "discord.js";
import { data } from "./activities.json";

export class GroupSelection {
    group!: boolean;
    label!: string;
    value!: string;
    description?: string;
    emoji?: string;

    getOptionData() {
        let value = this.value;
        if (this.group) {
            // group navigation identifier
            value = ">" + value
        }
        let data: MessageSelectOptionData = {
            label: this.label,
            value: value,
            description: this.description,
            emoji: this.emoji
        };
        return data;
    }
}

export class Group {
    id!: string;
    title!: string;
    description!: string;

    @Type(() => GroupSelection)
    values!: GroupSelection[];
}

export const activities = plainToInstance(Group, data);