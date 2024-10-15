import { useQuery, gql } from '@apollo/client';

const GET_PAGE_BY_SLUG = gql`
  query GET_PAGE_BY_SLUG($slug: String!) {
    pageBy(uri: $slug) {
      title
      content
    }
  }
`;

export const usePageData = (slug) => {
  const { data, loading, error } = useQuery(GET_PAGE_BY_SLUG, {
    variables: { slug },
    fetchPolicy: 'no-cache', // Fetch fresh data each time
  });

  return {
    data,
    loading,
    error,
  };
};
