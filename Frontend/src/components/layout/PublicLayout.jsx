import { Layout } from "antd";
import PublicNavbar from "./PublicNavbar";
import PublicFooter from "./PublicFooter";

function PublicLayout({ children }) {
  return (
    <Layout>
      <PublicNavbar />

      <Layout.Content>
        {children}
      </Layout.Content>

      <PublicFooter />
    </Layout>
  );
}

export default PublicLayout;