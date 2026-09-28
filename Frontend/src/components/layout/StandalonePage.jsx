import ThemeToggle from "./ThemeToggle";
import "./standalone.css";

function StandalonePage({ children }) {
  return (
    <div className="standalone-page">
      <div className="standalone-page-toolbar">
        <ThemeToggle collapsed />
      </div>
      {children}
    </div>
  );
}

export default StandalonePage;
