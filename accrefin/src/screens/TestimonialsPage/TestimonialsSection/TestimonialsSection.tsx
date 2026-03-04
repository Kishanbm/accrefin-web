import { Card, CardContent } from "../../../components/ui/card";
import { StarIcon } from "lucide-react";

const headingFont = "font-['Power_Grotesk',_'DM_Sans',_sans-serif]";
const bodyFont = "font-['DM_Sans',_sans-serif]";

const TunnelGrid = ({ color = "rgba(255,255,255,0.18)" }: { color?: string }) => {
  const W = 1440, H = 900;
  const vx = W / 2, vy = H / 2;
  const wallT = 0.30;
  const wallX = vx - vx * wallT, wallY = vy - vy * wallT;
  const wallW = W * wallT, wallH = H * wallT;
  const wallX2 = wallX + wallW, wallY2 = wallY + wallH;
  const numFan = 16;
  const fanLines: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let i = 0; i <= numFan; i++) {
    const t = i / numFan;
    fanLines.push({ x1: W * t, y1: 0, x2: wallX + wallW * t, y2: wallY });
    fanLines.push({ x1: W * t, y1: H, x2: wallX + wallW * t, y2: wallY2 });
    fanLines.push({ x1: 0, y1: H * t, x2: wallX, y2: wallY + wallH * t });
    fanLines.push({ x1: W, y1: H * t, x2: wallX2, y2: wallY + wallH * t });
  }
  const rings = [0.95, 0.82, 0.68, 0.54, 0.40, wallT].map(t => ({
    x: vx - vx * t, y: vy - vy * t, w: W * t, h: H * t,
  }));
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        {fanLines.map((l, i) => <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={color} strokeWidth="0.6" />)}
        {rings.map((r, i) => <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} fill="none" stroke={color} strokeWidth="0.6" />)}
      </svg>
    </div>
  );
};

const testimonials = [
  {
    rating: 5,
    feedback: "Accrefin made my home loan journey incredibly smooth. Got the best rate from HDFC Bank within 24 hours. Highly recommended!",
    name: "Priya Sharma",
    photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  },
  {
    rating: 5,
    feedback: "Quick personal loan approval for my business needs. The team was very professional and transparent about all the charges.",
    name: "Rajesh Kumar",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    rating: 5,
    feedback: "Excellent service! They helped me compare multiple offers and choose the best one. Saved me a lot of time and effort!",
    name: "Anita Patel",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  },
];

const stats = [
  { value: "25,000+", label: "Happy Customers" },
  { value: "98%", label: "Approval Rate" },
  { value: "4.9/5", label: "Customer Rating" },
  { value: "24hrs", label: "Average Processing" },
];

export const TestimonialsSection = (): JSX.Element => {
  return (
    <section className="w-full bg-gradient-to-b from-[#5B9FE9] to-[#4B8FD9] relative overflow-hidden">
      <TunnelGrid />
      <div className="py-20">
        <div className="container mx-auto max-w-7xl px-6 relative z-10">
          <div className="text-center mb-14">
            <h2 className={`text-3xl lg:text-5xl text-white mb-4 tracking-tight font-normal ${headingFont}`}>
              What Our Customers Say
            </h2>
            <p className={`text-lg text-white/80 max-w-2xl mx-auto font-medium ${bodyFont}`}>
              See how Accrefin has helped thousands of customers achieve their financial goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 justify-items-center">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gradient-to-b from-[#0e5aa0] to-[#083b6f] text-white shadow-lg transition-all duration-300 rounded-xl border-0">
                <CardContent className="p-8 flex flex-col items-center text-center gap-4">
                  <div className="flex items-center justify-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-white/30'}`} />
                    ))}
                  </div>
                  <p className={`text-white leading-relaxed text-sm ${bodyFont}`}>"{testimonial.feedback}"</p>
                  <div className="flex items-center gap-3 pt-2">
                    <img src={testimonial.photo} alt={testimonial.name} className="w-10 h-10 rounded-full object-cover border-2 border-white" />
                    <h4 className={`font-semibold text-white text-sm ${bodyFont}`}>{testimonial.name}</h4>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#0050B2] relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center py-10 px-4">
              <div className={`text-4xl lg:text-5xl font-extrabold text-white mb-2 ${bodyFont}`}>{stat.value}</div>
              <div className={`text-sm text-white/80 font-medium ${bodyFont}`}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
