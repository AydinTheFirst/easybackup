import mongoose from "mongoose";

// Connect to Mongoose
mongoose.set("strictQuery", true);

await mongoose
  .connect(process.env.mongodb as string)
  .then(() => console.log("Mongoose connection is successfull!"))
  .catch((err) => {
    throw new Error(err);
  });
