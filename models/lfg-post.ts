import { Model } from "sequelize-typescript";
import { DataTypes } from "sequelize";
import { getDB } from "../database/database";

const db = getDB();

export interface LFGPostInstance extends Model {
    lfg_id: number,
    message_id: string
}

export const LFGPost = db.define<LFGPostInstance>("LFGPost", {
    lfg_id: DataTypes.NUMBER,
    message_id: DataTypes.TEXT
});