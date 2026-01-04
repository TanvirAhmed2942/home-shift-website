import React, { useState } from "react";
import { ChevronDown, HelpCircle, MessageCircle } from "lucide-react";
import { Button } from "../ui/button";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How much does it cost to move with ShiftMyHome?",
      answer:
        "Our pricing is transparent and competitive. Costs vary based on distance, volume of items, and services required. Use our instant quote calculator to get an accurate estimate in seconds. We offer fixed-price quotes with no hidden fees.",
    },
    {
      question: "Are my belongings insured during the move?",
      answer:
        "Yes! All moves come with comprehensive insurance coverage up to £50,000. We also offer premium insurance options for high-value items. Your peace of mind is our priority.",
    },
    {
      question: "How far in advance should I book?",
      answer:
        "We recommend booking at least 2-3 weeks in advance, especially during peak seasons (summer months and end of month). However, we can accommodate last-minute moves subject to availability.",
    },
    {
      question: "What areas do you cover?",
      answer:
        "We provide comprehensive coverage across Scotland and Northern England, including all major cities like Edinburgh, Glasgow, Aberdeen, Dundee, and Carlisle. Check our Service Coverage section for the complete list of locations.",
    },
    {
      question: "Do you provide packing materials?",
      answer:
        "Yes! We offer professional packing services and high-quality packing materials including boxes, bubble wrap, and protective covers. You can choose full packing, partial packing, or just purchase materials.",
    },
    {
      question: "What if I need to change my moving date?",
      answer:
        "We understand plans change. You can reschedule your move up to 48 hours before the scheduled date at no extra charge. Changes within 48 hours may incur a small rescheduling fee.",
    },
    {
      question: "Are your movers trained and background-checked?",
      answer:
        "Absolutely! All our movers are professionally trained, fully licensed, and undergo thorough background checks. We only work with trusted, experienced professionals who treat your belongings with care.",
    },
    {
      question: "How long does a typical move take?",
      answer:
        "A standard 2-bedroom flat typically takes 4-6 hours, including loading, transport, and unloading. Larger homes or long-distance moves may take longer. We'll provide an estimated timeline with your quote.",
    },
    {
      question: "Do you move specialty items like pianos or antiques?",
      answer:
        "Yes! We have specialists trained to handle pianos, antiques, artwork, and other delicate items. These require special equipment and handling, which will be reflected in your custom quote.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit/debit cards, bank transfers, and digital payment methods. A deposit is required to confirm your booking, with the balance due upon completion of the move.",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 px-6 py-3 rounded-full mb-6">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span className="text-blue-900 text-sm tracking-wider uppercase">
              FAQ
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Frequently Asked{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Questions
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Everything you need to know about moving with ShiftMyHome
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="backdrop-blur-sm bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 md:px-8 py-6 flex items-start justify-between gap-4 text-left hover:bg-slate-50 transition-colors duration-200"
              >
                <span className="font-semibold text-slate-900 text-lg flex-1 pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-6 h-6 text-blue-600 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="px-6 md:px-8 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-6">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center backdrop-blur-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 shadow-2xl">
          <MessageCircle className="w-16 h-16 text-white mx-auto mb-6" />
          <h3 className="text-3xl font-bold text-white mb-4">
            Still Have Questions?
          </h3>
          <p className="text-xl text-blue-100 mb-8 max-w-xl mx-auto">
            Our friendly support team is here to help 24/7
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              variant="ghost"
              onClick={() => {
                window.location.href = "tel:02012345678";
              }}
              className="inline-flex items-center h-14  hover:from-blue-600 hover:to-indigo-600 hover:text-white justify-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <span className="font-semibold">Call Us: 020 1234 5678</span>
            </Button>
            <Button
              onClick={() => {
                // This would trigger live chat
                const chatButton = document.querySelector(
                  "[data-chat-button]"
                ) as HTMLElement;
                if (chatButton) chatButton.click();
              }}
              className="inline-flex h-14 text-xl  items-center justify-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-xl hover:bg-white/30 transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="font-semibold">Live Chat</span>
            </Button>
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
