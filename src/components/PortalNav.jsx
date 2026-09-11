import { Link } from "react-router-dom";

/*
 * Sub-navigation inside the public portal (Boards / Roadmap / Changelog),
 * scoped to /p/:workspaceSlug/... — distinct from the staff Header tabs,
 * which point at the protected fidmap.com/roadmap etc.
 */
const PortalNav = ({ workspaceSlug, active }) => {
  const tabs = [
    ["boards", "Boards", `/p/${workspaceSlug}`],
    ["roadmap", "Roadmap", `/p/${workspaceSlug}/roadmap`],
    ["changelog", "Changelog", `/p/${workspaceSlug}/changelog`],
  ];

  return (
    <nav className="fm-portal-nav" aria-label="Workspace portal">
      {tabs.map(([key, label, path]) => (
        <Link
          key={key}
          to={path}
          className={`fm-portal-nav-link${active === key ? " active" : ""}`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
};

export default PortalNav;
