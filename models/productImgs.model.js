const { DataTypes, db } = require("../utils/database.util");

const ProductImgs = db.define("productImgs", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  imgUrl: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  productId: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },

  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "active",
  },
});

module.exports = { ProductImgs };