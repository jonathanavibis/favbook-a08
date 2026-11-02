import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const uri =
  process.env.MONGODB_URI ||
  process.env.MONGODB_URL ||
  "";

const clientOptions = {
  tlsAllowInvalidCertificates: true,
  serverSelectionTimeoutMS: 8000,
  connectTimeoutMS: 10000,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri, clientOptions);
    (global as any)._mongoClientPromise = client.connect().catch((err) => {
      console.warn("[MongoDB Auth Client Connection Warning]:", err.message);
      return client;
    });
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  client = new MongoClient(uri, clientOptions);
  clientPromise = client.connect().catch((err) => {
    console.warn("[MongoDB Auth Client Connection Warning]:", err.message);
    return client;
  });
}

export const getDb = async () => {
  try {
    const connectedClient = await clientPromise;
    return connectedClient.db(process.env.MONGODB_DB || "booknook");
  } catch (err) {
    console.warn("[getDb Error]:", err);
    return client.db("booknook");
  }
};

const getBaseUrl = () => {
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL;
  if (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes("localhost")) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "https://bookhive-a08.vercel.app";
};

export const auth = betterAuth({
  database: mongodbAdapter(await getDb(), {
    client: await clientPromise,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    },
  },
  secret: process.env.BETTER_AUTH_SECRET || process.env.JWT_SECRET || "default_fallback_secret_booknook_2026",
  baseURL: getBaseUrl(),
});
