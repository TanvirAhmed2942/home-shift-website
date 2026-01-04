import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentDate = new Date().toLocaleDateString('en-GB');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">ShiftMyHome – Terms & Conditions (UK)</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 flex-1">
          <div className="prose prose-slate max-w-none">
            <div className="mb-6">
              <p className="text-slate-600"><strong>Effective date:</strong> {currentDate}</p>
              <p className="text-slate-600"><strong>Last updated:</strong> {currentDate}</p>
            </div>

            <p className="text-slate-600 mb-4">
              These Terms & Conditions ("Terms") govern the use of the ShiftMyHome website, mobile applications, dashboards and related services (together, the "Platform"). By accessing or using the Platform, you agree to be bound by these Terms. If you do not agree, you must not use the Platform.
            </p>

            <h3 className="text-lg font-bold text-slate-900 mt-6 mb-3">1. About ShiftMyHome</h3>
            <p className="text-slate-600 mb-2">ShiftMyHome is operated by ShiftMyHome Ltd, a company registered in England and Wales.</p>
            <ul className="list-none pl-0 mb-4 text-slate-600">
              <li><strong>Company number:</strong> [●]</li>
              <li><strong>Registered office:</strong> [●]</li>
              <li><strong>Support email:</strong> support@shiftmyhome.co.uk</li>
              <li><strong>Privacy contact:</strong> privacy@shiftmyhome.co.uk</li>
            </ul>
            <p className="text-slate-600 mb-4">For the purposes of these Terms, "ShiftMyHome", "we", "us", and "our" refer to the Platform operator.</p>

            <h3 className="text-lg font-bold text-slate-900 mt-6 mb-3">2. Nature of the Platform (IMPORTANT)</h3>
            <p className="text-slate-600 mb-4">
              ShiftMyHome operates a digital marketplace that enables customers to book transport, removals and logistics services from independent Transport Partners.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <p className="text-sm text-blue-700 font-medium">
                👉 ShiftMyHome does not provide transport services, does not employ drivers, does not own vehicles, and does not take possession of goods.
              </p>
            </div>
            <p className="text-slate-600 mb-4">
              All transport services are provided by independent Transport Partners. Any service contract for transport is between the Customer and the Transport Partner only.
            </p>

            <h3 className="text-lg font-bold text-slate-900 mt-6 mb-3">3. Definitions</h3>
            <ul className="list-disc pl-5 mb-4 text-slate-600 space-y-2">
              <li><strong>Customer</strong> – a private individual or business booking a job through the Platform</li>
              <li><strong>Transport Partner</strong> – an independent business providing services via the Platform</li>
              <li><strong>Driver</strong> – an individual operating under a Transport Partner</li>
              <li><strong>Job</strong> – a booking for transport or removals</li>
              <li><strong>Accepted Job</strong> – a job confirmed by a Transport Partner</li>
              <li><strong>Price</strong> – the total price displayed for a job</li>
              <li><strong>Extra Charges</strong> – additional charges arising from additional work or conditions</li>
              <li><strong>Platform</strong> – the ShiftMyHome website, apps and systems</li>
            </ul>

            <h3 className="text-lg font-bold text-slate-900 mt-6 mb-3">4. Eligibility & Accounts</h3>
            <ul className="list-disc pl-5 mb-4 text-slate-600">
              <li>4.1 Users must be 18 years or older.</li>
              <li>4.2 Users must provide accurate and complete information.</li>
              <li>4.3 Users are responsible for all activity on their accounts.</li>
              <li>4.4 ShiftMyHome may suspend or terminate accounts for misuse, fraud, or breach of these Terms.</li>
            </ul>

            <h3 className="text-lg font-bold text-slate-900 mt-6 mb-3">5. Payments (Card Only – No Deposit)</h3>
            <h4 className="font-semibold text-slate-800 mt-3 mb-2">5.1 Card Payments Only</h4>
            <p className="text-slate-600 mb-2">All payments on ShiftMyHome are processed by card only via approved third-party payment providers. Cash payments are not supported.</p>
            
            <h4 className="font-semibold text-slate-800 mt-3 mb-2">5.2 No Deposit Model</h4>
            <p className="text-slate-600 mb-2">ShiftMyHome does not require deposits or booking fees unless clearly stated otherwise in the future.</p>
            
            <h4 className="font-semibold text-slate-800 mt-3 mb-2">5.3 Payment Authorisation</h4>
            <p className="text-slate-600 mb-2">By confirming a booking, the Customer authorises the Platform to process:</p>
            <ul className="list-disc pl-5 mb-4 text-slate-600">
              <li>the agreed booking price; and</li>
              <li>any approved Extra Charges in accordance with these Terms.</li>
            </ul>

            <h3 className="text-lg font-bold text-slate-900 mt-6 mb-3">6. Booking Process & Job Acceptance</h3>
            <p className="text-slate-600 mb-2">6.1 A booking becomes active when:</p>
            <ul className="list-disc pl-5 mb-2 text-slate-600">
              <li>job details are submitted accurately;</li>
              <li>a Transport Partner accepts the job; and</li>
              <li>payment authorisation is completed.</li>
            </ul>
            <p className="text-slate-600 mb-2">6.2 <strong>Accepted Job</strong>: A job marked as "Accepted" indicates the Transport Partner has agreed to perform the service based on the information provided.</p>
            <p className="text-slate-600 mb-4">6.3 Acceptance is conditional on job details being accurate. Material discrepancies may result in price adjustment or refusal to proceed.</p>

            <h3 className="text-lg font-bold text-slate-900 mt-6 mb-3">7. Live Tracking & Fleet Tracking</h3>
            <p className="text-slate-600 mb-2">7.1 Live tracking and fleet visibility are provided for informational and coordination purposes only.</p>
            <p className="text-slate-600 mb-2">7.2 Tracking data may be delayed, estimated or unavailable due to:</p>
            <ul className="list-disc pl-5 mb-2 text-slate-600">
              <li>signal loss</li>
              <li>device limitations</li>
              <li>traffic or weather conditions</li>
            </ul>
            <p className="text-slate-600 mb-4">7.3 Tracking does not guarantee arrival times and does not create contractual time obligations.</p>

            <h3 className="text-lg font-bold text-slate-900 mt-6 mb-3">8. Extra Charges (CLEAR RULES)</h3>
            <p className="text-slate-600 mb-4">Extra Charges may apply only where additional work, time, or risk is required beyond the original booking details.</p>
            
            <h4 className="font-semibold text-slate-800 mt-3 mb-2">8.1 Common Extra Charges include (non-exhaustive):</h4>
            <ul className="list-disc pl-5 mb-4 text-slate-600">
              <li>Additional or undisclosed stairs</li>
              <li>Long carry distances</li>
              <li>Waiting time beyond free allowance</li>
              <li>Parking permits, fines, or restricted access</li>
              <li>Furniture assembly or disassembly</li>
              <li>Additional or incorrectly declared items</li>
              <li>Heavy, oversized or specialist items</li>
            </ul>

            <h4 className="font-semibold text-slate-800 mt-3 mb-2">8.2 Transparency</h4>
            <p className="text-slate-600 mb-2">Transport Partners must:</p>
            <ul className="list-disc pl-5 mb-4 text-slate-600">
              <li>clearly explain the reason for Extra Charges;</li>
              <li>apply charges fairly and proportionately;</li>
              <li>record Extra Charges within the Platform where possible.</li>
            </ul>

            <h4 className="font-semibold text-slate-800 mt-3 mb-2">8.3 Customer Responsibility</h4>
            <p className="text-slate-600 mb-4">Customers are responsible for providing accurate job details. Incorrect or incomplete information may result in lawful Extra Charges.</p>

            <h3 className="text-lg font-bold text-slate-900 mt-6 mb-3">9. Time Windows & Waiting Time</h3>
            <p className="text-slate-600 mb-2">9.1 Each booking includes 15 minutes of free waiting time at pickup and delivery unless stated otherwise.</p>
            <p className="text-slate-600 mb-2">9.2 Waiting beyond this allowance may be charged at £X per additional 15-minute interval.</p>
            <p className="text-slate-600 mb-2">9.3 Waiting time may arise due to:</p>
            <ul className="list-disc pl-5 mb-4 text-slate-600">
              <li>lack of access</li>
              <li>incomplete packing</li>
              <li>missing keys or contacts</li>
              <li>lift unavailability</li>
              <li>customer delay</li>
            </ul>

            <h3 className="text-lg font-bold text-slate-900 mt-6 mb-3">10. Cancellations & Rescheduling</h3>
            <p className="text-slate-600 mb-2">10.1 Cancellations depend on timing and work already undertaken.</p>
            <p className="text-slate-600 mb-2">10.2 ShiftMyHome may assist in finding an alternative Transport Partner but does not guarantee availability.</p>
            <p className="text-slate-600 mb-4">10.3 Rescheduling may result in price changes depending on availability and demand.</p>

            <h3 className="text-lg font-bold text-slate-900 mt-6 mb-3">11. Damage, Loss & Claims</h3>
            <p className="text-slate-600 mb-2">11.1 Transport Partners are responsible for:</p>
            <ul className="list-disc pl-5 mb-2 text-slate-600">
              <li>service performance;</li>
              <li>insurance;</li>
              <li>legal compliance.</li>
            </ul>
            <p className="text-slate-600 mb-2">11.2 Claims for damage or loss must be raised directly with the Transport Partner.</p>
            <p className="text-slate-600 mb-4">11.3 ShiftMyHome may facilitate communication but does not guarantee compensation.</p>

            <h3 className="text-lg font-bold text-slate-900 mt-6 mb-3">12. Dispute Resolution Workflow</h3>
            <p className="text-slate-600 mb-2">All disputes follow this process:</p>
            <ol className="list-decimal pl-5 mb-4 text-slate-600 space-y-2">
              <li><strong>Reported</strong> – issue submitted via Platform</li>
              <li><strong>Under Review</strong> – evidence reviewed (messages, photos, tracking, timestamps)</li>
              <li><strong>Resolved</strong> – outcome recorded</li>
            </ol>
            <p className="text-slate-600 mb-4">Late or insufficient evidence may affect outcomes.</p>

            <h3 className="text-lg font-bold text-slate-900 mt-6 mb-3">13. Chargeback Policy (ANTI-ABUSE)</h3>
            <p className="text-slate-600 mb-2">13.1 Customers must contact ShiftMyHome support before initiating chargebacks.</p>
            <p className="text-slate-600 mb-2">13.2 Unauthorised or abusive chargebacks may result in:</p>
            <ul className="list-disc pl-5 mb-2 text-slate-600">
              <li>account suspension or termination;</li>
              <li>restriction of future bookings;</li>
              <li>recovery of administrative costs where permitted by law.</li>
            </ul>
            <p className="text-slate-600 mb-2">13.3 ShiftMyHome may submit evidence including:</p>
            <ul className="list-disc pl-5 mb-4 text-slate-600">
              <li>booking logs</li>
              <li>chat records</li>
              <li>tracking data</li>
              <li>timestamps and photos.</li>
            </ul>

            <h3 className="text-lg font-bold text-slate-900 mt-6 mb-3">14. Prohibited Items & Safety</h3>
            <p className="text-slate-600 mb-2">The Platform may not be used to transport:</p>
            <ul className="list-disc pl-5 mb-4 text-slate-600">
              <li>illegal or stolen goods</li>
              <li>weapons, explosives, or controlled substances</li>
              <li>hazardous materials without lawful disclosure</li>
            </ul>
            <p className="text-slate-600 mb-4">Customers must ensure items are lawful, accessible, and properly prepared.</p>

            <h3 className="text-lg font-bold text-slate-900 mt-6 mb-3">15. Reviews & Feedback</h3>
            <ul className="list-disc pl-5 mb-4 text-slate-600">
              <li>15.1 Reviews must be honest and relevant.</li>
              <li>15.2 Fake, abusive, or misleading reviews may be removed.</li>
              <li>15.3 Reviews do not constitute guarantees of service quality.</li>
            </ul>

            <h3 className="text-lg font-bold text-slate-900 mt-6 mb-3">16. Intellectual Property</h3>
            <p className="text-slate-600 mb-4">All Platform software, branding and content (excluding User Content) belong to ShiftMyHome or its licensors. Unauthorised use is prohibited.</p>

            <h3 className="text-lg font-bold text-slate-900 mt-6 mb-3">17. Limitation of Liability (KEY)</h3>
            <p className="text-slate-600 mb-2">Nothing limits liability for death or personal injury caused by negligence, fraud, or liabilities that cannot be excluded by law.</p>
            <p className="text-slate-600 mb-2">Subject to this:</p>
            <ul className="list-disc pl-5 mb-4 text-slate-600">
              <li>ShiftMyHome is not liable for acts or omissions of Transport Partners or Drivers.</li>
              <li>ShiftMyHome is not liable for loss or damage to goods during transport.</li>
              <li>Total liability of ShiftMyHome is limited to the Platform fees paid (or £100, whichever is lower).</li>
            </ul>

            <h3 className="text-lg font-bold text-slate-900 mt-6 mb-3">18. Indemnity</h3>
            <p className="text-slate-600 mb-4">Users agree to indemnify ShiftMyHome against losses arising from misuse of the Platform or breach of these Terms.</p>

            <h3 className="text-lg font-bold text-slate-900 mt-6 mb-3">19. Suspension & Termination</h3>
            <p className="text-slate-600 mb-2">ShiftMyHome may suspend or terminate access where:</p>
            <ul className="list-disc pl-5 mb-4 text-slate-600">
              <li>Terms are breached;</li>
              <li>fraud or abuse is suspected;</li>
              <li>platform integrity is at risk.</li>
            </ul>

            <h3 className="text-lg font-bold text-slate-900 mt-6 mb-3">20. Privacy & Data Protection</h3>
            <p className="text-slate-600 mb-4">Personal data is processed in accordance with the ShiftMyHome Privacy Policy (UK).</p>

            <h3 className="text-lg font-bold text-slate-900 mt-6 mb-3">21. Governing Law & Jurisdiction</h3>
            <p className="text-slate-600 mb-4">These Terms are governed by the laws of England and Wales. Courts of England and Wales have exclusive jurisdiction.</p>

            <h3 className="text-lg font-bold text-slate-900 mt-6 mb-3">22. Changes to These Terms</h3>
            <p className="text-slate-600 mb-4">We may update these Terms from time to time. Continued use of the Platform constitutes acceptance of the updated Terms.</p>

            <h3 className="text-lg font-bold text-slate-900 mt-6 mb-3">23. Contact</h3>
            <p className="text-slate-600 mb-2">For questions or concerns:</p>
            <p className="text-slate-600 mb-4">📧 support@shiftmyhome.co.uk</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            I Agree
          </button>
        </div>
      </div>
    </div>
  );
}
