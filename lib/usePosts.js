import { useQuery, gql } from '@apollo/client';

const GET_POST_BY_SLUG = gql`
  query GetPostBySlug($slug: String!) {
    postBy(slug: $slug) {
      id
      date
      title
      content
      featuredImage {
        node {
          sourceUrl
        }
      }
      slug
      categories {
        nodes {
          name
          slug
        }
      }
    }
  }
`;

export const usePost = (slug) => {
  const { data, loading, error } = useQuery(GET_POST_BY_SLUG, {
    variables: { slug },
    fetchPolicy: 'no-cache', // Fetch fresh data each time
  });

  return {
    post: data?.postBy,
    loading,
    error,
  };
};
