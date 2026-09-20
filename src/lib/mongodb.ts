import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "treqo";

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export async function getMongoClient(): Promise<MongoClient | null> {
  if (!uri || uri.trim() === "") {
    return null;
  }

  try {
    if (process.env.NODE_ENV === "development") {
      if (!global._mongoClientPromise) {
        client = new MongoClient(uri, {
          serverSelectionTimeoutMS: 2500,
          connectTimeoutMS: 2500,
          socketTimeoutMS: 4000,
          maxPoolSize: 10,
        });
        global._mongoClientPromise = client.connect().catch((err) => {
          console.warn("[MongoDB Connect Notice]: Using local storage fallback.", err?.message || err);
          global._mongoClientPromise = undefined;
          return null as unknown as MongoClient;
        });
      }
      const c = await global._mongoClientPromise;
      return c || null;
    } else {
      if (!clientPromise) {
        client = new MongoClient(uri, {
          serverSelectionTimeoutMS: 2500,
          connectTimeoutMS: 2500,
          socketTimeoutMS: 4000,
          maxPoolSize: 10,
        });
        clientPromise = client.connect().catch((err) => {
          console.warn("[MongoDB Connect Notice]: Using local storage fallback.", err?.message || err);
          clientPromise = null;
          return null as unknown as MongoClient;
        });
      }
      const c = await clientPromise;
      return c || null;
    }
  } catch (error) {
    console.error("[MongoDB Connection Error]:", error);
    return null;
  }
}

export async function getMongoDb(): Promise<Db | null> {
  const clientInstance = await getMongoClient();
  if (!clientInstance) return null;
  try {
    return clientInstance.db(dbName);
  } catch {
    return null;
  }
}

export async function checkMongoConnection(): Promise<{
  connected: boolean;
  uriSet: boolean;
  database?: string;
  error?: string;
}> {
  if (!uri || uri.trim() === "") {
    return {
      connected: false,
      uriSet: false,
      error: "MONGODB_URI is not set in environment variables.",
    };
  }

  try {
    const db = await getMongoDb();
    if (!db) {
      return {
        connected: false,
        uriSet: true,
        error: "Failed to establish client connection.",
      };
    }
    // Ping database
    await db.command({ ping: 1 });
    return {
      connected: true,
      uriSet: true,
      database: dbName,
    };
  } catch (err: unknown) {
    return {
      connected: false,
      uriSet: true,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
