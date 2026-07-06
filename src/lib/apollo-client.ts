import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";

const GRAPHQL_API_URL = process.env.NEXT_PUBLIC_GRAPHQL_API_URL ?? "http://localhost:4000/graphql";

export function makeApolloClient() {
  const httpLink = new HttpLink({ uri: GRAPHQL_API_URL });

  const authLink = new SetContextLink(function (prevContext) {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return {
      headers: {
        ...prevContext.headers,
        authorization: token ? "Bearer " + token : "",
      },
    };
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: { fetchPolicy: "cache-and-network" },
    },
  });
}