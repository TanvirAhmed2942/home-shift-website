import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
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
          <h2 className="text-xl font-bold text-slate-900">Privacy Policy – ShiftMyHome (UK Only)</h2>
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
            <p className="text-slate-600 mb-4 font-semibold">
              Last updated: {new Date().toLocaleDateString('en-GB')}
            </p>
            
            <p className="text-slate-600 mb-4">
              ShiftMyHome ("we", "us", "our") respects your privacy and is committed to protecting personal data in accordance with the UK GDPR and the Data Protection Act 2018.
            </p>
            <p className="text-slate-600 mb-4">
              This Privacy Policy explains how we collect, use, store, and protect personal data when you use the ShiftMyHome website, applications, and related services (together, the "Platform").
            </p>
            <p className="text-slate-600 mb-4">
              This policy applies only within the United Kingdom.
            </p>

            <h3 className="text-lg font-bold text-slate-900 mt-6 mb-3">1. Who We Are</h3>
            <p className="text-slate-600 mb-4">
              ShiftMyHome operates a digital platform that connects customers with independent transport partners and drivers for removals, logistics, and transport services across the UK.
            </p>
            <p className="text-slate-600 mb-4">
              For data protection purposes, ShiftMyHome is the data controller of personal data collected through the Platform.
            </p>

            <h3 className="text-lg font-bold text-slate-900 mt-6 mb-3">2. Personal Data We Collect</h3>
            <p className="text-slate-600 mb-2">We may collect and process the following categories of personal data:</p>
            
            <h4 className="font-semibold text-slate-800 mt-3 mb-2">a) Identity & Contact Information</h4>
            <ul className="list-disc pl-5 mb-4 text-slate-600">
              <li>Full name</li>
              <li>Email address</li>
              <li>Telephone number</li>
            </ul>

            <h4 className="font-semibold text-slate-800 mt-3 mb-2">b) Account Information</h4>
            <ul className="list-disc pl-5 mb-4 text-slate-600">
              <li>Login details</li>
              <li>Account status</li>
              <li>User preferences</li>
            </ul>

            <h4 className="font-semibold text-slate-800 mt-3 mb-2">c) Booking & Service Information</h4>
            <ul className="list-disc pl-5 mb-4 text-slate-600">
              <li>Collection and delivery addresses</li>
              <li>Job descriptions and item details</li>
              <li>Booking history</li>
              <li>Messages exchanged via the Platform</li>
            </ul>

            <h4 className="font-semibold text-slate-800 mt-3 mb-2">d) Payment & Transaction Information</h4>
            <ul className="list-disc pl-5 mb-4 text-slate-600">
              <li>Payment references</li>
              <li>Invoices and payout records</li>
            </ul>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <p className="text-sm text-yellow-700">
                ⚠️ ShiftMyHome does not store full card details. Payments are handled by secure third-party payment providers.
              </p>
            </div>

            <h4 className="font-semibold text-slate-800 mt-3 mb-2">e) Technical Information</h4>
            <ul className="list-disc pl-5 mb-4 text-slate-600">
              <li>IP address</li>
              <li>Device and browser data</li>
              <li>Usage logs and diagnostic data</li>
            </ul>

            <h4 className="font-semibold text-slate-800 mt-3 mb-2">f) Transport Partner & Driver Information (where applicable)</h4>
            <ul className="list-disc pl-5 mb-4 text-slate-600">
              <li>Vehicle details</li>
              <li>Insurance and compliance documents</li>
              <li>Performance and service-related records</li>
            </ul>

            <h3 className="text-lg font-bold text-slate-900 mt-6 mb-3">3. How We Use Personal Data</h3>
            <p className="text-slate-600 mb-2">We use personal data only where permitted by law, including to:</p>
            <ul className="list-disc pl-5 mb-4 text-slate-600">
              <li>Provide and manage access to the Platform</li>
              <li>Process bookings, payments, and payouts</li>
              <li>Enable communication between customers and transport partners</li>
              <li>Verify identity and eligibility</li>
              <li>Monitor service quality and handle complaints or disputes</li>
              <li>Prevent fraud and misuse of the Platform</li>
              <li>Meet legal and regulatory obligations</li>
              <li>Improve our services and user experience</li>
            </ul>

            <h3 className="text-lg font-bold text-slate-900 mt-6 mb-3">4. Lawful Basis for Processing</h3>
            <p className="text-slate-600 mb-2">We process personal data based on one or more of the following lawful bases under UK GDPR:</p>
            <ul className="list-disc pl-5 mb-4 text-slate-600">
              <li>Performance of a contract</li>
              <li>Legal obligation</li>
              <li>Legitimate interests (platform operation, security, service improvement)</li>
              <li>Consent, where required (e.g. marketing)</li>
            </ul>
            <p className="text-slate-600 mb-4">
              Where consent is used, it may be withdrawn at any time.
            </p>

            <h3 className="text-lg font-bold text-slate-900 mt-6 mb-3">5. Sharing Personal Data</h3>
            <p className="text-slate-600 mb-2">We may share personal data only where necessary, including with:</p>
            <ul className="list-disc pl-5 mb-4 text-slate-600">
              <li>Customers and transport partners (to complete a booking)</li>
              <li>Payment processors</li>
              <li>IT, hosting, and platform service providers</li>
              <li>Professional advisers (legal, accounting, compliance)</li>
              <li>Public authorities where required by law</li>
            </ul>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
              <p className="text-sm text-blue-700">
                🚫 We do not sell personal data.
              </p>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mt-6 mb-3">6. Data Security</h3>
            <p className="text-slate-600 mb-4">
              We implement appropriate technical and organisational measures to protect personal data against unauthorised access, loss, alteration, or disclosure. Access is restricted to authorised personnel and trusted service providers.
            </p>

            <h3 className="text-lg font-bold text-slate-900 mt-6 mb-3">7. Data Retention</h3>
            <p className="text-slate-600 mb-2">Personal data is retained only for as long as necessary to:</p>
            <ul className="list-disc pl-5 mb-4 text-slate-600">
              <li>Deliver services</li>
              <li>Meet legal, tax, and accounting requirements</li>
              <li>Resolve disputes and enforce agreements</li>
            </ul>
            <p className="text-slate-600 mb-4">
              Retention periods depend on the type and purpose of the data.
            </p>

            <h3 className="text-lg font-bold text-slate-900 mt-6 mb-3">8. Your Rights (UK GDPR)</h3>
            <p className="text-slate-600 mb-2">You have the right to:</p>
            <ul className="list-disc pl-5 mb-4 text-slate-600">
              <li>Access your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request erasure (where applicable)</li>
              <li>Restrict or object to processing</li>
              <li>Request data portability</li>
              <li>Withdraw consent at any time</li>
              <li>Lodge a complaint with the Information Commissioner's Office (ICO)</li>
            </ul>

            <h3 className="text-lg font-bold text-slate-900 mt-6 mb-3">9. Identity Verification</h3>
            <p className="text-slate-600 mb-4">
              For security reasons, we may request additional information to verify your identity before responding to certain requests. This helps protect personal data from unauthorised access.
            </p>

            <h3 className="text-lg font-bold text-slate-900 mt-6 mb-3">10. Marketing Communications</h3>
            <p className="text-slate-600 mb-4">
              Service-related communications may be sent as part of our contractual relationship. Marketing messages will only be sent where permitted by law, and you may opt out at any time.
            </p>

            <h3 className="text-lg font-bold text-slate-900 mt-6 mb-3">11. Third-Party Links</h3>
            <p className="text-slate-600 mb-4">
              Our Platform may include links to third-party websites or services. We are not responsible for their privacy practices.
            </p>

            <h3 className="text-lg font-bold text-slate-900 mt-6 mb-3">12. Changes to This Policy</h3>
            <p className="text-slate-600 mb-4">
              We may update this Privacy Policy from time to time. Any changes will be published on the Platform with an updated revision date.
            </p>

            <h3 className="text-lg font-bold text-slate-900 mt-6 mb-3">13. Contact Details</h3>
            <p className="text-slate-600 mb-2">For privacy-related questions or requests:</p>
            <ul className="list-none pl-0 mb-4 text-slate-600">
              <li><strong>Email:</strong> privacy@shiftmyhome.co.uk</li>
              <li><strong>Data Protection Contact:</strong> ShiftMyHome</li>
            </ul>
            <p className="text-slate-600 mb-4">
              If you are not satisfied with our response, you may contact the UK Information Commissioner's Office (ICO).
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
