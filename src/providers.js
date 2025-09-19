// 'use client';
// import {
//   ApolloClient,
//   InMemoryCache,
//   HttpLink,

// } from '@apollo/client';
// import { ApolloProvider } from '@apollo/client/react';
// export const client = new ApolloClient({
//   cache: new InMemoryCache(),
//   link: new HttpLink({
//     uri: 'http://localhost:4000/graphql',
//   }),
// });

// export function ApolloWrapper({ children }) {
//   return <ApolloProvider client={client}>{children}</ApolloProvider>;
// }
'use client';
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';


const authLink = new ApolloLink((operation, forward) => {
  const token = typeof window !== 'undefined'
    ? window.localStorage.getItem('token')
    : null;
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }));
  return forward(operation);
});

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
});

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

export function ApolloWrapper({ children }) {
  return <ApolloProvider client={client}>

        {children}
  
    </ApolloProvider>;
}