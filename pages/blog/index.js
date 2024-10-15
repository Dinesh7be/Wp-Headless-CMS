// pages/blog/index.js
import { gql } from '@apollo/client';
import client from '../../lib/apollo-client';
import Link from 'next/link';
import Layout from '../../components/layout';

export default function BlogIndex({ posts, totalPosts, currentPage }) {
  const postsPerPage = 10;
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  return (
    <Layout>
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">WordPress Posts</h1>
        {posts.length === 0 ? (
          <p className="text-gray-500">No posts available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div key={post.id} className="post overflow-hidden">
                {post.featuredImage ? (
                  <Link href={`/blog/${post.slug}`} aria-label={`Read more about ${post.title}`}>
                    <img
                      src={post.featuredImage.node.sourceUrl}
                      alt={post.title}
                      className="w-full h-auto object-cover"
                    />
                  </Link>
                ) : (
                  <img
                    src="/path/to/placeholder-image.jpg"
                    alt="Placeholder"
                    className="w-full h-auto object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
            <Link key={pageNumber} href={`/blog?currentPage=${pageNumber}`}>
              <button
                className={`mx-2 px-4 py-2 border rounded ${
                  currentPage === pageNumber
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {pageNumber}
              </button>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ query }) {
  const currentPage = parseInt(query.currentPage, 10) || 1;
  const postsPerPage = 10;

  // Fetch total posts first
  const totalPostsData = await client.query({
    query: gql`
      query {
        posts {
          nodes {
            id
          }
        }
      }
    `,
  });

  const totalPosts = totalPostsData.data.posts.nodes.length;

  // Fetch posts for the current page
  const { data } = await client.query({
    query: gql`
       query GetPosts($first: Int!) {
        posts(first: $first) {
          nodes {
            id
            title
            excerpt
            featuredImage {
              node {
                sourceUrl
              }
            }
            slug
            date
          }
        }
      }
    `,
    variables: {
      first: postsPerPage,
      after: (currentPage - 1) * postsPerPage,
    },
    fetchPolicy: 'no-cache', 
  });

  return {
    props: {
      posts: data.posts.nodes,
      totalPosts,
      currentPage,
    },
  };
}
