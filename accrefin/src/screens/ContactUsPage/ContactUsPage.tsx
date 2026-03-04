import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { PhoneIcon, MailIcon, MapPinIcon, ClockIcon, BuildingIcon, LinkedinIcon, TwitterIcon, FacebookIcon, InstagramIcon, CheckIcon } from "lucide-react";

// Single office location
const officeLocation = {
  city: "Jayanagar, Bangalore",
  address: "Accrefin Office, 3rd Floor, 10th Main, 4th Block, Jayanagar, Bangalore - 560069",
  phone: "+91 80 4567 8900",
  email: "bangalore@accrefin.com",
  timing: "Mon-Fri: 9:30 AM - 6:30 PM"
};

export const ContactUsPage = (): JSX.Element => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, you would send the form data to a server
    console.log("Form submitted:", formData);
    setFormSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
    }, 3000);
  };

  // Contact categories
  const contactCategories = [
    {
      title: "Customer Support",
      description: "For existing customers with loan queries",
      phone: "1800-XXX-XXXX",
      email: "support@accrefin.com",
      timing: "8 AM - 8 PM (All days)"
    },
    {
      title: "New Business",
      description: "For new loan inquiries and applications",
      phone: "1800-XXX-YYYY",
      email: "sales@accrefin.com",
      timing: "9 AM - 7 PM (Mon-Sat)"
    },
    {
      title: "Partner Relations",
      description: "For DSA and partner queries",
      phone: "1800-XXX-ZZZZ",
      email: "partners@accrefin.com",
      timing: "9:30 AM - 6:30 PM (Mon-Fri)"
    }
  ];

  // FAQs
  const faqs = [
    {
      question: "How can I check my loan application status?",
      answer: "You can check your loan application status by logging into your account on our website or mobile app. Alternatively, you can call our customer support at 1800-XXX-XXXX."
    },
    {
      question: "I have a complaint about my loan. Who should I contact?",
      answer: "For any complaints, please email us at grievance@accrefin.com with your loan details. Our dedicated grievance team will respond within 24-48 hours."
    },
    {
      question: "How can I become a partner with Accrefin?",
      answer: "To become a partner, visit our 'Partner With Us' page or email partners@accrefin.com. Our partnership team will guide you through the onboarding process."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-16 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="contact-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0050B2" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#contact-grid)" />
          </svg>
        </div>

        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          {/* Breadcrumb */}
          <div className="mb-8">
            <nav className="flex items-center space-x-2 text-sm">
              <a href="/" className="text-blue-600 hover:text-blue-800 transition-colors">Home</a>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">Contact Us</span>
            </nav>
          </div>

          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
              <span className="text-gray-900">Get in </span>
              <span className="bg-gradient-to-r from-[#0050B2] to-[#003d8a] bg-clip-text text-transparent">
                Touch
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              We're here to help with any questions about our loans, services, or partnership opportunities. 
              Reach out to us through any of the channels below.
            </p>
          </div>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {/* Phone */}
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 bg-white">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <PhoneIcon className="w-8 h-8 text-[#0050B2]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Call Us</h3>
                <p className="text-gray-600 mb-4">Our team is available to assist you</p>
                <a href="tel:1800XXXXXXX" className="text-[#0050B2] font-semibold text-lg hover:underline">
                  1800-XXX-XXXX
                </a>
                <p className="text-sm text-gray-500 mt-2">Mon-Sat: 8 AM - 8 PM</p>
              </CardContent>
            </Card>

            {/* Email */}
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 bg-white">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <MailIcon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Email Us</h3>
                <p className="text-gray-600 mb-4">Send us your queries anytime</p>
                <a href="mailto:info@accrefin.com" className="text-[#0050B2] font-semibold text-lg hover:underline">
                  info@accrefin.com
                </a>
                <p className="text-sm text-gray-500 mt-2">24/7 Email Support</p>
              </CardContent>
            </Card>

            {/* Visit */}
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 bg-white">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <MapPinIcon className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Visit Our Office</h3>
                <p className="text-gray-600 mb-4">Come to our office in Bangalore</p>
                <span className="text-[#0050B2] font-semibold text-lg">
                  Jayanagar, Bangalore
                </span>
                <p className="text-sm text-gray-500 mt-2">See details below</p>
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 bg-white">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <ClockIcon className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Business Hours</h3>
                <p className="text-gray-600 mb-4">When you can reach us</p>
                <div className="text-[#0050B2] font-semibold text-lg">
                  Mon-Fri: 9:30 AM - 6:30 PM
                </div>
                <p className="text-sm text-gray-500 mt-2">Sat: 10 AM - 4 PM</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Side - Contact Form */}
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Send Us a Message</h2>
                <p className="text-gray-600">
                  Fill out the form below and our team will get back to you within 24 hours.
                </p>
              </div>

              <Card className="border border-gray-200">
                <CardContent className="p-6">
                  {formSubmitted ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <CheckIcon className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                      <p className="text-gray-600 text-center">
                        Thank you for contacting us. We'll respond to your inquiry shortly.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name*
                          </label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your full name"
                            required
                            className="w-full border-gray-300 focus:border-[#0050B2] rounded-lg"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address*
                          </label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Your email address"
                            required
                            className="w-full border-gray-300 focus:border-[#0050B2] rounded-lg"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                          </label>
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Your phone number"
                            className="w-full border-gray-300 focus:border-[#0050B2] rounded-lg"
                          />
                        </div>
                        <div>
                          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                            Subject*
                          </label>
                          <select
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            className="w-full h-10 px-3 border border-gray-300 focus:border-[#0050B2] rounded-lg"
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
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                          Message*
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows={5}
                          placeholder="How can we help you?"
                          required
                          className="w-full px-3 py-2 border border-gray-300 focus:border-[#0050B2] rounded-lg"
                        ></textarea>
                      </div>

                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="privacy" className="w-4 h-4 text-[#0050B2]" required />
                        <label htmlFor="privacy" className="text-sm text-gray-600">
                          I agree to the <a href="#" className="text-[#0050B2] hover:underline">Privacy Policy</a> and consent to the processing of my data.
                        </label>
                      </div>

                      <Button 
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#0050B2] to-[#003d8a] hover:from-[#003d8a] hover:to-[#002d66] text-white py-3 text-base font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Send Message
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Side - Contact Categories */}
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Specialized Support</h2>
                <p className="text-gray-600">
                  Contact our specialized teams for faster resolution of your queries.
                </p>
              </div>

              <div className="space-y-6">
                {contactCategories.map((category, index) => (
                  <Card key={index} className="border border-gray-200 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{category.title}</h3>
                      <p className="text-gray-600 mb-4">{category.description}</p>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <PhoneIcon className="w-5 h-5 text-[#0050B2]" />
                          <span className="text-gray-700">{category.phone}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <MailIcon className="w-5 h-5 text-[#0050B2]" />
                          <a href={`mailto:${category.email}`} className="text-[#0050B2] hover:underline">
                            {category.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-3">
                          <ClockIcon className="w-5 h-5 text-[#0050B2]" />
                          <span className="text-gray-700">{category.timing}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Locations Section */}

      {/* FAQs Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Quick answers to common contact-related questions
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-700">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Connect With Us
            </h2>
            <p className="text-xl text-gray-600">
              Follow us on social media for updates and financial tips
            </p>
          </div>

          <div className="flex justify-center space-x-6">
            {[
              { icon: <FacebookIcon className="w-6 h-6" />, name: "Facebook", color: "bg-blue-600", url: "https://facebook.com" },
              { icon: <TwitterIcon className="w-6 h-6" />, name: "Twitter", color: "bg-blue-400", url: "https://twitter.com" },
              { icon: <LinkedinIcon className="w-6 h-6" />, name: "LinkedIn", color: "bg-blue-700", url: "https://linkedin.com" },
              { icon: <InstagramIcon className="w-6 h-6" />, name: "Instagram", color: "bg-pink-600", url: "https://instagram.com" }
            ].map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-12 h-12 ${social.color} text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300`}
                aria-label={`Follow us on ${social.name}`}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#0050B2] to-[#01387D] text-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Apply for a loan today or check your eligibility in minutes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-white text-[#0050B2] hover:bg-gray-100 font-semibold px-8 py-3 text-lg rounded-xl transition-all duration-300"
              >
                Apply for a Loan
              </Button>
              
              <Button 
                variant="outline"
                className="bg-white text-[#0050B2] hover:bg-gray-100 font-semibold px-8 py-3 text-lg rounded-xl transition-all duration-300"
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