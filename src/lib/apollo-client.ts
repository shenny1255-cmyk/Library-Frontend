import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

// Endpoint GraphQL thật, cấu hình qua .env.local (NEXT_PUBLIC_GRAPHQL_API_URL).
const GRAPHQL_API_URL = process.env.NEXT_PUBLIC_GRAPHQL_API_URL ?? "http://localhost:4000/graphql";

export function makeApolloClient() {
  return new ApolloClient({
    link: new HttpLink({ uri: GRAPHQL_API_URL }),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: { fetchPolicy: "cache-and-network" },
    },
  });
}