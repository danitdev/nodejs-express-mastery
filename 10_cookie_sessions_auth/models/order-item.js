import { Sequelize,DataTypes } from "sequelize";
import { sequelize } from "../utils/database.js";

export const OrderItem = sequelize.define("orderItem",{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    quantity: Sequelize.INTEGER
});