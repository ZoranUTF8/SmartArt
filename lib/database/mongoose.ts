import mongoose, { Mongoose } from "mongoose";

const MONGO_DB_URL = process.env.MONGODB_CONNECTION_STRING;

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

let cached: MongooseConnection = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

/**
 * Establishes a connection to the MongoDB database using Mongoose.
 * If a connection already exists, it returns the existing connection.
 * If not, it creates a new connection using the provided MONGODB_URL.
 * @returns {Mongoose} The Mongoose connection object.
 * @throws {Error} If MONGODB_URL is not provided.
 */
export const connectToDatabase = async () => {
  // Check if a connection already exists
  if (cached.conn) return cached.conn;

  // Throw an error if MONGODB_URL is missing
  if (!MONGODB_URL) throw new Error("Missing MONGODB_URL");

  // Create a new connection if one doesn't exist
  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URL, {
      dbName: "smartartCluster0",
      bufferCommands: false,
    });

  // Await the connection promise and store the connection in cached.conn
  cached.conn = await cached.promise;

  // Return the established connection
  return cached.conn;
};
