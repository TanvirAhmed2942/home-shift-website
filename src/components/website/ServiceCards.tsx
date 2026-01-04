import React from "react";
import {
  Home,
  Armchair,
  Users,
  Bike,
  Store,
  Package,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Button } from "../ui/button";
import { cn } from "../ui/utils";

interface ServiceCardsProps {
  selectedService: string | null;
  onSelectService: (service: string) => void;
}

const services = [
  {
    id: "house-move",
    icon: Home,
    title: "House Move",
    description: "Complete home relocations with professional care",
    gradient: "from-blue-500 to-indigo-600",
    hoverGradient: "from-blue-600 to-indigo-700",
    image:
      "https://images.unsplash.com/photo-1594873604892-b599f847e859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjU4MTMyNjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "furniture",
    icon: Armchair,
    title: "Furniture & items",
    description: "Sofas, beds, wardrobes delivered safely",
    showPhoneNote: true,
    gradient: "from-purple-500 to-pink-600",
    hoverGradient: "from-purple-600 to-pink-700",
    image:
      "https://images.unsplash.com/photo-1763565909003-46e9dfb68a00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2ZhJTIwZnVybml0dXJlJTIwbW9kZXJufGVufDF8fHx8MTc2NTgxODk1OHww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "clearance",
    icon: Trash2,
    title: "Clearance & Removal",
    description:
      "House, garden, builders and junk clearance with professional loading and disposal",
    gradient: "from-orange-500 to-red-600",
    hoverGradient: "from-orange-600 to-red-700",
    image:
      "https://images.unsplash.com/photo-1738236662730-b4ea66d35d0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXN0ZSUyMHJlbW92YWwlMjB2YW4lMjBsb2FkaW5nJTIwZnVybml0dXJlJTIwZGlzcG9zYWx8ZW58MXx8fHwxNzY3Mjg1NTg5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: "motorbike",
    icon: Bike,
    title: "Motorbike / bicycle",
    description: "Secure transport for your vehicles",
    gradient: "from-orange-500 to-red-600",
    hoverGradient: "from-orange-600 to-red-700",
    image:
      "https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaWN5Y2xlJTIwZGVsaXZlcnklMjB1cmJhbnxlbnwxfHx8fDE3NjU4MTg5NTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "store-pickup",
    icon: Store,
    title: "Store / pickup",
    description: "IKEA, B&Q, and retail pickups",
    gradient: "from-emerald-500 to-teal-600",
    hoverGradient: "from-emerald-600 to-teal-700",
    image:
      "https://images.unsplash.com/photo-1567335632614-abebe179111e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRhaWwlMjBzdG9yZSUyMHdhcmVob3VzZSUyMHBpY2t1cHxlbnwxfHx8fDE3NjY1MzA4ODF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: "other",
    icon: Package,
    title: "Other delivery",
    description: "Custom solutions for any item",
    gradient: "from-amber-500 to-yellow-600",
    hoverGradient: "from-amber-600 to-yellow-700",
    image:
      "https://images.unsplash.com/photo-1762851452423-34e7cf452780?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpdmVyeSUyMHdvcmtlciUyMHBhY2thZ2V8ZW58MXx8fHwxNjY1MTk3MTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
];

// Helper function to convert Tailwind gradient classes to CSS gradient
const getGradientStyle = (gradient: string): string => {
  const gradientMap: Record<string, string> = {
    "from-blue-500 to-indigo-600":
      "linear-gradient(to right, #3b82f6, #4f46e5)",
    "from-purple-500 to-pink-600":
      "linear-gradient(to right, #a855f7, #db2777)",
    "from-orange-500 to-red-600": "linear-gradient(to right, #f97316, #dc2626)",
    "from-emerald-500 to-teal-600":
      "linear-gradient(to right, #10b981, #0d9488)",
    "from-amber-500 to-yellow-600":
      "linear-gradient(to right, #f59e0b, #ca8a04)",
  };
  return gradientMap[gradient] || gradientMap["from-blue-500 to-indigo-600"];
};

export function ServiceCards({
  selectedService,
  onSelectService,
}: ServiceCardsProps) {
  const handleServiceClick = (serviceId: string) => {
    console.log("Service clicked:", serviceId);
    onSelectService(serviceId);
  };

  return (
    <section
      id="services"
      className="py-8 sm:py-12 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-br from-cyan-200/30 to-blue-200/30 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full px-4 sm:px-6 py-2 mb-4 sm:mb-6">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
            <span className="text-xs sm:text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Our Services
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-slate-900 mb-3 lg:mb-4">
            What can we move for you?
          </h2>
          <p className="text-sm sm:text-base lg:text-xl text-slate-600 max-w-3xl mx-auto px-4">
            Professional moving services tailored to your needs
          </p>
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            const isSelected = selectedService === service.id;

            return (
              <div
                key={service.id}
                onClick={() => handleServiceClick(service.id)}
                className={`group relative bg-white/90 backdrop-blur-sm border-2 rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? "border-blue-500 shadow-2xl shadow-blue-500/20 scale-[1.02] sm:scale-105"
                    : "border-white/50  shadow-lg hover:shadow-2xl hover:scale-[1.02] sm:hover:scale-105"
                }`}
              >
                {/* Image Background */}
                <div className="relative h-36 sm:h-40 lg:h-48 overflow-hidden">
                  <ImageWithFallback
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-60 group-hover:opacity-70 transition-opacity`}
                  ></div>

                  {/* Icon */}
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white/20 backdrop-blur-md border border-white/40 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
                  </div>

                  {/* Selected Badge */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-2.5 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span className="hidden xs:inline">Selected</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 lg:p-6">
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 mb-1.5 sm:mb-2">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm lg:text-base text-slate-600 mb-3 sm:mb-4 line-clamp-2">
                    {service.description}
                  </p>

                  {/* CTA Button - ALWAYS VISIBLE - Using Radix UI Button */}
                  <Button
                    asChild={false}
                    variant="ghost"
                    className={cn(
                      "w-full py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all shadow-lg hover:shadow-xl active:scale-95 sm:hover:scale-105 border-0 text-white hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2",
                      "!bg-transparent hover:!bg-transparent cursor-pointer" // Remove default backgrounds with !important
                    )}
                    style={{
                      background: getGradientStyle(service.gradient),
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleServiceClick(service.id);
                    }}
                  >
                    Get a Quote
                  </Button>

                  {service.showPhoneNote && (
                    <p className="mt-2.5 sm:mt-3 text-xs text-slate-500 text-center italic">
                      📞 Sofa dimensions required - we'll call to confirm
                    </p>
                  )}
                </div>

                {/* Hover glow effect */}
                <div
                  className={`absolute -inset-1 bg-gradient-to-r ${service.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity -z-10`}
                ></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
