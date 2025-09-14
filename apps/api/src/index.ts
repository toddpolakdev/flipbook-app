import { ApolloServer } from "apollo-server-micro";
import type { IncomingMessage, ServerResponse } from "http";
import { typeDefs } from "./schema.ts";
import { resolvers } from "./resolvers.ts";
import { connectDB } from "./db.ts";
import "dotenv/config";
import http from "http";

// Create Apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async () => {
    const db = await connectDB();
    return { db };
  },
});

// Start Apollo (async startup)
const startServer = server.start();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:4000",
  "http://10.0.0.25:3000",
  "https://studio.apollographql.com",
];

const handler = async (req: IncomingMessage, res: ServerResponse) => {
  await startServer;

  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    res.end();
    return;
  }

  // @ts-ignore
  return server.createHandler({ path: "/graphql", cors: false })(req, res);
};

// Start Node HTTP server
const port = process.env.PORT ? Number(process.env.PORT) : 4000;
http.createServer(handler).listen(port, "0.0.0.0", () => {
  console.log(`🚀 API ready at http://localhost:${port}/graphql`);
});
