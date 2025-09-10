import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import fetch from "cross-fetch";

export default function getServerClient() {
  return new ApolloClient({
    ssrMode: true,
    link: new HttpLink({
      uri:
        process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ||
        "http://localhost:4000/graphql",
      fetch,
    }),
    cache: new InMemoryCache(),
  });
}
