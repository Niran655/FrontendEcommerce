// lib/apolloClient.js
// import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from "@apollo/client";
const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql', // Replace with your Apollo Server URL
  cache: new InMemoryCache(),
});

export default client;