import { Model } from "sequelize-typescript";
import { DataTypes } from "sequelize";
import { getDB } from "../database/database";
import { LFG } from "./lfg";

const db = getDB();

export interface CharacterInstance extends Model {
    character_name: string,
    player_id: string,
    item_level: number,
    class: string
}

export const Character = db.define<CharacterInstance>("Character", {
    character_name: {
        type: DataTypes.TEXT,
        primaryKey: true
    },
    player_id: DataTypes.TEXT,
    item_level: DataTypes.INTEGER,
    class: DataTypes.STRING
});

Character.belongsToMany(LFG, { through: "Players", foreignKey: "character_name" });
LFG.belongsToMany(Character, { through: "Players", foreignKey: "lfg_id", onDelete: "CASCADE" });