const { DataTypes, db } = require("../utils/database.util");

const Cart = db.define("cart", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  userId: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },

  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "active",
  },
});

module.exports = { Cart };
