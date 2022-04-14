import { Type } from "class-transformer";

export class GroupSelection {
    group!: boolean;
    label!: string;
    value!: string;
    description?: string;
    emoji?: string;
}

export class Group {
    id!: string;
    title!: string;
    description!: string;

    @Type(() => GroupSelection)
    values!: GroupSelection[];
}