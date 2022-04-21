import { Model } from "sequelize-typescript";
import { DataTypes } from "sequelize";
import { getDB } from "../database/database";
import { LFG } from "./lfg";

const db = getDB();

export interface LFGPostInstance extends Model {
    channel_id: string,
    message_id: string
}

export const LFGPost = db.define<LFGPostInstance>("LFGPost", {
    channel_id: DataTypes.TEXT,
    message_id: DataTypes.TEXT
});

LFGPost.belongsTo(LFG, { foreignKey: "lfg_id", onDelete: "CASCADE" });
LFG.hasMany(LFGPost);