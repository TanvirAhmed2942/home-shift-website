/**
 * Insurance & Claims Management System
 * Handles insurance coverage, damage claims, photo evidence, and certificate generation
 */

export interface InsuranceCoverage {
  id: string;
  type: 'basic' | 'standard' | 'premium' | 'comprehensive';
  name: string;
  description: string;
  coverageAmount: number;
  deductible: number;
  features: string[];
  price: number;
  includedByDefault: boolean;
}

export interface Claim {
  id: string;
  claimNumber: string;
  jobReference: string;
  customerId: string;
  customerName: string;
  driverId: string;
  driverName: string;
  
  // Claim details
  type: 'damage' | 'loss' | 'delay' | 'other';
  description: string;
  incidentDate: Date;
  reportedDate: Date;
  
  // Damage details
  damagedItems: {
    itemName: string;
    itemValue: number;
    damageDescription: string;
    photos: string[];
  }[];
  
  // Financial
  claimAmount: number;
  approvedAmount?: number;
  deductible: number;
  
  // Status
  status: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'paid' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Evidence
  photos: string[];
  documents: string[];
  witnessStatements?: string[];
  
  // Resolution
  assessorNotes?: string;
  resolutionNotes?: string;
  resolutionDate?: Date;
  paymentDate?: Date;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface InsuranceCertificate {
  id: string;
  certificateNumber: string;
  jobReference: string;
  customerId: string;
  customerName: string;
  coverage: InsuranceCoverage;
  validFrom: Date;
  validUntil: Date;
  policyTerms: string;
  issueDate: Date;
}

// Insurance coverage plans
export const INSURANCE_PLANS: InsuranceCoverage[] = [
  {
    id: 'basic',
    type: 'basic',
    name: 'Basic Protection',
    description: 'Essential coverage for your move',
    coverageAmount: 5000,
    deductible: 100,
    features: [
      'Up to £5,000 coverage',
      '£100 deductible',
      'Damage to furniture',
      'Basic liability protection',
    ],
    price: 0, // Included free
    includedByDefault: true,
  },
  {
    id: 'standard',
    type: 'standard',
    name: 'Standard Protection',
    description: 'Enhanced coverage for peace of mind',
    coverageAmount: 15000,
    deductible: 50,
    features: [
      'Up to £15,000 coverage',
      '£50 deductible',
      'Damage & loss protection',
      'Electronics coverage',
      'Priority claim processing',
    ],
    price: 29.99,
    includedByDefault: false,
  },
  {
    id: 'premium',
    type: 'premium',
    name: 'Premium Protection',
    description: 'Comprehensive coverage for high-value items',
    coverageAmount: 50000,
    deductible: 25,
    features: [
      'Up to £50,000 coverage',
      '£25 deductible',
      'Full replacement value',
      'Antiques & art coverage',
      'Storage protection',
      'Fast-track claims (24h)',
    ],
    price: 79.99,
    includedByDefault: false,
  },
  {
    id: 'comprehensive',
    type: 'comprehensive',
    name: 'Comprehensive Protection',
    description: 'Maximum protection for complete peace of mind',
    coverageAmount: 100000,
    deductible: 0,
    features: [
      'Up to £100,000 coverage',
      'Zero deductible',
      'Full replacement value',
      'All items covered',
      'International coverage',
      'Storage protection (90 days)',
      'Express claims (12h response)',
      'Legal assistance included',
    ],
    price: 149.99,
    includedByDefault: false,
  },
];

/**
 * Generate claim number
 */
export function generateClaimNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 99999).toString().padStart(5, '0');
  return `CLM-${year}${month}-${random}`;
}

/**
 * Generate certificate number
 */
export function generateCertificateNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const random = Math.floor(Math.random() * 9999999).toString().padStart(7, '0');
  return `INS-${year}-${random}`;
}

/**
 * Create a new claim
 */
export function createClaim(data: {
  jobReference: string;
  customerId: string;
  customerName: string;
  driverId: string;
  driverName: string;
  type: Claim['type'];
  description: string;
  damagedItems: Claim['damagedItems'];
  photos: string[];
  documents?: string[];
}): Claim {
  const claimNumber = generateClaimNumber();
  
  const claimAmount = data.damagedItems.reduce((sum, item) => sum + item.itemValue, 0);
  
  const claim: Claim = {
    id: `claim-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    claimNumber,
    jobReference: data.jobReference,
    customerId: data.customerId,
    customerName: data.customerName,
    driverId: data.driverId,
    driverName: data.driverName,
    type: data.type,
    description: data.description,
    incidentDate: new Date(),
    reportedDate: new Date(),
    damagedItems: data.damagedItems,
    claimAmount,
    deductible: 100, // Default deductible
    status: 'submitted',
    priority: claimAmount > 5000 ? 'high' : claimAmount > 1000 ? 'medium' : 'low',
    photos: data.photos,
    documents: data.documents || [],
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: data.customerId,
  };
  
  saveClaim(claim);
  return claim;
}

/**
 * Save claim to storage
 */
export function saveClaim(claim: Claim): void {
  const claims = getAllClaims();
  const index = claims.findIndex(c => c.id === claim.id);
  
  if (index >= 0) {
    claims[index] = claim;
  } else {
    claims.push(claim);
  }
  
  localStorage.setItem('insurance_claims', JSON.stringify(claims));
}

/**
 * Get all claims
 */
export function getAllClaims(): Claim[] {
  const stored = localStorage.getItem('insurance_claims');
  return stored ? JSON.parse(stored) : [];
}

/**
 * Get claim by ID
 */
export function getClaimById(id: string): Claim | null {
  const claims = getAllClaims();
  return claims.find(c => c.id === id) || null;
}

/**
 * Get claims for a customer
 */
export function getCustomerClaims(customerId: string): Claim[] {
  const claims = getAllClaims();
  return claims.filter(c => c.customerId === customerId);
}

/**
 * Update claim status
 */
export function updateClaimStatus(
  claimId: string,
  status: Claim['status'],
  notes?: string,
  approvedAmount?: number
): void {
  const claim = getClaimById(claimId);
  
  if (claim) {
    claim.status = status;
    claim.updatedAt = new Date();
    
    if (notes) {
      claim.resolutionNotes = notes;
    }
    
    if (approvedAmount !== undefined) {
      claim.approvedAmount = approvedAmount;
    }
    
    if (status === 'approved' || status === 'rejected') {
      claim.resolutionDate = new Date();
    }
    
    if (status === 'paid') {
      claim.paymentDate = new Date();
    }
    
    saveClaim(claim);
  }
}

/**
 * Generate insurance certificate
 */
export function generateInsuranceCertificate(
  jobReference: string,
  customerId: string,
  customerName: string,
  coverageType: InsuranceCoverage['type']
): InsuranceCertificate {
  const coverage = INSURANCE_PLANS.find(p => p.type === coverageType) || INSURANCE_PLANS[0];
  
  const validFrom = new Date();
  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + 30); // Valid for 30 days
  
  const certificate: InsuranceCertificate = {
    id: `cert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    certificateNumber: generateCertificateNumber(),
    jobReference,
    customerId,
    customerName,
    coverage,
    validFrom,
    validUntil,
    policyTerms: `This certificate confirms that ${customerName} is covered under our ${coverage.name} plan with coverage up to £${coverage.coverageAmount.toLocaleString()} for job reference ${jobReference}. Coverage is valid from ${validFrom.toLocaleDateString()} to ${validUntil.toLocaleDateString()}.`,
    issueDate: new Date(),
  };
  
  saveInsuranceCertificate(certificate);
  return certificate;
}

/**
 * Save insurance certificate
 */
export function saveInsuranceCertificate(certificate: InsuranceCertificate): void {
  const certificates = getAllInsuranceCertificates();
  const index = certificates.findIndex(c => c.id === certificate.id);
  
  if (index >= 0) {
    certificates[index] = certificate;
  } else {
    certificates.push(certificate);
  }
  
  localStorage.setItem('insurance_certificates', JSON.stringify(certificates));
}

/**
 * Get all insurance certificates
 */
export function getAllInsuranceCertificates(): InsuranceCertificate[] {
  const stored = localStorage.getItem('insurance_certificates');
  return stored ? JSON.parse(stored) : [];
}

/**
 * Get certificate by job reference
 */
export function getCertificateByJobReference(jobReference: string): InsuranceCertificate | null {
  const certificates = getAllInsuranceCertificates();
  return certificates.find(c => c.jobReference === jobReference) || null;
}

/**
 * Generate certificate HTML
 */
export function generateCertificateHTML(certificate: InsuranceCertificate): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Insurance Certificate ${certificate.certificateNumber}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #f5f5f5;
          padding: 40px 20px;
        }
        
        .certificate {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border: 8px solid #8b5cf6;
          border-radius: 16px;
          padding: 60px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
          position: relative;
        }
        
        .certificate::before {
          content: '';
          position: absolute;
          top: 20px;
          left: 20px;
          right: 20px;
          bottom: 20px;
          border: 2px solid #e879f9;
          border-radius: 8px;
        }
        
        .header {
          text-align: center;
          margin-bottom: 40px;
          position: relative;
        }
        
        .logo {
          font-size: 32px;
          font-weight: bold;
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 10px;
        }
        
        .title {
          font-size: 36px;
          color: #8b5cf6;
          margin: 20px 0;
          text-transform: uppercase;
          letter-spacing: 3px;
        }
        
        .subtitle {
          font-size: 18px;
          color: #666;
          margin-bottom: 10px;
        }
        
        .cert-number {
          font-size: 14px;
          color: #999;
          font-family: 'Courier New', monospace;
          margin-top: 20px;
        }
        
        .content {
          margin: 40px 0;
          line-height: 2;
          font-size: 16px;
          color: #333;
          position: relative;
        }
        
        .content p {
          margin-bottom: 20px;
        }
        
        .highlight {
          color: #8b5cf6;
          font-weight: bold;
        }
        
        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin: 40px 0;
          padding: 30px;
          background: #f9fafb;
          border-radius: 12px;
          border: 2px solid #e5e7eb;
        }
        
        .detail-item {
          margin-bottom: 15px;
        }
        
        .detail-label {
          font-size: 12px;
          text-transform: uppercase;
          color: #666;
          letter-spacing: 1px;
          margin-bottom: 5px;
        }
        
        .detail-value {
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }
        
        .coverage-box {
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          color: white;
          padding: 30px;
          border-radius: 12px;
          margin: 30px 0;
          text-align: center;
        }
        
        .coverage-amount {
          font-size: 48px;
          font-weight: bold;
          margin: 10px 0;
        }
        
        .features {
          margin: 30px 0;
        }
        
        .features h3 {
          color: #8b5cf6;
          margin-bottom: 15px;
        }
        
        .features ul {
          list-style: none;
          padding: 0;
        }
        
        .features li {
          padding: 10px 0 10px 30px;
          position: relative;
          color: #666;
        }
        
        .features li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #10b981;
          font-weight: bold;
          font-size: 18px;
        }
        
        .footer {
          margin-top: 60px;
          padding-top: 30px;
          border-top: 2px solid #e5e7eb;
          text-align: center;
          color: #999;
          font-size: 12px;
        }
        
        .signature-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin: 40px 0;
        }
        
        .signature {
          text-align: center;
        }
        
        .signature-line {
          border-top: 2px solid #333;
          margin: 40px auto 10px;
          width: 200px;
        }
        
        .watermark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 120px;
          color: rgba(139, 92, 246, 0.05);
          font-weight: bold;
          pointer-events: none;
        }
        
        @media print {
          body {
            background: white;
            padding: 0;
          }
          
          .certificate {
            border: 8px solid #8b5cf6;
            box-shadow: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="certificate">
        <div class="watermark">INSURED</div>
        
        <div class="header">
          <div class="logo">ShiftMyHome</div>
          <div class="title">Insurance Certificate</div>
          <div class="subtitle">Certificate of Coverage</div>
          <div class="cert-number">${certificate.certificateNumber}</div>
        </div>
        
        <div class="content">
          <p>This is to certify that</p>
          <p style="text-align: center; font-size: 24px; font-weight: bold; color: #8b5cf6; margin: 20px 0;">
            ${certificate.customerName}
          </p>
          <p>is covered under our <span class="highlight">${certificate.coverage.name}</span> insurance plan for the following moving service:</p>
        </div>
        
        <div class="details-grid">
          <div>
            <div class="detail-item">
              <div class="detail-label">Job Reference</div>
              <div class="detail-value">${certificate.jobReference}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Valid From</div>
              <div class="detail-value">${certificate.validFrom.toLocaleDateString('en-GB')}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Valid Until</div>
              <div class="detail-value">${certificate.validUntil.toLocaleDateString('en-GB')}</div>
            </div>
          </div>
          <div>
            <div class="detail-item">
              <div class="detail-label">Coverage Plan</div>
              <div class="detail-value">${certificate.coverage.name}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Deductible</div>
              <div class="detail-value">£${certificate.coverage.deductible}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Issue Date</div>
              <div class="detail-value">${certificate.issueDate.toLocaleDateString('en-GB')}</div>
            </div>
          </div>
        </div>
        
        <div class="coverage-box">
          <div style="font-size: 18px; opacity: 0.9;">Maximum Coverage Amount</div>
          <div class="coverage-amount">£${certificate.coverage.coverageAmount.toLocaleString()}</div>
          <div style="opacity: 0.9;">Full Replacement Value</div>
        </div>
        
        <div class="features">
          <h3>Coverage Includes:</h3>
          <ul>
            ${certificate.coverage.features.map(feature => `<li>${feature}</li>`).join('')}
          </ul>
        </div>
        
        <div class="content" style="margin-top: 40px; font-size: 14px; color: #666;">
          <p>${certificate.policyTerms}</p>
        </div>
        
        <div class="signature-section">
          <div class="signature">
            <div class="signature-line"></div>
            <div style="font-weight: 600; margin-top: 10px;">ShiftMyHome Ltd</div>
            <div style="font-size: 12px; color: #999;">Authorized Signatory</div>
          </div>
          <div class="signature">
            <div class="signature-line"></div>
            <div style="font-weight: 600; margin-top: 10px;">Date of Issue</div>
            <div style="font-size: 12px; color: #999;">${certificate.issueDate.toLocaleDateString('en-GB')}</div>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>ShiftMyHome Ltd</strong></p>
          <p>123 Logistics Way, London, UK SW1A 1AA</p>
          <p>Tel: +44 20 1234 5678 | Email: insurance@shiftmyhome.com</p>
          <p style="margin-top: 20px;">This certificate is valid only when accompanied by the original job booking confirmation.</p>
          <p>For claims and inquiries, please contact our claims department.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Download certificate as HTML/PDF
 */
export function downloadCertificate(certificate: InsuranceCertificate): void {
  const html = generateCertificateHTML(certificate);
  
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    throw new Error('Could not open print window. Please allow popups.');
  }
  
  printWindow.document.write(html);
  printWindow.document.close();
  
  printWindow.onload = () => {
    printWindow.print();
  };
}

/**
 * Calculate claim statistics
 */
export function calculateClaimStats(claims: Claim[]) {
  const totalClaimed = claims.reduce((sum, c) => sum + c.claimAmount, 0);
  const totalApproved = claims.reduce((sum, c) => sum + (c.approvedAmount || 0), 0);
  const totalPaid = claims.filter(c => c.status === 'paid').reduce((sum, c) => sum + (c.approvedAmount || 0), 0);
  
  return {
    total: claims.length,
    submitted: claims.filter(c => c.status === 'submitted').length,
    underReview: claims.filter(c => c.status === 'under_review').length,
    approved: claims.filter(c => c.status === 'approved').length,
    rejected: claims.filter(c => c.status === 'rejected').length,
    paid: claims.filter(c => c.status === 'paid').length,
    totalClaimed,
    totalApproved,
    totalPaid,
    avgClaimAmount: claims.length > 0 ? totalClaimed / claims.length : 0,
    approvalRate: claims.length > 0 ? (claims.filter(c => c.status === 'approved' || c.status === 'paid').length / claims.length) * 100 : 0,
  };
}
