import React, { useState } from "react";
import { Phone, X, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { jobStatusManager } from "../../utils/jobStatusManager";

interface CallbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CallbackModal({ isOpen, onClose }: CallbackModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      toast.error("Please enter your name and phone number");
      return;
    }

    const success = jobStatusManager.requestCallback(name, phone);
    if (success) {
      setSubmitted(true);
      toast.success("Request received! We will call you shortly.");
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setName("");
        setPhone("");
      }, 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors z-10 cursor-pointer flex items-center justify-center"
        >
          <X className="w-5 h-5 text-slate-300" />
        </button>

        {submitted ? (
          <div className="p-8 text-center bg-green-50 h-full flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-green-800 mb-2">
              Request Sent!
            </h3>
            <p className="text-green-700">
              Our team has been notified.
              <br />
              Expect a call shortly.
            </p>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-md">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold">Request a Callback</h2>
              <p className="text-blue-100 text-sm mt-1">
                Talk to an expert in minutes
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="07700 900..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2 rounded-lg">
                <Clock className="w-3 h-3 text-blue-500" />
                <span>Available: Mon-Sun, 8am - 8pm</span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Call Me Back</span>
                <Phone className="w-4 h-4" />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
