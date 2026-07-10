import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  ClockIcon,
  LinkedinIcon,
  TwitterIcon,
  FacebookIcon,
  InstagramIcon,
  CheckIcon,
  MessageCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ShieldCheckIcon,
} from "lucide-react";

// ── Premium design system SVG components ──────────────────────────────────────

const TunnelGrid = ({ color = "rgba(255,255,255,0.18)" }: { color?: string }) => {
  const W = 1440, H = 900, vx = W / 2, vy = H / 2, wallT = 0.30;
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

const RoomGrid = ({ color = "rgba(180,210,240,0.30)" }: { color?: string }) => {
  const W = 1440, H = 900, fw = W * 0.45, fh = H * 0.45;
  const fx = (W - fw) / 2, fy = (H - fh) / 2, fx2 = fx + fw, fy2 = fy + fh, n = 10;
  const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    lines.push({ x1: W * t, y1: 0, x2: fx + fw * t, y2: fy });
    lines.push({ x1: W * t, y1: H, x2: fx + fw * t, y2: fy2 });
    lines.push({ x1: 0, y1: H * t, x2: fx, y2: fy + fh * t });
    lines.push({ x1: W, y1: H * t, x2: fx2, y2: fy + fh * t });
  }
  for (let i = 1; i < n; i++) {
    const t = i / n;
    lines.push({ x1: fx * t, y1: fy * t, x2: W - fx * t, y2: fy * t });
    lines.push({ x1: fx * t, y1: H - fy * t, x2: W - fx * t, y2: H - fy * t });
    lines.push({ x1: fx * t, y1: fy * t, x2: fx * t, y2: H - fy * t });
    lines.push({ x1: W - fx * t, y1: fy * t, x2: W - fx * t, y2: H - fy * t });
    lines.push({ x1: fx + fw * t, y1: fy, x2: fx + fw * t, y2: fy2 });
    lines.push({ x1: fx, y1: fy + fh * t, x2: fx2, y2: fy + fh * t });
  }
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        {lines.map((l, i) => <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={color} strokeWidth="0.7" />)}
        <rect x={fx} y={fy} width={fw} height={fh} fill="none" stroke={color} strokeWidth="0.7" />
      </svg>
    </div>
  );
};

// ── Data ───────────────────────────────────────────────────────────────────────

const officeLocation = {
  city: "Jayanagar, Bangalore",
  address: "Accrefin Office, 3rd Floor, 10th Main, 4th Block, Jayanagar, Bangalore - 560069",
  phone: "+91 80 4567 8900",
  email: "bangalore@accrefin.com",
  timing: "Mon-Fri: 9:30 AM - 6:30 PM",
};

const heroStats = [
  { value: "< 2 Hr", label: "Response", sub: "Fast support" },
  { value: "Expert", label: "Advisors", sub: "Dedicated team" },
  { value: "4.8/5", label: "Rated", sub: "Customer satisfaction" },
  { value: "Free", label: "Service", sub: "Zero cost" },
];

const contactMethods = [
  {
    icon: <PhoneIcon className="w-7 h-7 text-[#0050B2]" />,
    bg: "bg-blue-50",
    title: "Call Us",
    desc: "Our team is available to assist you",
    primary: "1800-XXX-XXXX",
    href: "tel:1800XXXXXXX",
    sub: "Mon-Sat: 8 AM – 8 PM",
  },
  {
    icon: <MailIcon className="w-7 h-7 text-emerald-600" />,
    bg: "bg-emerald-50",
    title: "Email Us",
    desc: "Send us your queries anytime",
    primary: "info@accrefin.com",
    href: "mailto:info@accrefin.com",
    sub: "24/7 Email Support",
  },
  {
    icon: <MessageCircleIcon className="w-7 h-7 text-violet-600" />,
    bg: "bg-violet-50",
    title: "Live Chat",
    desc: "Chat with us in real-time",
    primary: "Start a Chat",
    href: "#chat",
    sub: "Mon-Fri: 9 AM – 7 PM",
  },
  {
    icon: <MapPinIcon className="w-7 h-7 text-orange-600" />,
    bg: "bg-orange-50",
    title: "Visit Our Office",
    desc: "Come meet us in Bangalore",
    primary: "Jayanagar, Bangalore",
    href: "#office",
    sub: "Mon-Fri: 9:30 AM – 6:30 PM",
  },
];

const contactCategories = [
  {
    title: "Customer Support",
    description: "For existing customers with loan queries",
    phone: "1800-XXX-XXXX",
    email: "support@accrefin.com",
    timing: "8 AM – 8 PM (All days)",
  },
  {
    title: "New Business",
    description: "For new loan inquiries and applications",
    phone: "1800-XXX-YYYY",
    email: "sales@accrefin.com",
    timing: "9 AM – 7 PM (Mon-Sat)",
  },
  {
    title: "Partner Relations",
    description: "For DSA and partner queries",
    phone: "1800-XXX-ZZZZ",
    email: "partners@accrefin.com",
    timing: "9:30 AM – 6:30 PM (Mon-Fri)",
  },
];

const faqs = [
  {
    question: "How can I check my loan application status?",
    answer:
      "You can check your loan application status by logging into your account on our website or mobile app. Alternatively, you can call our customer support at 1800-XXX-XXXX.",
  },
  {
    question: "I have a complaint about my loan. Who should I contact?",
    answer:
      "For any complaints, please email us at grievance@accrefin.com with your loan details. Our dedicated grievance team will respond within 24-48 hours.",
  },
  {
    question: "How can I become a partner with Accrefin?",
    answer:
      "To become a partner, visit our 'Partner With Us' page or email partners@accrefin.com. Our partnership team will guide you through the onboarding process.",
  },
];

// ── Component ──────────────────────────────────────────────────────────────────

export const ContactUsPage = (): JSX.Element => {
  const headingFont = "font-['Power_Grotesk',_'DM_Sans',_sans-serif]";
  const bodyFont = "font-['DM_Sans',_sans-serif]";

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    }, 3000);
  };

  return (
    <div className={`min-h-screen bg-white ${bodyFont}`}>

      {/* ── HERO ── */}
      <section className="bg-white relative overflow-hidden py-28">
        <RoomGrid />

        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          {/* Shield badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 bg-[#e8f0fb] border border-[#c5d8f5] text-[#0050B2] text-sm font-semibold px-4 py-2 rounded-full">
              <ShieldCheckIcon className="w-4 h-4" />
              India's most trusted loan platform
            </div>
          </div>

          {/* Title */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center pb-14">
            <div>
              {/* Breadcrumb */}
              <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-5">
                <a href="/" className="hover:text-[#0050B2] transition-colors">Home</a>
                <span>/</span>
                <span className="text-gray-800 font-medium">Contact Us</span>
              </nav>
              <h1 className={`${headingFont} text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-gray-900`}>
                Get in Touch /{" "}
                <span className="text-[#0050B2]">With Our Experts</span>
              </h1>
            </div>
            <div>
              <p className="text-xl text-gray-500 leading-relaxed">
                We're here to help with any questions about our loans, services, or partnership
                opportunities. Reach out through any of the channels below.
              </p>
            </div>
          </div>
        </div>

        {/* Trust bar */}
        <div className="bg-[#0e396d] mt-10 py-5">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center text-white">
              {heroStats.map((s, i) => (
                <div key={i}>
                  <p className={`${headingFont} text-2xl font-bold`}>{s.value} <span className="text-blue-300">{s.label}</span></p>
                  <p className="text-blue-200 text-sm mt-0.5">{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT METHOD CARDS ── */}
      <section className="py-16 bg-[#f4f9ff]">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-10">
            <h2 className={`${headingFont} text-3xl font-bold text-gray-900 mb-3`}>How Would You Like to Reach Us?</h2>
            <p className="text-gray-500">Multiple ways to connect — choose what works best for you.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((m, i) => (
              <Card
                key={i}
                className="group bg-white border border-gray-100 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 rounded-2xl"
              >
                <CardContent className="p-7 text-center">
                  <div className={`w-14 h-14 ${m.bg} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {m.icon}
                  </div>
                  <h3 className={`${headingFont} text-lg font-bold text-gray-900 mb-1`}>{m.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">{m.desc}</p>
                  <a
                    href={m.href}
                    className="text-[#0050B2] font-semibold text-base hover:underline block mb-1"
                  >
                    {m.primary}
                  </a>
                  <p className="text-xs text-gray-400">{m.sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT FORM + SPECIALIZED SUPPORT ── */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

            {/* Left – Form */}
            <div>
              <h2 className={`${headingFont} text-3xl font-bold text-gray-900 mb-2`}>Send Us a Message</h2>
              <p className="text-gray-500 mb-7">
                Fill out the form below and our team will get back to you within 2 hours.
              </p>

              <Card className="border border-gray-100 shadow-md rounded-2xl overflow-hidden">
                <CardContent className="p-8">
                  {formSubmitted ? (
                    <div className="flex flex-col items-center justify-center py-10">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <CheckIcon className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className={`${headingFont} text-xl font-bold text-gray-900 mb-2`}>Message Sent!</h3>
                      <p className="text-gray-500 text-center">
                        Thank you for contacting us. We'll respond to your inquiry shortly.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                            Full Name <span className="text-red-500">*</span>
                          </label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your full name"
                            required
                            className="w-full border-gray-200 focus:border-[#0050B2] rounded-xl h-11"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                            Email Address <span className="text-red-500">*</span>
                          </label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Your email address"
                            required
                            className="w-full border-gray-200 focus:border-[#0050B2] rounded-xl h-11"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                            Phone Number
                          </label>
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Your phone number"
                            className="w-full border-gray-200 focus:border-[#0050B2] rounded-xl h-11"
                          />
                        </div>
                        <div>
                          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1.5">
                            Subject <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            className="w-full h-11 px-3 border border-gray-200 focus:border-[#0050B2] rounded-xl text-sm bg-white text-gray-800"
                          >
                            <option value="">Select a subject</option>
                            <option value="loan-inquiry">Loan Inquiry</option>
                            <option value="application-status">Application Status</option>
                            <option value="partnership">Partnership Opportunity</option>
                            <option value="feedback">Feedback</option>
                            <option value="complaint">Complaint</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">
                          Message <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows={5}
                          placeholder="How can we help you?"
                          required
                          className="w-full px-3 py-2.5 border border-gray-200 focus:border-[#0050B2] rounded-xl text-sm resize-none outline-none"
                        />
                      </div>

                      <div className="flex items-start gap-2.5">
                        <input
                          type="checkbox"
                          id="privacy"
                          className="w-4 h-4 mt-0.5 text-[#0050B2] rounded"
                          required
                        />
                        <label htmlFor="privacy" className="text-sm text-gray-500">
                          I agree to the{" "}
                          <a href="#" className="text-[#0050B2] hover:underline">Privacy Policy</a>{" "}
                          and consent to the processing of my data.
                        </label>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-[#0050B2] hover:bg-[#003d8a] text-white py-3 text-base font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Send Message
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right – Specialized Support */}
            <div>
              <h2 className={`${headingFont} text-3xl font-bold text-gray-900 mb-2`}>Specialized Support</h2>
              <p className="text-gray-500 mb-7">
                Contact our specialized teams for faster resolution of your queries.
              </p>

              <div className="space-y-5">
                {contactCategories.map((category, index) => (
                  <Card
                    key={index}
                    className="border border-gray-100 hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className={`${headingFont} text-lg font-bold text-gray-900`}>{category.title}</h3>
                          <p className="text-sm text-gray-500 mt-0.5">{category.description}</p>
                        </div>
                        <span className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0" title="Available" />
                      </div>
                      <div className="space-y-2.5 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-3">
                          <PhoneIcon className="w-4 h-4 text-[#0050B2] flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{category.phone}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <MailIcon className="w-4 h-4 text-[#0050B2] flex-shrink-0" />
                          <a href={`mailto:${category.email}`} className="text-[#0050B2] hover:underline text-sm">
                            {category.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-3">
                          <ClockIcon className="w-4 h-4 text-[#0050B2] flex-shrink-0" />
                          <span className="text-gray-500 text-sm">{category.timing}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Office card */}
                <Card className="border border-gray-100 rounded-2xl overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MapPinIcon className="w-5 h-5 text-[#0050B2]" />
                      </div>
                      <div>
                        <h3 className={`${headingFont} text-base font-bold text-gray-900 mb-1`}>{officeLocation.city}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">{officeLocation.address}</p>
                        <p className="text-sm text-gray-400 mt-1">{officeLocation.timing}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQs ── */}
      <section className="py-20 bg-[#0e396d] relative overflow-hidden">
        <TunnelGrid />
        <div className="container mx-auto max-w-4xl px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className={`${headingFont} text-3xl lg:text-4xl font-bold text-white mb-3`}>
              Frequently Asked Questions
            </h2>
            <p className="text-blue-200 text-lg">
              Quick answers to common contact-related questions
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <h3 className={`${headingFont} text-base font-semibold text-gray-900 pr-4`}>
                    {faq.question}
                  </h3>
                  {openFaq === index
                    ? <ChevronUpIcon className="w-5 h-5 text-[#0050B2] flex-shrink-0" />
                    : <ChevronDownIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  }
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOCIAL MEDIA ── */}
      <section className="py-14 bg-[#f4f9ff]">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-8">
            <h2 className={`${headingFont} text-2xl font-bold text-gray-900 mb-2`}>Connect With Us</h2>
            <p className="text-gray-500">Follow us on social media for updates and financial tips</p>
          </div>
          <div className="flex justify-center gap-5">
            {[
              { icon: <FacebookIcon className="w-5 h-5" />, name: "Facebook", color: "bg-blue-600", url: "https://facebook.com" },
              { icon: <TwitterIcon className="w-5 h-5" />, name: "Twitter", color: "bg-blue-400", url: "https://twitter.com" },
              { icon: <LinkedinIcon className="w-5 h-5" />, name: "LinkedIn", color: "bg-blue-700", url: "https://linkedin.com" },
              { icon: <InstagramIcon className="w-5 h-5" />, name: "Instagram", color: "bg-pink-600", url: "https://instagram.com" },
            ].map((s, i) => (
              <a
                key={i}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Follow us on ${s.name}`}
                className={`w-11 h-11 ${s.color} text-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform duration-300`}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 bg-[#0050B2] text-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className={`${headingFont} text-3xl lg:text-4xl font-bold mb-4`}>
              Ready to Get Started?
            </h2>
            <p className="text-blue-100 text-lg mb-8">
              Apply for a loan today or check your eligibility in minutes. It's free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-[#0050B2] hover:bg-gray-50 font-bold px-8 py-3 text-base rounded-xl shadow-lg transition-all duration-300">
                Apply for a Loan
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/10 font-bold px-8 py-3 text-base rounded-xl transition-all duration-300"
              >
                Check Eligibility
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
