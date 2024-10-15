import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: `${process.env.NEXT_PUBLIC_WP_JSON_URL}/graphql`, // Correct GraphQL endpoint
  cache: new InMemoryCache(),
});

export default client;
