import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export const GA_MEASUREMENT_ID =
  import.meta.env.VITE_GA_MEASUREMENT_ID || "G-C3T2CH3W2R";

/** Official GA4 bootstrap — put in <head> so the tag exists on first paint. */
export function GoogleAnalyticsHead() {
  const id = GA_MEASUREMENT_ID;
  if (!id) return null;

  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${id}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}');
          `.trim(),
        }}
      />
    </>
  );
}

/** Sends page_view on client-side navigations (SPA). */
export function GoogleAnalytics() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const search = useRouterState({ select: (s) => s.location.searchStr });

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || typeof window.gtag !== "function") return;
    const page_path = `${pathname}${search || ""}`;
    window.gtag("event", "page_view", {
      page_path,
      page_title: document.title,
      page_location: window.location.href,
    });
  }, [pathname, search]);

  return null;
}
