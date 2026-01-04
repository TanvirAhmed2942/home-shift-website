import React from 'react';
import { HouseMoveForm } from './booking-forms/HouseMoveForm';
import { FurnitureForm } from './booking-forms/FurnitureForm';
import { ManVanForm } from './booking-forms/ManVanForm';
import { MotorbikeForm } from './booking-forms/MotorbikeForm';
import { StorePickupForm } from './booking-forms/StorePickupForm';
import { OtherDeliveryForm } from './booking-forms/OtherDeliveryForm';

interface BookingFormProps {
  selectedService: string | null;
  onShowTerms: () => void;
  onShowLogin: (tab: 'customer' | 'driver') => void;
  onViewPricing: () => void;
}

export function BookingForm({ selectedService, onShowTerms, onShowLogin, onViewPricing }: BookingFormProps) {
  // Render specific form based on selected service
  switch (selectedService) {
    case 'house-move':
      return <HouseMoveForm onShowTerms={onShowTerms} onViewPricing={onViewPricing} />;
    
    case 'furniture':
      return <FurnitureForm onShowTerms={onShowTerms} onViewPricing={onViewPricing} />;
    
    case 'man-van':
      return <ManVanForm onShowTerms={onShowTerms} />;
    
    case 'motorbike':
      return <MotorbikeForm onShowTerms={onShowTerms} />;
    
    case 'store-pickup':
      return <StorePickupForm onShowTerms={onShowTerms} />;
    
    case 'other':
      return <OtherDeliveryForm onShowTerms={onShowTerms} />;
    
    default:
      return null;
  }
}
