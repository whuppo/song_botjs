import { Model } from "sequelize-typescript";
import { DataTypes } from "sequelize";
import { getDB } from "../database/database";

const db = getDB();

export interface LFGSubscribeInstance extends Model {
    server_id: string,
    subscribed_server_id: string
}

export const LFGSubscribe = db.define<LFGSubscribeInstance>("LFGSubscribe", {
    server_id: DataTypes.TEXT,
    subscribed_server_id: DataTypes.TEXT
});