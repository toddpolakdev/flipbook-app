import { ApolloServer } from "apollo-server-micro";
// import microCors from "micro-cors";
const microCors = require("micro-cors");
import type { IncomingMessage, ServerResponse } from "http";
import { typeDefs } from "./schema.ts";
import { resolvers } from "./resolvers.ts";
import { connectDB } from "./db.ts";
import "dotenv/config";

const cors = microCors({
  origin: "http://localhost:3000",
  allowCredentials: true,
  allowMethods: ["GET", "POST", "OPTIONS"],
});
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async () => {
    await connectDB();
    return {};
  },
});

const start = server.start();

const handler = async (req: IncomingMessage, res: ServerResponse) => {
  if (req.method === "OPTIONS") {
    res.end();
    return;
  }
  await start;
  // @ts-ignore - apollo-server-micro handler typings
  return server.createHandler({ path: "/graphql" })(req, res);
};

const corsed = cors(handler);

const port = process.env.PORT ? Number(process.env.PORT) : 4000;

// Simple Node server (micro-style)
import http from "http";
http.createServer(corsed).listen(port, () => {
  console.log(`\nAPI ready on http://localhost:${port}/graphql`);
});
