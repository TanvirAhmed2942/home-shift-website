import React, { useState } from "react";
import {
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  MessageSquare,
} from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { cn } from "../ui/utils";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    }, 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: [
        { label: "Main Office", value: "020 1234 5678" },
        { label: "Mobile", value: "07123 456 789" },
      ],
      gradient: "from-blue-500 to-cyan-500",
      action: "tel:02012345678",
    },
    {
      icon: Mail,
      title: "Email",
      details: [
        { label: "General Inquiries", value: "info@shiftmyhome.com" },
        { label: "Support", value: "support@shiftmyhome.com" },
      ],
      gradient: "from-purple-500 to-pink-500",
      action: "mailto:info@shiftmyhome.com",
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: [
        { label: "Mon - Sat", value: "7:00 AM - 8:00 PM" },
        { label: "Sunday", value: "9:00 AM - 6:00 PM" },
      ],
      gradient: "from-amber-500 to-orange-500",
      action: null,
    },
  ];

  return (
    <section
      id="contact"
      className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 px-6 py-3 rounded-full mb-6">
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <span className="text-blue-900 text-sm tracking-wider uppercase">
              Get In Touch
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Contact{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Our Team
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            We're here to help with any questions about our moving and courier
            services
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${info.gradient} flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform duration-300`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  {info.title}
                </h3>
                <div className="space-y-2">
                  {info.details.map((detail, dIndex) => (
                    <div key={dIndex}>
                      <p className="text-xs text-slate-500">{detail.label}</p>
                      <p className="text-sm text-slate-700 font-medium">
                        {detail.value}
                      </p>
                    </div>
                  ))}
                </div>
                {info.action && (
                  <Button
                    asChild
                    variant="ghost"
                    className={cn(
                      "mt-4 inline-flex items-center gap-2 text-sm font-semibold bg-gradient-to-r bg-clip-text text-transparent hover:opacity-70 transition-opacity p-0 h-auto",
                      `bg-gradient-to-r ${info.gradient}`
                    )}
                  >
                    <a href={info.action}>
                      {info.title === "Phone" && "Call Now →"}
                      {info.title === "Email" && "Send Email →"}
                    </a>
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">
              Send us a Message
            </h3>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">
                  Message Sent!
                </h4>
                <p className="text-slate-600 text-center">
                  Thank you for contacting us. We'll get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="name"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Your Name *
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="phone"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                      placeholder="07123 456 789"
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="subject"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Subject *
                  </Label>
                  <Select
                    value={formData.subject}
                    onValueChange={(value) => {
                      setFormData({ ...formData, subject: value });
                    }}
                    required
                  >
                    <SelectTrigger
                      id="subject"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    >
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quote">Request a Quote</SelectItem>
                      <SelectItem value="booking">Booking Inquiry</SelectItem>
                      <SelectItem value="support">Customer Support</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {/* Hidden input for form submission */}
                  <input
                    type="hidden"
                    name="subject"
                    value={formData.subject}
                  />
                </div>

                <div>
                  <Label
                    htmlFor="message"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Message *
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"
                    placeholder="Tell us about your moving needs..."
                  />
                </div>

                <Button
                  type="submit"
                  className={cn(
                    "w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 hover:scale-105 shadow-xl flex items-center justify-center gap-2",
                    "!bg-gradient-to-r hover:!bg-gradient-to-r cursor-pointer"
                  )}
                  style={{
                    background: "linear-gradient(to right, #2563eb, #9333ea)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "linear-gradient(to right, #3b82f6, #a855f7)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "linear-gradient(to right, #2563eb, #9333ea)";
                  }}
                >
                  <span className="font-semibold">Send Message</span>
                  <Send className="w-5 h-5" />
                </Button>
              </form>
            )}
          </div>

          {/* Emergency Contact */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">
                    24/7 Emergency Line
                  </h4>
                  <p className="text-sm text-slate-700 mb-3">
                    For urgent moving assistance outside business hours
                  </p>
                  <Button
                    asChild
                    className={cn(
                      "inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-orange-600 transition-all shadow-lg",
                      "!bg-gradient-to-r hover:!bg-gradient-to-r cursor-pointer"
                    )}
                    style={{
                      background: "linear-gradient(to right, #ef4444, #f97316)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "linear-gradient(to right, #dc2626, #ea580c)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "linear-gradient(to right, #ef4444, #f97316)";
                    }}
                  >
                    <a
                      href="tel:07999888777"
                      className="flex items-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      <span className="font-semibold">079 9988 8777</span>
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -50px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(50px, 50px) scale(1.05);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
}
