import { useQuery, gql } from '@apollo/client';
import Link from 'next/link';

// GraphQL Queries
const GET_SITEINFO = gql`
  query GET_SITEINFO {
    generalSettings {
      url
    }
    themeGeneralSettings {
      themeOptions {
        headerLogo {
          node {
            altText
            sourceUrl
            id
          }
        }
      }
    }
  }
`;

const GET_MENUS = gql`
  query GET_MENUS {
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

// Header Component
const Header = ({ menuName = "primary-menu" }) => {
  const { data, loading, error } = useQuery(GET_MENUS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Find the menu by the dynamic name passed as a prop
  const menu = data?.menus?.edges?.find(({ node }) => node.name === menuName)?.node;

  if (!menu || !menu.menuItems) {
    return <p>No menu available</p>;
  }

  // Function to sort menu items by their order
  const sortByOrder = (a, b) => a.node.order - b.node.order;

  // Function to render menu and submenus recursively
  const renderMenuItems = (items, parentId = null) => {
    const filteredItems = items
      .filter(({ node }) => node.parentId === parentId)
      .sort(sortByOrder);

    return (
      <ul
        id="primary-menu"
        className={`flex ${
          parentId === null ? 'space-x-6' : 'absolute hidden group-hover:grid grid-cols-2 bg-white'
        }`}
      >
        {filteredItems.map(({ node }) => {
          const hasSubMenu = items.some(
            ({ node: childNode }) => childNode.parentId === node.id
          );

          return (
            <li key={node.id} className="relative group">
              <Link
                href={node.uri}
                target={node.target || "_self"} // Use target from node, default to "_self"
                className="hover:text-orange-500"
              >
                {node.label}
              </Link>
              {/* Only render submenu if there are child items */}
              {hasSubMenu && (
                <ul className="sub-menu absolute hidden group-hover:block bg-white">
                  {renderMenuItems(items, node.id)} {/* Render sub-menu if there are children */}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <nav className="header-right">
      {renderMenuItems(menu.menuItems.edges, null)} {/* Top-level menu items */}
    </nav>
  );
};

// SiteInfo Component
const SiteInfo = () => {
  const { loading, error, data } = useQuery(GET_SITEINFO);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Destructure the needed data
  const { generalSettings, themeGeneralSettings } = data;
  const siteLogo = themeGeneralSettings?.themeOptions?.headerLogo?.node;

  return (
    <div id="ct-logo" className="site-branding">
      <Link href="/">
        <img src={siteLogo?.sourceUrl} alt={siteLogo?.altText || 'Logo'} className="w-48 h-auto" />
      </Link>
    </div>
  );
};

// Combined Header Component
const CombinedHeader = () => (
  <header className="absolute w-full">
    <div className="container mx-auto flex items-center justify-between py-4">
      <SiteInfo />
      <Header />
    </div>
  </header>
);

export default CombinedHeader;
