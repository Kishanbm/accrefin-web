import { useEffect, useRef } from "react";

export const BEEHIIV_FORM_ID = "1ca212a7-bffb-49b5-8be9-0b6c6bafff81";

const BEEHIIV_ORIGIN = "https://subscribe-forms.beehiiv.com";

type BeehiivSubscribeFormProps = {
  className?: string;
  id?: string;
};

/** Beehiiv embed — email tracking only (no in-app redirect). */
export function BeehiivSubscribeForm({
  className,
  id = "subscribe",
}: BeehiivSubscribeFormProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    let lastViewportWidth = window.innerWidth;

    const applySize = (width?: number | string, height?: number | string) => {
      const wrapper = wrapperRef.current;
      const h = typeof height === "string" ? parseFloat(height) : height;
      const w = typeof width === "string" ? parseFloat(width) : width;

      if (typeof h === "number" && h > 0) {
        iframe.style.height = `${h}px`;
        if (wrapper) wrapper.style.height = `${h}px`;
      }
      if (typeof w === "number" && w > 0) {
        iframe.style.width = `${w}px`;
      }
      if (wrapper) wrapper.style.overflow = "hidden";
    };

    const requestResize = () => {
      iframe.removeAttribute("data-bhv-sized");
      iframe.style.height = "2000px";
      iframe.style.width = "450px";
      if (wrapperRef.current) wrapperRef.current.style.height = "72px";
      iframe.contentWindow?.postMessage({ type: "beehiiv:resize" }, "*");
    };

    const onMessage = (event: MessageEvent) => {
      if (event.source !== iframe.contentWindow) return;
      if (event.origin !== BEEHIIV_ORIGIN) return;

      const msg = event.data;
      if (!msg || typeof msg !== "object" || typeof msg.type !== "string") return;

      switch (msg.type) {
        case "beehiiv:child-loaded":
          iframe.style.height = "2000px";
          iframe.style.width = "450px";
          if (wrapperRef.current) wrapperRef.current.style.height = "72px";
          requestAnimationFrame(() => {
            iframe.contentWindow?.postMessage({ type: "beehiiv:parent-loaded" }, "*");
          });
          break;
        case "beehiiv:styles":
          requestAnimationFrame(() => {
            applySize(msg.payload?.width, msg.payload?.height);
          });
          break;
        case "beehiiv:challenge":
          requestAnimationFrame(() => {
            applySize(msg.payload?.width, msg.payload?.height);
          });
          break;
        case "beehiiv:challenge-resolved":
          requestResize();
          break;
        case "beehiiv:redirect":
          if (typeof msg.url === "string") window.location.href = msg.url;
          break;
        default:
          break;
      }
    };

    const onViewportResize = () => {
      if (window.innerWidth === lastViewportWidth) return;
      lastViewportWidth = window.innerWidth;
      requestResize();
    };

    window.addEventListener("message", onMessage);
    window.addEventListener("resize", onViewportResize);
    return () => {
      window.removeEventListener("message", onMessage);
      window.removeEventListener("resize", onViewportResize);
    };
  }, []);

  const referrer =
    typeof window !== "undefined" ? encodeURIComponent(window.location.href) : "";
  const src = `${BEEHIIV_ORIGIN}/v3/forms/${BEEHIIV_FORM_ID}?layout=slim&referrer=${referrer}`;

  return (
    <div
      id={id}
      ref={wrapperRef}
      className={["beehiiv-subscribe", className].filter(Boolean).join(" ")}
    >
      <iframe
        ref={iframeRef}
        src={src}
        title="Subscribe to newsletter"
        frameBorder={0}
        scrolling="no"
        className="beehiiv-subscribe-iframe"
      />
    </div>
  );
}
