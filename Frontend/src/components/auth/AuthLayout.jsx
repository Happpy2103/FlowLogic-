import { Link } from "react-router-dom";
import { ThunderboltOutlined } from "@ant-design/icons";
import ThemeToggle from "../layout/ThemeToggle";
import "./AuthLayout.css";

function AuthLayout({
  title,
  subtitle,
  footerText,
  footerLinkText,
  footerLinkTo,
  children,
}) {
  return (
    <div className="auth-page">
      <aside className="auth-brand">
        <div className="auth-brand-top">
          <div className="auth-brand-logo">
            <div className="auth-brand-icon">
              <ThunderboltOutlined />
            </div>
            <span className="auth-brand-name">FlowLogic</span>
          </div>

          <div>
            <h1 className="auth-brand-headline">
              Workflow management, simplified.
            </h1>
            <p className="auth-brand-desc">
              Design approvals, track submissions, and manage your team from one
              clean workspace.
            </p>
          </div>
        </div>

        <p className="auth-brand-footer">
          &copy; {new Date().getFullYear()} FlowLogic
        </p>
      </aside>

      <main className="auth-form-panel">
        <div className="auth-theme-toggle">
          <ThemeToggle collapsed />
        </div>

        <div className="auth-form-shell">
          <div className="auth-form-mobile-logo">
            <div className="auth-brand-icon">
              <ThunderboltOutlined />
            </div>
            <span className="auth-brand-name">FlowLogic</span>
          </div>

          <header className="auth-form-header">
            <h2 className="auth-form-title">{title}</h2>
            <p className="auth-form-subtitle">{subtitle}</p>
          </header>

          <div className="auth-form">{children}</div>

          {footerText && footerLinkText && footerLinkTo && (
            <p className="auth-form-footer">
              {footerText}
              <Link to={footerLinkTo}>{footerLinkText}</Link>
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

export default AuthLayout;
