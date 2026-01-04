import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronRight,
  ChevronLeft,
  Loader2,
  CheckCircle2,
  Shield,
} from "lucide-react";
import {
  PricingEngine,
  QuoteRequest,
  QuoteResponse,
} from "../../utils/pricingEngine";
import { QuoteSummaryPanel } from "./QuoteSummaryPanel";
import { Step1Address } from "./steps/Step1Address";
import { Step2Inventory } from "./steps/Step2Inventory";
import { Step3Access } from "./steps/Step3Access";
import { Step4Details } from "./steps/Step4Details";
import { Step5Review } from "./steps/Step5Review";

interface QuoteWizardProps {
  serviceType: string;
  onClose: () => void;
}

export function QuoteWizard({ serviceType, onClose }: QuoteWizardProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [quote, setQuote] = useState<QuoteResponse | null>(null);

  // Form State
  const [formData, setFormData] = useState<QuoteRequest>({
    serviceType,
    pickup: {
      address: "",
      postcode: "",
      hasLift: true,
      floor: 0,
      hasStairs: false,
      stairFlights: 1,
      carryDistance: "under10m",
      parkingRestrictions: {
        limitedParking: false,
        paidParking: false,
        loadingBayOnly: false,
      },
      accessNotes: "",
    },
    dropoff: {
      address: "",
      postcode: "",
      hasLift: true,
      floor: 0,
      hasStairs: false,
      stairFlights: 1,
      carryDistance: "under10m",
      parkingRestrictions: {
        limitedParking: false,
        paidParking: false,
        loadingBayOnly: false,
      },
      accessNotes: "",
    },
    date: new Date(),
    items: [],
    selectedVehicle: "medium",
    extras: {
      assembly: false,
      disassembly: false,
      packaging: false,
      helpers: 1,
    },
  });

  // Calculate quote whenever relevant form data changes
  useEffect(() => {
    // Debounce calculation
    const timer = setTimeout(() => {
      // Calculate if we have minimum required data (addresses and date)
      const hasMinData =
        formData.pickup.address.length > 5 &&
        formData.dropoff.address.length > 5 &&
        formData.date !== null &&
        !isNaN(new Date(formData.date).getTime());

      if (hasMinData) {
        calculateQuote();
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [
    formData.pickup.address,
    formData.pickup.postcode,
    formData.dropoff.address,
    formData.dropoff.postcode,
    formData.date,
    formData.items,
    formData.extras,
    formData.selectedVehicle,
  ]);

  const calculateQuote = async () => {
    setIsLoading(true);
    try {
      console.log("Calculating quote with data:", {
        pickup: formData.pickup.address,
        dropoff: formData.dropoff.address,
        date: formData.date,
        postcodes: {
          pickup: formData.pickup.postcode,
          dropoff: formData.dropoff.postcode,
        },
      });
      const response = await PricingEngine.calculateQuote(formData);
      setQuote(response);
      console.log("Quote calculated:", response);
    } catch (error) {
      console.error("Pricing error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateStep1 = () => {
    // Check if addresses are filled (main requirement)
    const hasValidAddresses =
      formData.pickup.address.length > 5 && formData.dropoff.address.length > 5;

    // Postcode validation - accept "UNKNOWN" as valid (means we tried to extract but couldn't)
    // Or if postcode exists and is not empty
    const hasValidPostcodes =
      formData.pickup.postcode &&
      formData.pickup.postcode.length > 0 &&
      formData.dropoff.postcode &&
      formData.dropoff.postcode.length > 0;

    const hasValidDate =
      formData.date !== null && !isNaN(new Date(formData.date).getTime());

    return hasValidAddresses && hasValidPostcodes && hasValidDate;
  };

  const validateStep2 = () => {
    return !!formData.selectedVehicle;
  };

  const validateStep3 = () => {
    const validateLocation = (location: typeof formData.pickup) => {
      // Floor is required
      if (location.floor === undefined || location.floor === null) {
        return false;
      }
      // If floor >= 1, lift availability is required
      if (location.floor >= 1) {
        if (location.hasLift === undefined || location.hasLift === null) {
          return false;
        }
      }
      // Stairs inside building is required
      if (location.hasStairs === undefined || location.hasStairs === null) {
        return false;
      }
      return true;
    };

    return (
      validateLocation(formData.pickup) && validateLocation(formData.dropoff)
    );
  };

  const validateStep4 = () => {
    return !!(
      formData.customer?.name &&
      formData.customer?.email &&
      formData.customer?.phone
    );
  };

  const canProceedToNextStep = () => {
    switch (step) {
      case 1:
        return validateStep1();
      case 2:
        return validateStep2();
      case 3:
        return validateStep3();
      case 4:
        return validateStep4();
      case 5:
        return true; // Review step doesn't need validation
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!canProceedToNextStep()) {
      return; // Don't proceed if validation fails
    }
    if (step < 5) {
      setStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (step === 1) {
      onClose();
    } else {
      setStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const updateFormData = (updates: Partial<QuoteRequest>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-slate-900">
                Get Instant Quote
              </h1>
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <span className="capitalize">
                  {serviceType.replace("-", " ")}
                </span>
                <span>•</span>
                <span>Step {step} of 5</span>
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-green-600 text-sm font-medium bg-green-50 px-3 py-1 rounded-full">
            <Shield className="w-4 h-4" />
            Admin-Verified Pricing
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-slate-100 w-full">
          <motion.div
            className="h-full bg-blue-600"
            initial={{ width: 0 }}
            animate={{ width: `${(step / 5) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 pb-32">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content Area */}
          <div className={`flex-1 ${step === 3 ? "w-full" : ""}`}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <Step1Address
                  data={formData}
                  onChange={updateFormData}
                  onNext={handleNext}
                />
              )}
              {step === 2 && (
                <Step2Inventory
                  serviceType={serviceType}
                  data={formData}
                  onChange={updateFormData}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}
              {step === 3 && (
                <Step3Access
                  data={formData}
                  onChange={updateFormData}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}
              {step === 4 && (
                <Step4Details
                  serviceType={serviceType}
                  data={formData}
                  onChange={updateFormData}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}
              {step === 5 && (
                <Step5Review
                  data={formData}
                  quote={quote}
                  onBack={handleBack}
                  // Checkout flow integration passed here
                />
              )}
            </AnimatePresence>
          </div>

          {/* Sticky Summary Panel */}
          {step !== 3 && (
            <div className="hidden lg:block w-96">
              <div className="sticky top-24">
                <QuoteSummaryPanel
                  quote={quote}
                  isLoading={isLoading}
                  serviceType={serviceType}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sticky Footer */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold">
              Total Estimate
            </p>
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            ) : (
              <p className="text-xl font-bold text-blue-900">
                {quote ? `£${quote.breakdown.total.toFixed(2)}` : "---"}
              </p>
            )}
          </div>
          <button
            onClick={handleNext}
            disabled={!canProceedToNextStep()}
            className={`px-6 py-3 rounded-xl font-bold transition-colors flex items-center gap-2 ${
              canProceedToNextStep()
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            {step === 5 ? "Pay Securely" : "Next Step"}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
