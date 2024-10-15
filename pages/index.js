import { useEffect } from 'react';
import { usePageData } from '../lib/usePageData'; // Import your custom hook
import Layout from '../components/layout'; // Import your Layout component

// The Home component which will render the page
export default function Home() {
  const slug = '/home'; // The slug for the home page
  const { data, loading, error } = usePageData(slug);

  // Handle loading state
  if (loading) return <p>Loading...</p>;

  // Check if data is available and the page exists
  if (error || !data || !data.pageBy) {
    return <p>404 - Page Not Found</p>;
  }

  const { title, content } = data.pageBy; // Destructure the title and content from data

  return (
    <Layout>
      <div>
        <h1>{title}</h1> {/* Display the page title */}
        <div dangerouslySetInnerHTML={{ __html: content }} /> {/* Render the content */}
      </div>
    </Layout>
  );
}

// Server-side function to fetch data before rendering the page
export async function getServerSideProps() {
  const uri = '/home'; // The slug for the home page

  try {
    const { data } = await client.query({
      query: GET_PAGE_BY_SLUG,
      variables: { slug: uri },
      fetchPolicy: 'no-cache', // Ensure fresh data is fetched each time
    });

    return {
      props: { data }, // Return fetched data as props
    };
  } catch (error) {
    console.error('Error fetching home page data:', error); // Log the error
    return {
      props: { data: null }, // Return null on error
    };
  }
}
