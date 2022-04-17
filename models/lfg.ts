import { Model } from "sequelize-typescript";
import { DataTypes } from "sequelize";
import { getDB } from "../database/database";

const db = getDB();

export interface LFGInstance extends Model {
    lfg_id: number,
    activity: string,
    time: string,
    description: string,
    author_id: number,
    message_id: number
}

async function LFGUIDGenerator() {
    const min = 1000;
    const max = 9999;

    let check, roll = null;
    while (!check) {
        roll = Math.floor(Math.random() * (max - min + 1) + min);
        check = await LFG.findOne({
            where: {id: roll}
        })
    }

    return roll;
}

export const LFG = db.define<LFGInstance>("LFG", {
    lfg_id: {
        type: DataTypes.NUMBER,
        defaultValue: async () => await LFGUIDGenerator(),
        primaryKey: true
    },
    activity: DataTypes.TEXT,
    time: DataTypes.TEXT,
    description: DataTypes.TEXT,
    author_id: DataTypes.TEXT,
    message_id: DataTypes.TEXT
});