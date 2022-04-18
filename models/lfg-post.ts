import { Model } from "sequelize-typescript";
import { DataTypes } from "sequelize";
import { getDB } from "../database/database";
import { LFG } from "./lfg";

const db = getDB();

export interface LFGPostInstance extends Model {
    lfg_id: string,
    message_id: string
}

export const LFGPost = db.define<LFGPostInstance>("LFGPos", {
    lfg_id: DataTypes.TEXT,
    message_id: DataTypes.TEXT
});

LFG.hasMany(LFGPost, { foreignKey: "lfg_id" });
LFGPost.belongsTo(LFG);