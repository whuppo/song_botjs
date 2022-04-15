import { Model } from "sequelize-typescript";
import { DataTypes } from "sequelize";
import { getDB } from "../database/database";

const db = getDB();

export interface ServerSettingsInstance extends Model {
    server_id: string,
    lfg_channel: string
}

export const ServerSettings = db.define<ServerSettingsInstance>("ServerSettings", {
    server_id: {
        type: DataTypes.TEXT,
        primaryKey: true
    },
    lfg_channel: DataTypes.TEXT
});