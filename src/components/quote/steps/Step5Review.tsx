import React, { useState } from "react";
import { motion } from "motion/react";
import {
  CreditCard,
  Lock,
  CheckCircle,
  ArrowLeft,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { QuoteRequest, QuoteResponse } from "../../../utils/pricingEngine";
import { jobStatusManager } from "../../../utils/jobStatusManager";

interface StepProps {
  data: QuoteRequest;
  quote: QuoteResponse | null;
  onBack: () => void;
}

export function Step5Review({ data, quote, onBack }: StepProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);

    // Simulate API call to process payment
    setTimeout(() => {
      // Create job in the system
      try {
        jobStatusManager.createJob({
          title: `${data.serviceType} for ${data.customer?.name}`,
          service: data.serviceType,
          description: data.customer?.notes || "No notes",
          customerName: data.customer?.name || "Unknown",
          customerPhone: data.customer?.phone || "Unknown",
          customerEmail: data.customer?.email,
          pickup: {
            address: data.pickup.address,
            postcode: data.pickup.postcode,
            details: `Floor: ${data.pickup.floor}, Lift: ${
              data.pickup.hasLift ? "Yes" : "No"
            }`,
          },
          delivery: {
            address: data.dropoff.address,
            postcode: data.dropoff.postcode,
            details: `Floor: ${data.dropoff.floor}, Lift: ${
              data.dropoff.hasLift ? "Yes" : "No"
            }`,
          },
          date: data.date.toISOString().split("T")[0],
          time: "09:00", // Default or from Step 1
          distance: quote?.distance || 0,
          duration: quote?.estimatedDuration || "2 hours",
          totalVolume: 10, // Mock
          vehicle: data.selectedVehicle || "medium",
          crew: data.extras.helpers,
          items: [],
          customerPrice: quote?.breakdown.total || 0,
          driverPrice: (quote?.breakdown.total || 0) * 0.7,
          platformFee: (quote?.breakdown.total || 0) * 0.3,
          status: "pending", // Waiting for admin/driver
        });

        setIsSuccess(true);
        setIsProcessing(false);
      } catch (err) {
        setError("Payment failed. Please try again.");
        setIsProcessing(false);
      }
    }, 2000);
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Booking Confirmed!
        </h2>
        <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
          Thank you, {data.customer?.name}. We have received your deposit of{" "}
          <strong>£{quote?.breakdown.deposit.toFixed(2)}</strong>.
          <br />
          <br />A confirmation email has been sent to{" "}
          <strong>{data.customer?.email}</strong>.
        </p>
        <button
          onClick={() => (window.location.href = "/")}
          className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg"
        >
          Return Home
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Review & Pay</h2>
        <p className="text-slate-600">
          Secure your booking with a 20% deposit.
        </p>
      </div>

      {/* Review Section */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
        <h3 className="font-bold text-slate-900 mb-4">Booking Summary</h3>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <p className="text-slate-500 mb-1">Pickup</p>
            <p className="font-semibold text-slate-900">
              {data.pickup.address}
            </p>
            <p className="text-slate-900">{data.pickup.postcode}</p>
          </div>
          <div>
            <p className="text-slate-500 mb-1">Delivery</p>
            <p className="font-semibold text-slate-900">
              {data.dropoff.address}
            </p>
            <p className="text-slate-900">{data.dropoff.postcode}</p>
          </div>
          <div>
            <p className="text-slate-500 mb-1">Date</p>
            <p className="font-semibold text-slate-900">
              {data.date.toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-slate-500 mb-1">Service</p>
            <p className="font-semibold text-slate-900 capitalize">
              {data.serviceType.replace("-", " ")}
            </p>
            <p className="text-slate-600">
              {data.selectedVehicle} Van + {data.extras.helpers} Crew
            </p>
          </div>
        </div>
      </div>

      {/* Mock Stripe Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-bl-xl flex items-center gap-1">
          <Lock className="w-3 h-3" />
          SSL Secure
        </div>

        <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-blue-600" />
          Card Details
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Card Number
            </label>
            <input
              type="text"
              placeholder="0000 0000 0000 0000"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all font-mono"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Expiry Date
              </label>
              <input
                type="text"
                placeholder="MM/YY"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                CVC
              </label>
              <input
                type="text"
                placeholder="123"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all font-mono"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Cardholder Name
            </label>
            <input
              type="text"
              placeholder="Name on card"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            {error}
          </div>
        )}
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={onBack}
          disabled={isProcessing}
          className="px-6 py-4 rounded-xl font-bold text-slate-600 hover:bg-slate-100 flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="px-8 py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all disabled:opacity-70 disabled:cursor-not-allowed min-w-[200px] justify-center"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Pay £{quote?.breakdown.deposit.toFixed(2)} Deposit
              <Lock className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
