// pages/_app.js
import { ApolloProvider } from '@apollo/client';
import client from '../lib/apollo-client'; // Import the Apollo client instance
import '../styles/global.css'; // Assuming you have global styles

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
