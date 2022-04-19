import { Model } from "sequelize-typescript";
import { DataTypes } from "sequelize";
import { getDB } from "../database/database";
import { LFG } from "./lfg";

const db = getDB();

export interface LFGPostInstance extends Model {
    lfg_id: number,
    message_id: string
}

export const LFGPost = db.define<LFGPostInstance>("LFGPost", {
    lfg_id: DataTypes.NUMBER,
    message_id: DataTypes.TEXT
});

LFGPost.belongsTo(LFG, { foreignKey: "lfg_id" });
LFG.hasMany(LFGPost);