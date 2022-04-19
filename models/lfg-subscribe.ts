import { Model } from "sequelize-typescript";
import { DataTypes } from "sequelize";
import { getDB } from "../database/database";
import { ServerSettings } from "./settings";

const db = getDB();

export interface LFGSubscribeInstance extends Model {
    server_id: string,
    subscribed_server_id: string
}

export const LFGSubscribe = db.define<LFGSubscribeInstance>("LFGSubscribe", {
    server_id: DataTypes.TEXT,
    subscribed_server_id: DataTypes.TEXT
});

LFGSubscribe.belongsTo(ServerSettings, { foreignKey: "server_id" });
ServerSettings.hasMany(LFGSubscribe, { foreignKey: "server_id" });