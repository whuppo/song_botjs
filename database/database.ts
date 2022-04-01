import { Sequelize } from "sequelize-typescript";

var db = new Sequelize({
    host: "localhost",
    dialect: "sqlite",
    storage: "db.sqlite",
    logging: false
});

console.log("Database connected.");

export const getDB = () => { return db; }