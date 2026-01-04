export const VARIATION_REASONS = [
  { id: 'extra_items', label: 'Extra Items', unit: 'items', rate: 15, description: 'Items not on original list' },
  { id: 'wrong_volume', label: 'Wrong Booking (Volume)', unit: 'm3', rate: 45, description: 'Vehicle too small / extra volume' },
  { id: 'extra_floor', label: 'Extra Floors (No Lift)', unit: 'floors', rate: 10, description: 'Per flight of stairs per person' },
  { id: 'waiting_time', label: 'Waiting Time', unit: 'minutes', rate: 1, description: '£60/hour charged per minute' },
  { id: 'long_carry', label: 'Long Carry (>20m)', unit: 'meters', rate: 2, description: 'Distance from van to door' },
  { id: 'parking', label: 'Parking Fees/Fines', unit: 'GBP', rate: 1, description: 'Direct cost reimbursement' },
  { id: 'extra_stop', label: 'Extra Stop', unit: 'stops', rate: 30, description: 'Unplanned stop en route' },
  { id: 'other', label: 'Other', unit: 'GBP', rate: 1, description: 'Miscellaneous' },
];

export const calculateVariationCost = (reasonId: string, value: number) => {
  const reason = VARIATION_REASONS.find(r => r.id === reasonId);
  if (!reason) return 0;
  return reason.rate * value;
};
