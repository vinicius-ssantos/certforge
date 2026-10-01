import { useEffect, useRef, type RefObject } from "react";
import { NavLink, Outlet, useLocation } from "react-router";
import { useAuth } from "../auth/AuthContext";

/**
 * Moves keyboard and screen-reader focus to the new page's heading after a navigation. In a single
 * page application the browser does not do this, so without it focus would stay on a link that no
 * longer exists and a screen reader would say nothing about the new page.
 */
function useRouteFocus(mainRef: RefObject<HTMLElement | null>) {
  const { pathname } = useLocation();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const heading = mainRef.current?.querySelector<HTMLElement>("h1");
    if (heading) {
      heading.tabIndex = -1;
      heading.focus();
    }
  }, [pathname, mainRef]);
}

export function Layout() {
  const mainRef = useRef<HTMLElement>(null);
  const { state, logout } = useAuth();
  useRouteFocus(mainRef);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <header className="site-header">
        <div className="bar">
          <span className="brand">CertForge</span>
          {state.status === "authenticated" ? (
            <nav aria-label="Main">
              <NavLink to="/" end>
                Tracks
              </NavLink>
              <NavLink to="/progress">Progress</NavLink>
              <NavLink to="/history">History</NavLink>
              <button type="button" className="link-button" onClick={() => void logout()}>
                Sign out
              </button>
            </nav>
          ) : null}
        </div>
      </header>
      <main id="main" ref={mainRef} tabIndex={-1}>
        <Outlet />
      </main>
    </>
  );
}
