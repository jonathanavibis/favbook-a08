import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const uri =
  process.env.MONGODB_URI ||
  process.env.MONGODB_URL ||
  "mongodb+srv://book-admin:ViwhhsBSIAx2WgtW@cluster0.evzoqt4.mongodb.net/booknook?retryWrites=true&w=majority";

const clientOptions = {
  tlsAllowInvalidCertificates: true,
  serverSelectionTimeoutMS: 5000,
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
  secret: process.env.BETTER_AUTH_SECRET || process.env.JWT_SECRET || "0Lx2fNw6YORQP4JEtzTaqkvquOBYtfy9",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
});
