import { Sequelize,DataTypes } from "sequelize";
import { sequelize } from "../utils/database.js";

export const CartItem = sequelize.define("cartItem",{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    quantity: DataTypes.INTEGER
});