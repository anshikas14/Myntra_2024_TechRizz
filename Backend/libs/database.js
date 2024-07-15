// import mongoose from "mongoose"

// // This connects our app to MongoDB
// export function connect() {

//   // Add mongoose connection event to follow what is happening with the connection
//   mongoose.connection.on("error",         e => console.log("[M] Error", e))
//   mongoose.connection.on("connecting",    x => console.log("[M] Connecting"))
//   mongoose.connection.on("connected",     x => console.log("[M] Connected"))
//   mongoose.connection.on("disconnecting", x => console.log("[M] Disconnecting"))
//   mongoose.connection.on("disconnected",  x => console.log("[M] Disconnected"))
//   console.log(process.env.PORT);
//   // Construct connection string and start to connect
//   const { DB_USER, DB_PASS, DB_HOST, DB_NAME } = process.env
//   const cs = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}`
//   console.log(cs);
//   return mongoose.connect(cs)


import mongoose from "mongoose";

// This connects our app to MongoDB
export async function connect() {
  // Add mongoose connection event to follow what is happening with the connection
  mongoose.connection.on("error", e => console.log("[M] Error", e));
  mongoose.connection.on("connecting", () => console.log("[M] Connecting"));
  mongoose.connection.on("connected", () => console.log("[M] Connected"));
  mongoose.connection.on("disconnecting", () => console.log("[M] Disconnecting"));
  mongoose.connection.on("disconnected", () => console.log("[M] Disconnected"));

  // Ensure environment variables are set
  const { DB_USER, DB_PASS, DB_HOST, DB_NAME } = process.env;
  if (!DB_USER || !DB_PASS || !DB_HOST || !DB_NAME) {
    console.error("Database configuration environment variables are missing");
    return;
  }

  try {
    // Construct connection string
    const connectionString = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}`;
    // Connect to MongoDB
    await mongoose.connect(connectionString);
    console.log("[M] Database connection successful");
  } catch (error) {
    console.error("[M] Database connection error:", error);
  }
}