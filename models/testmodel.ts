import { Model } from "sequelize-typescript";
import { DataTypes } from "sequelize";
import { getDB } from "../database/database";

const db = getDB();

export interface TestInstance extends Model {
    id: number;
    message: string;
}

export const Test = db.define<TestInstance>("Test",{
    id: {
        type: DataTypes.TEXT,
        primaryKey: true
    },
    message: DataTypes.TEXT
});