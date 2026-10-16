// * ARCHIVO A COMPLETAR
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const TechnologyModel = sequelize.define("Technology", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // TODO: 1. name: string, único y obligatorio.
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  // TODO: 2. description: texto, opcional.
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});
