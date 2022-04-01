export interface ActivitiesInstance {
    id: string;
    label: string;
    description: string;
    emoji?: string;
    value: string | ActivitiesInstance[];
}