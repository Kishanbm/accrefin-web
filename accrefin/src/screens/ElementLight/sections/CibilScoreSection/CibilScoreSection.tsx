import { Button } from "../../../../components/ui/button";
import { Separator } from "../../../../components/ui/separator";

const features = [
  { title: "Free", description: "Credit score check" },
  { title: "Monthly", description: "Credit report updates" },
  { title: "Personalised", description: "Improvement recommendations" },
];

export const CibilScoreSection = (): JSX.Element => {
  return (
    <section id="cibil-section" className="w-full py-16 px-4" style={{ background: "#F4F9FF" }}>

      {/* Heading */}
      <div className="flex flex-col items-center gap-6 mb-12">
        <h2
          className="font-normal text-[#273240] text-center leading-none"
          style={{
            fontFamily: "'Power Grotesk', 'Plus Jakarta Sans', 'DM Sans', sans-serif",
            fontWeight: 400,
            fontSize: "clamp(2.5rem, 5vw, 64px)",
          }}
        >
          Know Your CIBIL Score Instantly
        </h2>
        <p
          className="text-center max-w-2xl"
          style={{
            fontFamily: "'DM Sans', Helvetica, sans-serif",
            fontWeight: 500,
            fontSize: "20px",
            lineHeight: "20.8px",
            letterSpacing: "-0.4px",
            color: "#4b5563",
          }}
        >
          Monitor your credit score for free and get personalized tips to
          improve your financial health
        </p>
      </div>

      {/* Features banner */}
      <div
        className="w-full border-t border-b border-[#e4e4e4] py-16"
        style={{ background: "#0050b2" }}
      >
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-0">
            {features.map((feature, index) => (
              <div key={`feature-${index}`} className="flex items-center">
                <div className="flex flex-col items-center justify-center gap-5 min-w-[190px] px-8">
                  <h3
                    className="font-normal text-white whitespace-nowrap"
                    style={{
                      fontFamily: "'Power Grotesk', 'Power_Grotesk-Regular', Helvetica, sans-serif",
                      fontSize: "48px",
                      lineHeight: "57.6px",
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="font-medium whitespace-nowrap text-center"
                    style={{
                      fontFamily: "'DM Sans', Helvetica, sans-serif",
                      fontSize: "20px",
                      lineHeight: "20.8px",
                      letterSpacing: "-0.4px",
                      color: "#a9cfff",
                    }}
                  >
                    {feature.description}
                  </p>
                </div>
                {index < features.length - 1 && (
                  <Separator
                    orientation="vertical"
                    className="hidden md:block h-[206px] w-px bg-white/20"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col items-center gap-6 mt-16">
        <Button
          className="h-auto px-9 py-4 rounded overflow-hidden text-white font-bold text-base"
          style={{
            fontFamily: "'DM Sans', Helvetica, sans-serif",
            background: "#0877ff",
            boxShadow: "0px 4px 11.8px -5px #0050b2",
            lineHeight: "20.8px",
          }}
        >
          CHECK YOUR SCORE NOW
        </Button>
        <div
          className="text-center underline cursor-pointer"
          style={{
            fontFamily: "'DM Sans', Helvetica, sans-serif",
            fontWeight: 500,
            fontSize: "20px",
            lineHeight: "20.8px",
            letterSpacing: "-0.4px",
            color: "#8b9899",
          }}
        >
          What&apos;s CIBIL score? Why does it matter?
        </div>
      </div>
    </section>
  );
};
