import { Model } from "sequelize-typescript";
import { DataTypes } from "sequelize";
import { getDB } from "../database/database";

const db = getDB();

export interface LFGInstance extends Model {
    lfg_id: number,
    activity: string,
    time: string,
    description: string,
    author_id: string
}

function LFGUIDGen() {
    const min = 1000;
    const max = 9999;

    let check, roll = null;
    while (!check) {
        roll = Math.floor(Math.random() * (max - min + 1) + min);
        check = LFG.findOne({
            where: {lfg_id: roll}
        })
    }

    return roll;
}

export const LFG = db.define<LFGInstance>("LFG", {
    lfg_id: {
        type: DataTypes.NUMBER,
        defaultValue: () => { return LFGUIDGen(); },
        primaryKey: true
    },
    activity: DataTypes.TEXT,
    time: DataTypes.TEXT,
    description: DataTypes.TEXT,
    author_id: DataTypes.TEXT
});