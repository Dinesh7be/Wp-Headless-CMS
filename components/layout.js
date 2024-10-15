import Header from './header';
import Footer from './footer';

export default function Layout({ children, pageTitle, headerData, footerData }) {
  return (
    <div>
      <Header menuData={headerData} />
      <main>
        <h1>{pageTitle}</h1> {/* Display the page title here */}
        {children}
      </main>
      <Footer footerData={footerData} />
    </div>
  );
}
