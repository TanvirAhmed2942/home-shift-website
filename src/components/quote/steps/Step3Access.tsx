import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, MapPin, Info } from "lucide-react";
import { QuoteRequest } from "../../../utils/pricingEngine";
import { MapboxMap } from "../../map/MapboxMap";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Textarea } from "../../ui/textarea";
import { Button } from "../../ui/button";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Checkbox } from "../../ui/checkbox";
import { cn } from "../../ui/utils";

interface StepProps {
  data: QuoteRequest;
  onChange: (updates: Partial<QuoteRequest>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step3Access({ data, onChange, onNext, onBack }: StepProps) {
  const updateLocation = (
    type: "pickup" | "dropoff",
    field: string,
    value: any
  ) => {
    onChange({
      [type]: {
        ...data[type],
        [field]: value,
      },
    });
  };

  // Validation: Check if all required fields are filled for both locations
  const validateLocation = (
    locationData: QuoteRequest["pickup"] | QuoteRequest["dropoff"]
  ) => {
    // Floor is always required (should be set)
    if (locationData.floor === undefined || locationData.floor === null) {
      return false;
    }

    // If floor >= 1, lift availability is required
    if (locationData.floor >= 1) {
      if (locationData.hasLift === undefined || locationData.hasLift === null) {
        return false;
      }
    }

    // Stairs inside building is required
    if (
      locationData.hasStairs === undefined ||
      locationData.hasStairs === null
    ) {
      return false;
    }

    return true;
  };

  const isValid =
    validateLocation(data.pickup) && validateLocation(data.dropoff);

  const LocationAccessForm = ({
    type,
    locationData,
  }: {
    type: "pickup" | "dropoff";
    locationData: QuoteRequest["pickup"] | QuoteRequest["dropoff"];
  }) => {
    const title = type === "pickup" ? "PICKUP ACCESS" : "DELIVERY ACCESS";
    const isPickup = type === "pickup";

    return (
      <div className="space-y-6">
        <h3 className="font-bold text-slate-900 uppercase tracking-wide text-sm border-b border-slate-200 pb-3">
          {title}
        </h3>

        {/* Floor Selection */}
        <div>
          <Label className="block text-sm font-medium text-slate-700 mb-2">
            Floor <span className="text-red-500">*</span>
          </Label>
          <RadioGroup
            value={locationData.floor?.toString()}
            onValueChange={(value) =>
              updateLocation(type, "floor", parseInt(value))
            }
            className="space-y-2"
          >
            {[
              "Ground floor",
              "1st floor",
              "2nd floor",
              "3rd floor",
              "4th floor",
              "5th floor+",
            ].map((label, idx) => (
              <label
                key={idx}
                className={cn(
                  "flex items-center gap-3 p-3 bg-white border-2 rounded-lg cursor-pointer transition-all",
                  locationData.floor === idx
                    ? "border-blue-600 bg-blue-50/50"
                    : "border-slate-200 hover:border-blue-400"
                )}
              >
                <RadioGroupItem
                  value={idx.toString()}
                  id={`${type}-floor-${idx}`}
                  className="w-4 h-4 text-blue-600 shrink-0"
                />
                <span
                  className={cn(
                    "text-sm",
                    locationData.floor === idx
                      ? "text-blue-900 font-medium"
                      : "text-slate-700"
                  )}
                >
                  {label}
                </span>
              </label>
            ))}
          </RadioGroup>

          {/* Floor Number Input for 5th+ */}
          {locationData.floor === 5 && (
            <div className="mt-3 ml-7">
              <Label
                htmlFor={`${type}-floor-number`}
                className="block text-xs text-slate-600 mb-1"
              >
                Enter floor number:
              </Label>
              <Input
                id={`${type}-floor-number`}
                type="number"
                min={5}
                value={locationData.floorNumber || 5}
                onChange={(e) =>
                  updateLocation(
                    type,
                    "floorNumber",
                    parseInt(e.target.value) || 5
                  )
                }
                className="w-20 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        {/* Lift Available (only if floor >= 1) */}
        {locationData.floor >= 1 && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300">
            <Label className="block text-sm font-medium text-slate-700 mb-2">
              Lift available? <span className="text-red-500">*</span>
            </Label>
            <RadioGroup
              value={
                locationData.hasLift === true
                  ? "yes"
                  : locationData.hasLift === false
                  ? "no"
                  : ""
              }
              onValueChange={(value) =>
                updateLocation(type, "hasLift", value === "yes")
              }
              className="space-y-2"
            >
              <label
                className={cn(
                  "flex items-center gap-3 p-3 bg-white border-2 rounded-lg cursor-pointer transition-all",
                  locationData.hasLift === true
                    ? "border-blue-600 bg-blue-50/50"
                    : "border-slate-200 hover:border-blue-400"
                )}
              >
                <RadioGroupItem
                  value="yes"
                  id={`${type}-lift-yes`}
                  className="w-4 h-4 text-blue-600 shrink-0"
                />
                <span className="text-sm text-slate-700">Yes</span>
              </label>
              <label
                className={cn(
                  "flex items-center gap-3 p-3 bg-white border-2 rounded-lg cursor-pointer transition-all",
                  locationData.hasLift === false
                    ? "border-blue-600 bg-blue-50/50"
                    : "border-slate-200 hover:border-blue-400"
                )}
              >
                <RadioGroupItem
                  value="no"
                  id={`${type}-lift-no`}
                  className="w-4 h-4 text-blue-600 shrink-0"
                />
                <span className="text-sm text-slate-700">No</span>
              </label>
            </RadioGroup>
          </div>
        )}

        {/* Stairs Inside Building */}
        <div>
          <Label className="block text-sm font-medium text-slate-700 mb-2">
            Stairs inside building? <span className="text-red-500">*</span>
          </Label>
          <RadioGroup
            value={
              locationData.hasStairs === true
                ? "yes"
                : locationData.hasStairs === false
                ? "no"
                : ""
            }
            onValueChange={(value) =>
              updateLocation(type, "hasStairs", value === "yes")
            }
            className="space-y-2"
          >
            <label
              className={cn(
                "flex items-center gap-3 p-3 bg-white border-2 rounded-lg cursor-pointer transition-all",
                locationData.hasStairs === true
                  ? "border-blue-600 bg-blue-50/50"
                  : "border-slate-200 hover:border-blue-400"
              )}
            >
              <RadioGroupItem
                value="yes"
                id={`${type}-stairs-yes`}
                className="w-4 h-4 text-blue-600 shrink-0"
              />
              <span className="text-sm text-slate-700">Yes</span>
            </label>
            <label
              className={cn(
                "flex items-center gap-3 p-3 bg-white border-2 rounded-lg cursor-pointer transition-all",
                locationData.hasStairs === false
                  ? "border-blue-600 bg-blue-50/50"
                  : "border-slate-200 hover:border-blue-400"
              )}
            >
              <RadioGroupItem
                value="no"
                id={`${type}-stairs-no`}
                className="w-4 h-4 text-blue-600 shrink-0"
              />
              <span className="text-sm text-slate-700">No</span>
            </label>
          </RadioGroup>

          {/* Number of Stair Flights */}
          {locationData.hasStairs && (
            <div className="mt-3 ml-7 animate-in fade-in slide-in-from-top-2">
              <Label
                htmlFor={`${type}-stair-flights`}
                className="block text-xs text-slate-600 mb-1"
              >
                Number of stair flights
              </Label>
              <Select
                value={locationData.stairFlights?.toString()}
                onValueChange={(value) =>
                  updateLocation(type, "stairFlights", parseInt(value))
                }
              >
                <SelectTrigger
                  id={`${type}-stair-flights`}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                      {num === 5 ? "+" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Long Carry Distance */}
        <div>
          <Label className="block text-sm font-medium text-slate-700 mb-2">
            Long carry distance{" "}
            <span className="text-slate-400">(optional)</span>
          </Label>
          <RadioGroup
            value={locationData.carryDistance}
            onValueChange={(value) =>
              updateLocation(type, "carryDistance", value as any)
            }
            className="space-y-2"
          >
            {[
              { value: "under10m", label: "Under 10m (standard)" },
              { value: "10-25m", label: "10–25m" },
              { value: "25-50m", label: "25–50m" },
              { value: "50m+", label: "50m+" },
            ].map((option) => (
              <label
                key={option.value}
                className={cn(
                  "flex items-center gap-3 p-3 bg-white border-2 rounded-lg cursor-pointer transition-all",
                  locationData.carryDistance === option.value
                    ? "border-blue-600 bg-blue-50/50"
                    : "border-slate-200 hover:border-blue-400"
                )}
              >
                <RadioGroupItem
                  value={option.value}
                  id={`${type}-carry-${option.value}`}
                  className="w-4 h-4 text-blue-600 shrink-0"
                />
                <span className="text-sm text-slate-700">{option.label}</span>
              </label>
            ))}
          </RadioGroup>
        </div>

        {/* Parking Restrictions */}
        <div>
          <Label className="block text-sm font-medium text-slate-700 mb-2">
            Parking restrictions{" "}
            <span className="text-slate-400">(optional)</span>
          </Label>
          <div className="space-y-2">
            {[
              { id: "limitedParking", label: "Limited parking" },
              { id: "paidParking", label: "Paid parking / permit required" },
              { id: "loadingBayOnly", label: "Loading bay only" },
            ].map((option) => (
              <label
                key={option.id}
                className="flex items-center gap-3 p-3 bg-white border-2 border-slate-200 rounded-lg hover:border-blue-400 cursor-pointer transition-all"
              >
                <Checkbox
                  id={`${type}-parking-${option.id}`}
                  checked={(locationData.parkingRestrictions as any)[option.id]}
                  onCheckedChange={(checked) =>
                    updateLocation(type, "parkingRestrictions", {
                      ...locationData.parkingRestrictions,
                      [option.id]: checked,
                    })
                  }
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-slate-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <Label
            htmlFor={`${type}-notes`}
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Notes <span className="text-slate-400">(optional)</span>
          </Label>
          <Textarea
            id={`${type}-notes`}
            value={locationData.accessNotes}
            onChange={(e) =>
              updateLocation(type, "accessNotes", e.target.value)
            }
            rows={3}
            placeholder="Any additional access information..."
            className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Access Details</h2>
        <p className="text-slate-600">Step 3 of 5</p>
      </div>

      {/* 2 COLUMN LAYOUT */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* LEFT COLUMN - FORM */}
        <div className="space-y-8 bg-slate-50/50 p-1 rounded-xl">
          <LocationAccessForm type="pickup" locationData={data.pickup} />

          <div className="border-t border-slate-300 my-8"></div>

          <LocationAccessForm type="dropoff" locationData={data.dropoff} />
        </div>

        {/* RIGHT COLUMN - MAP & SUMMARY */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden sticky top-24 shadow-sm">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="font-bold text-slate-900">Route Overview</h3>
            </div>

            {/* Map Area */}
            <div className="h-[360px] w-full bg-slate-100 relative">
              {data.pickup.postcode && data.dropoff.postcode ? (
                <MapboxMap
                  pickup={{
                    lat: data.pickup.lat || 51.5074,
                    lng: data.pickup.lng || -0.1278,
                    address: data.pickup.address || data.pickup.postcode,
                  }}
                  delivery={{
                    lat: data.dropoff.lat || 55.9533,
                    lng: data.dropoff.lng || -3.1883,
                    address: data.dropoff.address || data.dropoff.postcode,
                  }}
                  showRoute={true}
                  className="w-full h-full"
                  height="360px"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                  <MapPin className="w-12 h-12 mb-3 text-slate-300" />
                  <p className="text-sm font-medium">
                    Map details will appear here
                  </p>
                  <p className="text-xs">
                    Enter addresses in Step 1 to see the route
                  </p>
                </div>
              )}
            </div>

            {/* Route Details */}
            <div className="p-6 space-y-6 bg-white">
              <div className="space-y-4">
                <div className="">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-2">
                    Pickup
                    <MapPin className="w-4 h-4 text-blue-500" />
                  </p>
                  <div className="flex items-center justify-start gap-3">
                    <p className="text-sm text-slate-900 leading-relaxed font-medium">
                      {data.pickup.address || data.pickup.postcode || "Not set"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-2">
                    Delivery
                    <MapPin className="w-4 h-4 text-green-500" />
                  </p>
                  <div className="flex items-center justify-start gap-3">
                    <p className="text-sm text-slate-900 leading-relaxed font-medium">
                      {data.dropoff.address ||
                        data.dropoff.postcode ||
                        "Not set"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Total Distance</p>
                  <p className="text-lg font-bold text-slate-900">
                    {data.distance ? `${data.distance.toFixed(1)} miles` : "--"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">
                    Est. Travel Time
                  </p>
                  <p className="text-lg font-bold text-slate-900">
                    {/* {data.duration
                      ? `${Math.floor(data.duration / 60)}h ${Math.round(
                          data.duration % 60
                        )}m`
                      : "--"} */}
                  </p>
                </div>
              </div>

              {/* Info Message - NO PRICE */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <p className="text-xs text-blue-800 leading-relaxed">
                  Price will be calculated on the final step after all items and
                  access details are completed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-8 border-t border-slate-200 mt-8">
        <Button
          onClick={onBack}
          variant="outline"
          className="px-8 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 flex items-center gap-2 transition-colors border border-transparent hover:border-slate-200"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!isValid}
          className={cn(
            "px-10 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all",
            isValid
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          )}
        >
          Next Step
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </motion.div>
  );
}
