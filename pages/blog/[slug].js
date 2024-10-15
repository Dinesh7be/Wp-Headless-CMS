// pages/blog/[slug].js
import { gql } from '@apollo/client';
import client from '../../lib/apollo-client';
import Link from 'next/link';
import Layout from '../../components/layout';

const Post = ({ post }) => {
  if (!post) {
    return <p className="text-center text-red-500">Post not found</p>;
  }

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Split layout for Image and Post Info */}
        <div className="flex flex-wrap md:flex-nowrap">
          {/* Left Side: Image */}
          {post.featuredImage ? (
            <div className="w-full md:w-1/2 mb-4 md:mb-0">
              <img
                src={post.featuredImage.node.sourceUrl}
                alt={post.title}
                className="w-full h-auto rounded-lg"
              />
            </div>
          ) : (
            <div className="w-full md:w-1/2 mb-4 md:mb-0">
              <img
                src="/path/to/placeholder-image.jpg"
                alt="Placeholder"
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}

          {/* Right Side: Title, Categories, Date */}
          <div className="w-full md:w-1/2 pl-4 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold text-blue-800">{post.title}</h1>
              <ul className="mt-2">
                {post.categories.nodes.map((category) => (
                  <li key={category.slug} className="text-blue-600 hover:underline text-sm">
                    <Link href={`/categories/${category.slug}`}>
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-gray-500">{formattedDate}</p>
          </div>
        </div>

        {/* Full-width Post Content */}
        <div className="mt-8">
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </div>

        {/* Back to Blog Link */}
        <div className="mt-4">
          <Link href="/blog">
            <a className="text-blue-600 hover:underline">← Back to blog</a>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Post;

export async function getServerSideProps({ params }) {
  try {
    const { data } = await client.query({
      query: gql`
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
      `,
      variables: {
        slug: params.slug,
      },
      fetchPolicy: 'no-cache', 
    });

    if (!data.postBy) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        post: data.postBy,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
