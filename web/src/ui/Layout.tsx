import { useEffect, useRef, useState, type RefObject } from "react";
import { NavLink, Outlet, useLocation } from "react-router";
import { useAuth } from "../auth/AuthContext";
import { LanguageSwitcher } from "../i18n/LanguageSwitcher";
import { useText } from "../i18n/useText";
import { useHasAny } from "../auth/permissions";

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
    // A page that has already placed focus somewhere inside itself (a confirmation, say) keeps it.
    const active = document.activeElement;
    if (active && active !== document.body && mainRef.current?.contains(active)) {
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
  const [leaving, setLeaving] = useState(false);
  const [failed, setFailed] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const t = useText();
  const { state, logout } = useAuth();
  const editorial = useHasAny("CONTENT_AUTHOR", "CONTENT_REVIEW", "CONTENT_PUBLISH");
  useRouteFocus(mainRef);

  return (
    <>
      <a className="skip-link" href="#main">
        {t.layout.skipToMain}
      </a>
      <header className="site-header">
        <div className="bar">
          <span className="brand">{t.layout.brand}</span>
          {state.status === "authenticated" ? (
            <nav aria-label={t.layout.mainNavigation}>
              <NavLink to="/" end>
                {t.layout.tracks}
              </NavLink>
              <NavLink to="/interviews">{t.layout.interviews}</NavLink>
              <NavLink to="/review">{t.layout.review}</NavLink>
              <NavLink to="/progress">{t.layout.progress}</NavLink>
              <NavLink to="/history">{t.layout.history}</NavLink>
              {editorial ? <NavLink to="/editorial">{t.layout.editorial}</NavLink> : null}
              {/*
                * A failed sign-out used to be silent: `void logout()` dropped the rejection, the
                * session stayed, and nothing on screen changed -- so on a shared machine someone
                * could believe they had signed out of an account that was still open. Busy
                * while it is in flight, because two clicks sent two requests.
                */}
              <button
                type="button"
                className="link-button"
                disabled={leaving}
                onClick={() => {
                  setLeaving(true);
                  setFailed(false);
                  logout()
                    .catch(() => setFailed(true))
                    .finally(() => setLeaving(false));
                }}
              >
                {leaving ? t.layout.signingOut : t.layout.signOut}
              </button>
            </nav>
          ) : null}
          <LanguageSwitcher />
        </div>
        {failed ? (
          <p role="alert" className="header-alert">
            {t.layout.signOutFailed}
          </p>
        ) : null}
      </header>
      <main id="main" ref={mainRef} tabIndex={-1}>
        <Outlet />
      </main>
    </>
  );
}
