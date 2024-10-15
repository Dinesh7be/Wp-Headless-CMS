import { gql } from '@apollo/client';
import client from './apollo-client'; // Import your Apollo client

// GraphQL query for fetching page data by slug
const GET_PAGE_BY_SLUG = gql`
  query GET_PAGE_BY_SLUG($slug: String!) {
    pageBy(uri: $slug) {
      title
      content
    }
  }
`;

// A global function to fetch page data by slug
export async function fetchPageData(slug) {
  // Ensure slug is an array and construct the URI
  const uri = slug.length > 0 ? `/${slug.join('/')}` : null;

  // Prevent access to /home and return 404
  if (uri === '/home') {
    return { notFound: true };
  }

  try {
    const { data } = await client.query({
      query: GET_PAGE_BY_SLUG,
      variables: { slug: uri },
    });

    // Check if the data contains the page
    if (!data || !data.pageBy) {
      return { notFound: true }; // Return 404 if page not found
    }

    // Return the fetched data
    return {
      props: { data },
    };
  } catch (error) {
    console.error('Error fetching page data:', error);
    return { notFound: true }; // Return 404 on error
  }
}
