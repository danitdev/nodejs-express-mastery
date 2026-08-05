import { Sequelize,DataTypes  } from "sequelize";
import { sequelize } from "../utils/database.js";
export const User = sequelize.define("user",{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name:{
        type:DataTypes.STRING,
        allowNull: false
    },
    email:{
        type:DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    resetToken:{
        type:DataTypes.STRING,
        allowNull:true
    },
    resetTokenExpiration:{
        type:DataTypes.DATE,
        allowNull:true
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    }
});