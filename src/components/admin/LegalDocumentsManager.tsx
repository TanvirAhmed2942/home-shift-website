import React, { useState } from 'react';
import { FileText, Save, Eye, Calendar, Edit3 } from 'lucide-react';

interface LegalDocument {
  id: string;
  title: string;
  content: string;
  lastUpdated: string;
  version: string;
}

const DEFAULT_TERMS: LegalDocument = {
  id: 'terms',
  title: 'Terms & Conditions',
  content: `# ShiftMyHome Terms & Conditions

**Last Updated:** ${new Date().toLocaleDateString('en-GB')}

## 1. Introduction

Welcome to ShiftMyHome. These terms and conditions outline the rules and regulations for the use of our moving and logistics services.

## 2. Services

ShiftMyHome provides:
- Residential moving services
- Commercial moving services
- Furniture delivery
- Storage solutions
- Packing services
- Man and van services

## 3. Booking & Payment

### 3.1 Quotations
- All quotations are valid for 30 days from the date of issue
- Prices are subject to change based on final inventory
- A deposit of 20% may be required to confirm booking

### 3.2 Payment Terms
- Final payment is due upon completion of service
- We accept cash, card, and bank transfer
- Late payment may incur additional charges

## 4. Customer Responsibilities

You agree to:
- Provide accurate inventory information
- Ensure access to both pickup and delivery locations
- Prepare items for transport as instructed
- Declare any fragile or valuable items

## 5. Liability & Insurance

### 5.1 Insurance Coverage
- All moves include basic goods in transit insurance
- Additional insurance available upon request
- Claims must be made within 7 days of delivery

### 5.2 Limitations
We are not liable for:
- Items not declared on inventory
- Damage caused by improper packing
- Acts of God or circumstances beyond our control

## 6. Cancellations & Refunds

### 6.1 Cancellation Policy
- More than 7 days notice: Full refund of deposit
- 3-7 days notice: 50% refund of deposit
- Less than 3 days notice: No refund

## 7. Data Protection

We are committed to protecting your personal data in accordance with GDPR regulations. See our Privacy Policy for details.

## 8. Complaints Procedure

If you have any complaints:
1. Reach out to us within 7 days
2. We will investigate and respond within 14 days
3. Escalation to independent dispute resolution if needed

## 9. Governing Law

These terms are governed by the laws of England and Wales.

## 10. Contact Information

**ShiftMyHome**
Email: info@shiftmyhome.com
Phone: +44 20 1234 5678
Address: 123 Business Park, London, UK

---

By using our services, you agree to these terms and conditions.`,
  lastUpdated: new Date().toISOString(),
  version: '1.0',
};

const DEFAULT_PRIVACY: LegalDocument = {
  id: 'privacy',
  title: 'Privacy Policy',
  content: `# Privacy Policy

**Last Updated:** ${new Date().toLocaleDateString('en-GB')}

## 1. Introduction

ShiftMyHome ("we", "our", "us") is committed to protecting your privacy and personal data.

## 2. Information We Collect

### 2.1 Personal Information
- Name and contact details
- Pickup and delivery addresses
- Payment information
- Inventory details

### 2.2 Automatic Information
- IP address
- Browser type
- Cookie data

## 3. How We Use Your Information

We use your data to:
- Provide moving services
- Process payments
- Send booking confirmations
- Improve our services
- Comply with legal obligations

## 4. Data Sharing

We may share your data with:
- Delivery partners and drivers
- Payment processors
- Insurance providers
- Legal authorities (when required)

We never sell your personal data to third parties.

## 5. Data Security

We implement appropriate security measures including:
- Encrypted data transmission
- Secure servers
- Access controls
- Regular security audits

## 6. Your Rights

Under GDPR, you have the right to:
- Access your personal data
- Correct inaccurate data
- Request deletion of your data
- Object to processing
- Data portability

## 7. Cookies

We use cookies to:
- Remember your preferences
- Analyze website traffic
- Improve user experience

You can disable cookies in your browser settings.

## 8. Data Retention

We retain your data for:
- Active bookings: Duration of service
- Completed bookings: 7 years (for legal/tax purposes)
- Marketing data: Until you unsubscribe

## 9. Children's Privacy

Our services are not directed at children under 18. We do not knowingly collect data from minors.

## 10. Changes to This Policy

We may update this policy from time to time. Check this page regularly for updates.

## 11. Get In Touch

For privacy-related questions:
- Email: privacy@shiftmyhome.com
- Phone: +44 20 1234 5678
- Address: 123 Business Park, London, UK

---

**Data Controller:** ShiftMyHome Ltd
**ICO Registration:** [Registration Number]`,
  lastUpdated: new Date().toISOString(),
  version: '1.0',
};

const DEFAULT_DRIVER_CONTRACT: LegalDocument = {
  id: 'driver-contract',
  title: 'Driver Partner Agreement',
  content: `# DRIVER PARTNER AGREEMENT

**Between:** ShiftMyHome Ltd ("the Company")  
**And:** The Driver Partner ("the Partner")

**Date:** ${new Date().toLocaleDateString('en-GB')}

---

## 1. AGREEMENT PURPOSE

This Agreement sets out the terms under which the Partner will provide moving and logistics services through the ShiftMyHome platform.

## 2. NATURE OF RELATIONSHIP

### 2.1 Independent Contractor Status
- The Partner operates as an independent contractor, not an employee
- The Partner is responsible for their own tax and National Insurance
- The Partner has the freedom to accept or decline job offers
- The Partner can work for other companies

### 2.2 Right to Work
The Partner confirms they have the legal right to work in the UK and will provide:
- Valid driver's license
- Vehicle registration and insurance
- Proof of goods in transit insurance
- DBS check (if applicable)

## 3. SERVICES PROVIDED

The Partner agrees to provide:
- Residential and commercial moving services
- Furniture delivery and collection
- Loading and unloading assistance
- Safe transportation of customer goods
- Professional customer service

## 4. PAYMENT TERMS

### 4.1 Revenue Split
- **Driver Partner:** 70% of customer payment
- **Platform Fee (ShiftMyHome):** 30% of customer payment

### 4.2 Payment Processing
- Payments processed within 24-48 hours of job completion
- Weekly invoicing and settlement
- Paid via bank transfer to registered account
- VAT handling (if driver is VAT registered)

### 4.3 Customer Tips
- 100% of customer tips go to the driver
- Tips are paid separately from base earnings

## 5. JOB ACCEPTANCE & EXECUTION

### 5.1 Job Marketplace
- Jobs are published to the driver marketplace
- Partners can view job details before accepting
- Partners can express interest in jobs
- Admin reviews and assigns jobs based on suitability

### 5.2 Acceptance Obligations
Once a job is accepted:
- The Partner MUST complete the job as scheduled
- Late cancellations may result in compensation to customer
- Professional conduct is mandatory
- Customer property must be treated with care

### 5.3 Cancellation Policy
- **24+ hours before job:** No penalty
- **12-24 hours:** Partner may receive reduced compensation
- **Less than 12 hours:** Partner receives 50% of agreed fee
- Emergency cancellations must be reported immediately

## 6. VEHICLE & EQUIPMENT REQUIREMENTS

### 6.1 Vehicle Standards
Partners must maintain:
- Valid MOT certificate
- Comprehensive insurance including goods in transit
- Clean and roadworthy vehicle
- Appropriate size for accepted jobs

### 6.2 Equipment
Partners must provide:
- Moving blankets and straps
- Trolley or sack truck
- Basic hand tools
- Safety equipment (high-vis, gloves)

## 7. INSURANCE & LIABILITY

### 7.1 Required Insurance
- Public Liability Insurance (minimum £5 million)
- Goods in Transit Insurance (minimum £50,000)
- Vehicle insurance (business use)
- Employer's Liability (if employing crew)

### 7.2 Damage & Claims
- Partners are responsible for damage caused by negligence
- Customers can file claims within 7 days
- Claims are investigated fairly
- Persistent claims may result in suspension

## 8. PROFESSIONAL STANDARDS

Partners must:
- Arrive on time for all bookings
- Dress professionally and maintain good hygiene
- Communicate professionally with customers
- Handle complaints calmly and professionally
- Not be under the influence of alcohol or drugs
- Follow health & safety regulations

## 9. PLATFORM USAGE

### 9.1 Account Security
- Keep login credentials secure
- Report unauthorized access immediately
- Do not share account with others
- Regularly update contact information

### 9.2 App & Web Dashboard
- Partners must use the platform for job management
- Track job status updates in real-time
- Upload photos and signatures as required
- Respond to messages within reasonable time

## 10. DATA PROTECTION & CONFIDENTIALITY

Partners must:
- Comply with GDPR and data protection laws
- Not share customer information with third parties
- Only use customer data for completing jobs
- Delete customer data after job completion
- Report any data breaches immediately

## 11. RATINGS & REVIEWS

### 11.1 Customer Ratings
- Customers can rate partners after each job
- Ratings are based on punctuality, professionalism, and care
- Consistently low ratings may result in account review
- Partners can respond to reviews

### 11.2 Quality Standards
Minimum standards:
- Average rating: 4.0 stars or above
- Completion rate: 95% or above
- Response time: Within 1 hour during working hours

## 12. SUSPENSION & TERMINATION

### 12.1 Company Right to Suspend
The Company may suspend a Partner for:
- Repeated customer complaints
- Fraudulent activity
- Breach of agreement terms
- Safety violations
- Failure to maintain insurance

### 12.2 Partner Right to Terminate
Partners can terminate this agreement:
- With 14 days written notice
- Must complete all accepted jobs
- Outstanding payments will be settled

### 12.3 Immediate Termination
Either party may terminate immediately for:
- Serious breach of contract
- Criminal activity
- Gross misconduct
- Health & safety violations

## 13. PAYMENT OF EXPENSES

### 13.1 Partner Responsibilities
Partners are responsible for:
- Vehicle fuel and maintenance
- Parking fees and tolls
- Equipment purchase and maintenance
- Insurance premiums
- Business expenses

### 13.2 No Reimbursement
ShiftMyHome does not reimburse expenses unless agreed in writing for specific jobs.

## 14. TAX OBLIGATIONS

### 14.1 Self-Assessment
Partners must:
- Register as self-employed with HMRC
- Complete annual self-assessment tax returns
- Pay Income Tax and National Insurance
- Keep accurate financial records

### 14.2 VAT (if applicable)
- VAT-registered partners must charge VAT
- ShiftMyHome will collect VAT on platform fee
- Partners receive net payment after VAT

## 15. DISPUTE RESOLUTION

### 15.1 Informal Resolution
- Disputes should first be raised with ShiftMyHome support
- We aim to resolve disputes within 14 days
- Mediation is encouraged

### 15.2 Formal Process
If informal resolution fails:
- Either party may initiate formal dispute resolution
- Governed by laws of England and Wales
- Jurisdiction: Courts of England and Wales

## 16. INTELLECTUAL PROPERTY

- ShiftMyHome owns all platform IP and branding
- Partners may use ShiftMyHome branding for authorized purposes
- Partners retain ownership of their own business name
- Unauthorized use of branding may result in termination

## 17. CHANGES TO THIS AGREEMENT

- ShiftMyHome may update this agreement with 30 days notice
- Partners will be notified via email and platform
- Continued use constitutes acceptance
- Partners may terminate if they disagree with changes

## 18. BACKGROUND CHECKS

Partners must consent to:
- DBS check (Basic or Enhanced depending on service)
- Driving license check
- Right to work verification
- Reference checks

## 19. REFERRAL PROGRAMME

- Partners can refer other drivers
- Referral bonuses available (see current programme)
- Referred drivers must meet all requirements

## 20. CONTACT INFORMATION

**ShiftMyHome Ltd**  
Email: partners@shiftmyhome.com  
Phone: +44 20 1234 5678  
Address: 123 Business Park, London, UK  

**Partner Support Hours:**  
Monday - Friday: 8am - 8pm  
Saturday: 9am - 5pm  
Sunday: Closed  

---

## ACCEPTANCE

By registering as a Driver Partner on the ShiftMyHome platform, you confirm that you have read, understood, and agree to be bound by the terms of this Agreement.

**Version:** 1.0  
**Effective Date:** ${new Date().toLocaleDateString('en-GB')}

---

*This is a legally binding agreement. Please read carefully and seek independent legal advice if needed.*`,
  lastUpdated: new Date().toISOString(),
  version: '1.0',
};

export function LegalDocumentsManager() {
  const [documents, setDocuments] = useState<LegalDocument[]>([
    DEFAULT_TERMS,
    DEFAULT_PRIVACY,
    DEFAULT_DRIVER_CONTRACT,
  ]);
  const [editingDoc, setEditingDoc] = useState<LegalDocument | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSave = () => {
    if (!editingDoc) return;

    setDocuments(
      documents.map((doc) =>
        doc.id === editingDoc.id
          ? { ...editingDoc, lastUpdated: new Date().toISOString() }
          : doc
      )
    );
    setHasChanges(true);
    alert('✅ Document saved successfully!');
  };

  const handlePublish = () => {
    // In production, publish to live website
    alert('✅ All legal documents published to website!');
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Legal Documents Manager</h2>
          <p className="text-slate-600 mt-1">Manage Terms & Conditions, Privacy Policy, and other legal pages</p>
        </div>
        {hasChanges && (
          <button
            onClick={handlePublish}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Save className="w-4 h-4" />
            Publish Changes
          </button>
        )}
      </div>

      {editingDoc ? (
        /* Editor View */
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{editingDoc.title}</h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Last updated: {new Date(editingDoc.lastUpdated).toLocaleDateString('en-GB')}
                  </div>
                  <div>Version: {editingDoc.version}</div>
                </div>
              </div>
              <button
                onClick={() => setEditingDoc(null)}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-all"
              >
                Back to List
              </button>
            </div>
          </div>

          <div className="p-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Document Content (Markdown)</label>
            <textarea
              value={editingDoc.content}
              onChange={(e) => setEditingDoc({ ...editingDoc, content: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none font-mono text-sm"
              rows={30}
            />
            <p className="text-xs text-slate-500 mt-2">
              💡 Tip: Use Markdown formatting (# for headings, ** for bold, etc.)
            </p>
          </div>

          <div className="p-6 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              onClick={() => alert('🔍 Preview would open in new window')}
              className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-all"
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              <Save className="w-4 h-4" />
              Save Document
            </button>
          </div>
        </div>
      ) : (
        /* List View */
        <div className="grid gap-6">
          {documents.map((doc) => (
            <div key={doc.id} className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{doc.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(doc.lastUpdated).toLocaleDateString('en-GB')}
                      </div>
                      <div>Version: {doc.version}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditingDoc(doc)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </button>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="text-sm text-slate-700 line-clamp-4 whitespace-pre-wrap">
                    {doc.content.substring(0, 300)}...
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Info */}
      {!editingDoc && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <strong>Important:</strong> These legal documents are displayed on your website. Make sure they comply
              with UK law and GDPR regulations. Consider consulting a legal professional before publishing changes.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}