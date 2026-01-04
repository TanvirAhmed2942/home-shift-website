import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  MapPin,
  Calendar as CalendarIcon,
  Clock,
  ArrowRight,
  Loader2,
  Info,
  CheckCircle2,
} from "lucide-react";
import { QuoteRequest } from "../../../utils/pricingEngine";
import { AddressAutocomplete } from "../../ui/AddressAutocomplete";
import { MapboxMap } from "../../map/MapboxMap";
import { mapService } from "../../../utils/mapService";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Button } from "../../ui/button";
import { cn } from "../../ui/utils";

interface StepProps {
  data: QuoteRequest;
  onChange: (updates: Partial<QuoteRequest>) => void;
  onNext: () => void;
}

export function Step1Address({ data, onChange, onNext }: StepProps) {
  const [routeStats, setRouteStats] = useState<{
    dist: number;
    time: number;
  } | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [coords, setCoords] = useState<{
    pickup: { lat: number; lng: number } | null;
    dropoff: { lat: number; lng: number } | null;
  }>({
    pickup: null,
    dropoff: null,
  });

  // Effect to calculate route when coords change
  useEffect(() => {
    async function updateRoute() {
      if (coords.pickup && coords.dropoff) {
        setIsCalculating(true);
        try {
          const result = await mapService.calculateRoute(
            {
              ...coords.pickup,
              address: "",
              lat: coords.pickup.lat,
              lng: coords.pickup.lng,
            },
            {
              ...coords.dropoff,
              address: "",
              lat: coords.dropoff.lat,
              lng: coords.dropoff.lng,
            }
          );

          setRouteStats({
            dist: result.distanceMiles,
            time: result.durationMinutes,
          });

          // Update parent state with real distance
          onChange({ distance: result.distanceMiles });
        } catch (e) {
          console.error("Failed to calc route", e);
        } finally {
          setIsCalculating(false);
        }
      }
    }

    if (coords.pickup && coords.dropoff) {
      updateRoute();
    }
  }, [
    coords.pickup?.lat,
    coords.pickup?.lng,
    coords.dropoff?.lat,
    coords.dropoff?.lng,
  ]);

  const handlePickupSelect = (address: string, lat: number, lng: number) => {
    // Extract postcode basic logic if needed, or rely on address string
    // Here we just accept the full string
    const postcodeMatch = address.match(
      /([A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2})/i
    );
    const postcode = postcodeMatch ? postcodeMatch[0] : "UNKNOWN";

    console.log("Pickup selected:", { address, postcode, lat, lng });

    setCoords((prev) => ({ ...prev, pickup: { lat, lng } }));
    onChange({
      pickup: {
        ...data.pickup,
        address,
        postcode: postcode,
        lat,
        lng,
      } as any,
    });
  };

  const handleDropoffSelect = (address: string, lat: number, lng: number) => {
    const postcodeMatch = address.match(
      /([A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2})/i
    );
    const postcode = postcodeMatch ? postcodeMatch[0] : "UNKNOWN";

    console.log("Dropoff selected:", { address, postcode, lat, lng });

    setCoords((prev) => ({ ...prev, dropoff: { lat, lng } }));
    onChange({
      dropoff: {
        ...data.dropoff,
        address,
        postcode: postcode,
        lat,
        lng,
      } as any,
    });
  };

  // Validation logic - check addresses, postcodes, and date (must match QuoteWizard validation)
  const isValid =
    data.pickup.address.length > 5 &&
    data.dropoff.address.length > 5 &&
    data.pickup.postcode &&
    data.pickup.postcode.length > 0 &&
    data.dropoff.postcode &&
    data.dropoff.postcode.length > 0 &&
    data.date !== null &&
    !isNaN(new Date(data.date).getTime());

  // Debug validation
  if (process.env.NODE_ENV === "development") {
    console.log("Step1 validation:", {
      isValid,
      pickupAddress: data.pickup.address.length,
      dropoffAddress: data.dropoff.address.length,
      pickupPostcode: data.pickup.postcode,
      dropoffPostcode: data.dropoff.postcode,
      date: data.date,
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Where are we moving?
        </h2>
        <p className="text-slate-600">
          Enter your pickup and delivery locations to start.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Pickup */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative z-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
              A
            </div>
            <h3 className="font-bold text-slate-900">Pickup Location</h3>
          </div>

          <div className="space-y-4">
            <div>
              <Label
                htmlFor="pickup-address"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Search Address
              </Label>
              <AddressAutocomplete
                placeholder="Enter postcode or address"
                defaultValue={data.pickup.address}
                onSelect={handlePickupSelect}
                className="w-full"
              />
            </div>

            {data.pickup.postcode && (
              <div className="text-xs text-green-600 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Postcode identified:{" "}
                {data.pickup.postcode}
              </div>
            )}

            <div>
              <Label
                htmlFor="pickup-unit"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Apartment / Unit (Optional)
              </Label>
              <Input
                id="pickup-unit"
                type="text"
                placeholder="Flat 4, Building B"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Dropoff */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
              B
            </div>
            <h3 className="font-bold text-slate-900">Delivery Location</h3>
          </div>

          <div className="space-y-4">
            <div>
              <Label
                htmlFor="dropoff-address"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Search Address
              </Label>
              <AddressAutocomplete
                placeholder="Enter postcode or address"
                defaultValue={data.dropoff.address}
                onSelect={handleDropoffSelect}
                className="w-full"
              />
            </div>

            {data.dropoff.postcode && (
              <div className="text-xs text-green-600 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Postcode identified:{" "}
                {data.dropoff.postcode}
              </div>
            )}

            <div>
              <Label
                htmlFor="dropoff-unit"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Apartment / Unit (Optional)
              </Label>
              <Input
                id="dropoff-unit"
                type="text"
                placeholder="House number, etc."
                className="w-full px-4 py-2 rounded-lg border border-slate-300 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Date & Time */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-purple-600" />
          When is the move?
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label
              htmlFor="move-date"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Date
            </Label>
            <Input
              id="move-date"
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={
                data.date ? new Date(data.date).toISOString().split("T")[0] : ""
              }
              className="w-full px-4 py-3 h-10.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              onChange={(e) => onChange({ date: new Date(e.target.value) })}
            />
          </div>
          <div>
            <Label
              htmlFor="preferred-time"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Preferred Time
            </Label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 w-5 h-5 text-slate-400 z-10 pointer-events-none" />
              <Select>
                <SelectTrigger
                  id="preferred-time"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-white"
                >
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning (8am - 12pm)</SelectItem>
                  <SelectItem value="afternoon">
                    Afternoon (12pm - 4pm)
                  </SelectItem>
                  <SelectItem value="evening">Evening (4pm - 8pm)</SelectItem>
                  <SelectItem value="anytime">Anytime</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Map Preview (Optional but recommended) */}
      {coords.pickup && coords.dropoff && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden p-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-slate-700 text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-500" /> Route Preview
            </h4>
            {isCalculating ? (
              <span className="text-xs text-blue-600 flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" /> Calculating...
              </span>
            ) : routeStats ? (
              <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded">
                {routeStats.dist} miles • ~{routeStats.time} mins
              </span>
            ) : null}
          </div>

          <MapboxMap
            pickup={{
              lat: coords.pickup.lat,
              lng: coords.pickup.lng,
              address: "Pickup",
            }}
            delivery={{
              lat: coords.dropoff.lat,
              lng: coords.dropoff.lng,
              address: "Dropoff",
            }}
            height="200px"
            className="rounded-lg border border-slate-300"
          />
        </div>
      )}

      <div className="flex justify-end pt-6">
        <Button
          onClick={onNext}
          disabled={!isValid || isCalculating}
          className={cn(
            "px-8 py-4 rounded-xl h-14 text-xl  flex items-center cursor-pointer justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1",
            isValid
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          )}
        >
          {isCalculating ? "Calculating Route..." : "Next Step"}
          <ArrowRight className="w-6 h-6 text-xl font-bold" />
        </Button>
      </div>
    </motion.div>
  );
}
