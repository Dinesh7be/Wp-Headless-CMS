import { useQuery, gql } from '@apollo/client';
import Link from 'next/link';

const GET_FOOTER_MENUS = gql`
 query GET_FOOTER_MENUS {
  menus {
    edges {
      node {
        name
        menuItems {
          edges {
            node {
              id
              label
              parentId
              order
              target
              uri
            }
          }
        }
      }
    }
  }
}
`;

const GET_SITEINFO = gql`
query GET_SITEINFO {
  themeGeneralSettings {
    themeOptions {
      headerLogo {
        node {
          sourceUrl
          id
          altText
        }
      }
    }
  }
}
`;

const GET_COPYRIGHTCONTENT = gql`
  query GET_COPYRIGHTCONTENT {
    themeGeneralSettings {
      themeOptions {
        footerCopyrightContent
      }
    }
  }
`;

export default function Footer({ menuName = "footer menu,footer sub menu,OUR OTHER WEBSITES" }) {
  const { data, loading, error } = useQuery(GET_FOOTER_MENUS);
  const { data: siteInfoData, loading: siteInfoLoading, error: siteInfoError } = useQuery(GET_SITEINFO);
  const { data: copyrightData, loading: copyrightLoading, error: copyrightError } = useQuery(GET_COPYRIGHTCONTENT);

  if (loading || siteInfoLoading || copyrightLoading) return <p>Loading...</p>;
  if (error || siteInfoError || copyrightError)
    return <p>Error: {error?.message || siteInfoError?.message || copyrightError?.message}</p>;

  // Split menu names into an array
  const menuNames = menuName.split(',');

  // Function to sort menu items by their order
  const sortByOrder = (a, b) => a.node.order - b.node.order;

  // Function to render menu and submenus recursively
  const renderMenuItems = (items, parentId = null) => {
    const filteredItems = items
      .filter(({ node }) => node.parentId === parentId)
      .sort(sortByOrder);

    return (
      <ul className="space-x-4">
        {filteredItems.map(({ node }) => {
          // Check if the URI is an internal link (assuming internal links don't contain 'http')
          const isInternal = !/^https?:\/\//.test(node.uri);

          return (
            <li key={node.id} className="inline-block pl-6">
              {isInternal ? (
                // Internal links will use Next.js's Link component for client-side navigation
                <Link href={node.uri} className="text-gray-600 hover:text-orange-500">
                  {node.label || "Unnamed Menu Item"}
                </Link>
              ) : (
                // External links will open in a new tab with target="_blank"
                <Link
                  href={node.uri}
                  target={node.target || "_blank"}
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-orange-500"
                >
                  {node.label || "Unnamed Menu Item"}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  // Find the menus by their dynamic names
  const menus = menuNames.map(name => {
    return data?.menus?.edges?.find(({ node }) => node.name === name.trim())?.node;
  });

  // Extract header logo and general settings from siteInfoData
  const headerLogo = siteInfoData?.themeGeneralSettings?.themeOptions?.headerLogo?.node;
  const generalSettings = siteInfoData?.generalSettings;

  // Copyright Data
  const copyrightContent =
    copyrightData?.themeGeneralSettings?.themeOptions?.footerCopyrightContent;

  return (
    <footer className="site-footer" id="colophon">
      {/* Site Information - Logo and Title */}
      <div className="footer_logo mx-auto flex justify-center items-center space-x-4 mb-12">
        {headerLogo && (
          <Link href={generalSettings?.url || "#"}>
            <img src={headerLogo.sourceUrl} alt={headerLogo.altText} className="h-10" />
          </Link>
        )}
      </div>

      {/* Footer Links */}
      <div className="container mx-auto space-y-4 text-center">
        {/* Top Row Links */}
        <div className="space-x-6 pb-0.5">
          {menus[0] && <nav>{renderMenuItems(menus[0].menuItems.edges)}</nav>} 
        </div>

        {/* Second Row Links */}
        <div className="space-x-6 pb-0.5">
          {menus[1] && <nav>{renderMenuItems(menus[1].menuItems.edges)}</nav>}
        </div>

        {/* Third Row Links */}
        <div className="space-x-6 pb-0.5">
          {menus[2] && <nav>{renderMenuItems(menus[2].menuItems.edges)}</nav>}
        </div>
      </div>

      {/* Copyright Section */}
      <div className="copyright_section text-center text-gray-500 text-sm mt-6 border-t-2 py-6">
        <div
          dangerouslySetInnerHTML={{ __html: copyrightContent || 'No content available' }}
        />
      </div>
    </footer>
  );
}
