import mongoose from "mongoose";

const configOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

export async function connectToDB() {
  try {
    mongoose.connect(process.env.MONGO_URI, configOptions);
    const connection = mongoose.connection;
    // ab hum is connection k events pr listen kr skta han

    connection.on("connected", () => {
      console.log("MongoDB connected!");
    });

    connection.on("error", (error) => {
      console.log(
        "MongDB connection error, please make sure db is up and running:" +
          error
      );
      if (error) {
        process.exit(1);
      } else {
        process.exit(0);
      }
    });
  } catch (error) {
    console.log("Something went wrong in connecting to DB");
    console.log(error);
  }
}
