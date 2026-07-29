import { Sequelize,DataTypes } from "sequelize";
import { sequelize } from "../utils/database.js";

export const Cart = sequelize.define("cart",{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
});