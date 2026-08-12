import { Sequelize,DataTypes } from "sequelize";
import {sequelize} from "../utils/database.js";
//defining model and exporting it
export const Product = sequelize.define("product",{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title:{
        type: DataTypes.STRING,
        allowNull: false
    },
    price:{
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description:{
        type: Sequelize.STRING,
        allowNull : false
    }
});
