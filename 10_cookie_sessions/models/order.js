import { Sequelize,DataTypes } from "sequelize";
import { sequelize } from "../utils/database.js";

export const Order = sequelize.define("order",{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
});