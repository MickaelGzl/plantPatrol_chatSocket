import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

console.log("test: ", !!process.env.MONGODB_URI);

export const connection = () => {
  mongoose
    .connect(process.env.MONGODB_URI!)
    .then(async () => {
      console.log("connection ok");
    })
    .catch((err) => console.log(`Error: ${err}`));
};
