import { Button } from "../../../../components/ui/button";

const steps = [
  { number: "01", label: "Check Eligibility" },
  { number: "02", label: "Compare Offers" },
  { number: "03", label: "Submit Application" },
  { number: "04", label: "Get Instant Approval" },
];

/* Icon shapes matching Figma exactly — square with rounded corners, thin outline */
const icons = {
  home: (
    <svg width="22" height="22" fill="none" stroke="#6B8CAE" strokeWidth="1.5" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M3 9.5L12 3l9 6.5V21H3V9.5z" />
      <rect x="9" y="13" width="6" height="8" rx="1" />
    </svg>
  ),
  briefcase: (
    <svg width="22" height="22" fill="none" stroke="#6B8CAE" strokeWidth="1.5" viewBox="0 0 24 24">
      <rect x="2" y="9" width="20" height="12" rx="2" />
      <path d="M16 9V7a4 4 0 0 0-8 0v2" strokeLinejoin="round" />
      <line x1="12" y1="13" x2="12" y2="17" />
    </svg>
  ),
  people: (
    <svg width="22" height="22" fill="none" stroke="#6B8CAE" strokeWidth="1.5" viewBox="0 0 24 24">
      <circle cx="8" cy="7" r="3.5" />
      <path d="M1 21c0-3.5 3-6 7-6" strokeLinecap="round" />
      <circle cx="17" cy="8" r="2.5" />
      <path d="M22 21c0-2.5-2-4.5-5-4.5" strokeLinecap="round" />
    </svg>
  ),
  card: (
    <svg width="22" height="22" fill="none" stroke="#6B8CAE" strokeWidth="1.5" viewBox="0 0 24 24">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" strokeLinecap="round" />
    </svg>
  ),
  person: (
    <svg width="22" height="22" fill="none" stroke="#6B8CAE" strokeWidth="1.5" viewBox="0 0 24 24">
      <circle cx="12" cy="7" r="4" />
      <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
    </svg>
  ),
  link: (
    <svg width="22" height="22" fill="none" stroke="#6B8CAE" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" strokeLinecap="round" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" strokeLinecap="round" />
    </svg>
  ),
};

const IconBubble = ({ icon, style }: { icon: keyof typeof icons; style: React.CSSProperties }) => (
  <div
    className="absolute w-12 h-12 rounded-full bg-white flex items-center justify-center z-20"
    style={{ border: "1px solid #D4DDE8", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", ...style }}
  >
    {icons[icon]}
  </div>
);

export const LoanJourneySection = (): JSX.Element => {
  return (
    <section className="w-full bg-white" style={{ paddingTop: "80px", paddingBottom: "80px" }}>

      {/* Heading — above banner */}
      <div className="text-center mb-14 px-4">
        <h2
          className="font-normal text-[#273240]"
          style={{
            fontFamily: "'Power Grotesk', 'Power_Grotesk-Regular', Helvetica, sans-serif",
            fontSize: "clamp(2.5rem, 5vw, 64px)",
            lineHeight: "1.2",
          }}
        >
          Simple Steps to Start With
        </h2>
      </div>

      {/* Wrapper with relative positioning for icon bubbles */}
      <div className="relative max-w-[1200px] mx-auto px-6 lg:px-8">

        {/* ── Floating icon bubbles ── */}
        {/* Top-left: home */}
        <IconBubble icon="home"   style={{ top: "-24px",  left: "24px" }} />
        {/* Top-center: briefcase — sits on top edge of the dark banner */}
        <IconBubble icon="briefcase" style={{ top: "44px", left: "50%", transform: "translateX(-50%)" }} />
        {/* Top-right: people */}
        <IconBubble icon="people" style={{ top: "-24px",  right: "24px" }} />
        {/* Bottom-left: credit card */}
        <IconBubble icon="card"   style={{ bottom: "-52px", left: "24px" }} />
        {/* Bottom-center: person — sits on bottom edge of the dark banner */}
        <IconBubble icon="person" style={{ bottom: "-16px", left: "50%", transform: "translateX(-50%)" }} />
        {/* Bottom-right: link */}
        <IconBubble icon="link"   style={{ bottom: "-52px", right: "24px" }} />
        {/* Right-edge overlapping: a 7th gear-style icon */}
        <IconBubble icon="briefcase" style={{ top: "50%", right: "-24px", transform: "translateY(-50%)" }} />

        {/* Dark navy steps banner */}
        <div
          className="w-full relative z-10"
          style={{
            background: "#0E396D",
            borderTop: "1px solid #E4E4E4",
            borderBottom: "1px solid #E4E4E4",
          }}
        >
          {/* Inner flex — centered, gap between items */}
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-stretch">
                {/* Step content */}
                <div
                  className="flex flex-col items-start justify-center"
                  style={{ padding: "52px 48px", gap: "20px", width: "240px" }}
                >
                  <div
                    style={{
                      fontFamily: "'Power Grotesk', 'Power_Grotesk-Regular', Helvetica, sans-serif",
                      fontWeight: 400,
                      fontSize: "64px",
                      lineHeight: "76.8px",
                      color: "#FFFFFF",
                    }}
                  >
                    {step.number}
                  </div>
                  <div
                    style={{
                      fontFamily: "'DM Sans', Helvetica, sans-serif",
                      fontWeight: 500,
                      fontSize: "20px",
                      lineHeight: "20.8px",
                      letterSpacing: "-0.02em",
                      color: "#A4CDFF",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {step.label}
                  </div>
                </div>

                {/* Vertical divider between steps */}
                {index < steps.length - 1 && (
                  <div
                    style={{
                      width: "1px",
                      alignSelf: "stretch",
                      background: "#E4E4E4",
                      opacity: 0.4,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* CTA button — below banner */}
      <div className="flex justify-center mt-16 px-4">
        <Button
          className="h-auto text-white font-bold rounded"
          style={{
            fontFamily: "'DM Sans', Helvetica, sans-serif",
            fontSize: "14px",
            padding: "16px 36px",
            background: "#0877ff",
            boxShadow: "0px 4px 11.8px -5px #0050b2",
            letterSpacing: "0.05em",
          }}
        >
          START YOUR APPLICATION
        </Button>
      </div>

    </section>
  );
};
