import mongoose from "mongoose";
async function connecDb() {
  try {
    const connectinHandle = await mongoose.connect(process.env.MONGODB_URI);
    // console.log(`connected successfully DB HOST:${connectinHandle}`);
    console.log(
      `MongoDb connected\nDB HOST:${connectinHandle.connection.host}`
    );
  } catch (err) {
    console.log("DataBase connection error\n" + err);
    // process.exit(1)
    throw Error(err)
  }
}
export default connecDb;
