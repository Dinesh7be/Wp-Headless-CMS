import { gql } from '@apollo/client';
import client from '../lib/apollo-client'; // Import your Apollo client
import Layout from '../components/layout';

const GET_PAGE_BY_SLUG = gql`
  query GET_PAGE_BY_SLUG($slug: String!) {
    pageBy(uri: $slug) {
      title
      content
    }
  }
`;

const Page = ({ data, notFound }) => {
  if (notFound) {
    return <p>404 - Page Not Found</p>;
  }

  const { title, content } = data.pageBy;

  return (
    <Layout>
      <div>
        <h1>{title}</h1>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </Layout>
  );
};

export async function getServerSideProps({ params }) {
  const { slug } = params;
  const uri = slug ? `/${slug.join('/')}` : null;

  // Prevent access to /home and return a 404
  if (uri === '/home') {
    return {
      notFound: true,
    };
  }

  try {
    const { data } = await client.query({
      query: GET_PAGE_BY_SLUG,
      variables: { slug: uri },
        fetchPolicy: 'no-cache', 
    });

    if (!data || !data.pageBy) {
      return { notFound: true };
    }

    return {
      props: { data },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}

export default Page;
