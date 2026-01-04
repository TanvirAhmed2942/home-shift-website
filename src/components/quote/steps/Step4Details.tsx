import React from "react";
import { motion } from "motion/react";
import {
  Users,
  Wrench,
  Package,
  User,
  Mail,
  Phone,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { QuoteRequest } from "../../../utils/pricingEngine";

interface StepProps {
  serviceType: string;
  data: QuoteRequest;
  onChange: (updates: Partial<QuoteRequest>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step4Details({
  serviceType,
  data,
  onChange,
  onNext,
  onBack,
}: StepProps) {
  const isValid =
    data.customer?.name && data.customer?.email && data.customer?.phone;

  // Should hide assembly options for motorbike and certain other types
  const showAssemblyOptions = !["motorbike", "store-pickup", "other"].includes(
    serviceType
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Customize & Contact
        </h2>
        <p className="text-slate-600">
          Add helpers, extras, and your contact details.
        </p>
      </div>

      {/* Helpers Selection */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          How many helpers do you need?
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          The driver is included. Add extra helpers for heavy lifting or faster
          service.
        </p>

        <div className="flex gap-3">
          {[1, 2, 3].map((count) => (
            <button
              key={count}
              onClick={() =>
                onChange({ extras: { ...data.extras, helpers: count } })
              }
              className={`flex-1 py-4 rounded-xl border-2 font-bold transition-all ${
                data.extras.helpers === count
                  ? "border-blue-600 bg-blue-50 text-blue-900"
                  : "border-slate-200 hover:border-blue-300 text-slate-600"
              }`}
            >
              <div className="text-lg mb-1">
                {count === 1 ? "Driver Only" : `Driver + ${count - 1}`}
              </div>
              <div className="text-xs font-normal opacity-70">
                {count === 1 ? "You help load" : "Relax & watch"}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Extra Services - Conditionally Rendered */}
      {showAssemblyOptions && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-purple-600" />
            Additional Services
          </h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-blue-300 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={data.extras.assembly}
                  onChange={(e) =>
                    onChange({
                      extras: { ...data.extras, assembly: e.target.checked },
                    })
                  }
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <div>
                  <span className="font-bold text-slate-900 block">
                    Furniture Assembly
                  </span>
                  <span className="text-xs text-slate-500">
                    We build your furniture
                  </span>
                </div>
              </div>
              <span className="text-sm font-bold text-slate-900">+£30</span>
            </label>

            <label className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-blue-300 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={data.extras.disassembly}
                  onChange={(e) =>
                    onChange({
                      extras: { ...data.extras, disassembly: e.target.checked },
                    })
                  }
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <div>
                  <span className="font-bold text-slate-900 block">
                    Furniture Disassembly
                  </span>
                  <span className="text-xs text-slate-500">
                    We take apart furniture
                  </span>
                </div>
              </div>
              <span className="text-sm font-bold text-slate-900">+£30</span>
            </label>

            <label className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-blue-300 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={data.extras.packaging}
                  onChange={(e) =>
                    onChange({
                      extras: { ...data.extras, packaging: e.target.checked },
                    })
                  }
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <div>
                  <span className="font-bold text-slate-900 block">
                    Packaging Materials
                  </span>
                  <span className="text-xs text-slate-500">
                    Boxes & tape provided
                  </span>
                </div>
              </div>
              <span className="text-sm font-bold text-slate-900">+£50</span>
            </label>
          </div>
        </div>
      )}

      {/* Customer Details */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-green-600" />
          Contact Details
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="John Doe"
                value={data.customer?.name || ""}
                onChange={(e) =>
                  onChange({
                    customer: { ...data.customer!, name: e.target.value },
                  })
                }
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={data.customer?.email || ""}
                  onChange={(e) =>
                    onChange({
                      customer: { ...data.customer!, email: e.target.value },
                    })
                  }
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                  type="tel"
                  placeholder="+44 7700 900000"
                  value={data.customer?.phone || ""}
                  onChange={(e) =>
                    onChange({
                      customer: { ...data.customer!, phone: e.target.value },
                    })
                  }
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Additional Notes
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <textarea
                rows={3}
                placeholder="Any special instructions, gate codes, or fragile items?"
                value={data.customer?.notes || ""}
                onChange={(e) =>
                  onChange({
                    customer: { ...data.customer!, notes: e.target.value },
                  })
                }
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={onBack}
          className="px-6 py-4 rounded-xl font-bold text-slate-600 hover:bg-slate-100 flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          className={`px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all ${
            isValid
              ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl hover:-translate-y-1"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
        >
          Review Quote
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}
