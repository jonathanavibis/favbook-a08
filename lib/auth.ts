import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const uri =
  process.env.MONGODB_URI ||
  process.env.MONGODB_URL ||
  "mongodb://desti-admin:Y6aquSupYTViBVCV@ac-oh5udfn-shard-00-00.yv9gptq.mongodb.net:27017,ac-oh5udfn-shard-00-01.yv9gptq.mongodb.net:27017,ac-oh5udfn-shard-00-02.yv9gptq.mongodb.net:27017/bookhype_db?ssl=true&authSource=admin";

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri);
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export const getDb = async () => {
  const connectedClient = await clientPromise;
  return connectedClient.db(process.env.MONGODB_DB || "bookhype_db");
};

export const auth = betterAuth({
  database: mongodbAdapter(await getDb(), {
    client: await clientPromise,
  }),
  emailAndPassword: {
    enabled: true,
  },
  secret: process.env.BETTER_AUTH_SECRET || process.env.JWT_SECRET || "bookhype_secret_key_super_secure_2026_jwt_token",
});
