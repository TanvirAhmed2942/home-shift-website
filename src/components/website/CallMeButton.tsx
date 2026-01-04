import React from "react";
import { Phone } from "lucide-react";

interface CallMeButtonProps {
  onClick: () => void;
}

export function CallMeButton({ onClick }: CallMeButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 h-16 w-16 right-6 bg-slate-900 hover:bg-slate-800 text-white p-4 rounded-full shadow-2xl hover:shadow-slate-900/50 cursor-pointer transition-all z-[9997] group flex items-center justify-center"
      title="Request Callback"
    >
      <Phone className="w-6 h-6" />
      <span className="sr-only">Request Callback</span>
    </button>
  );
}
