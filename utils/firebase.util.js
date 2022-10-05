const { initializeApp } = require("firebase/app");
const { getStorage, ref, uploadBytes } = require("firebase/storage");
const dotenv = require("dotenv");

//Models...
const { ProductImgs } = require("../models/productImgs.model");

dotenv.config({ path: "./config.env" });

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  appId: process.env.FIREBASE_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);

const storage = getStorage(firebaseApp);

const uploadProductImgs = async (imgs, productId) => {
  try {
    const imgsPromises = imgs.map(async (img) => {
      //Creating a unique filename...
      const [filename, extension] = img.originalname.split(".");
      const productImg = `${
        process.env.NODE_ENV
      }/products/${productId}/${filename}-${Date.now()}.${extension}`;
      //Creating a reference...
      const imgRef = ref(storage, productImg);
      //Uploading Img...
      const result = await uploadBytes(imgRef, img.buffer);
      return await ProductImgs.create({
        productId,
        imgUrl: result.metadata.fullPath,
      });
    });
    await Promise.all(imgsPromises);
  } catch (error) {
    console.log(error);
  }
};
module.exports = { storage, uploadProductImgs };
