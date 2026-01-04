/**
 * DOCUMENT MANAGEMENT SYSTEM
 * Driver verification, document upload, expiry tracking
 * Supports: Driver License, Insurance, Vehicle Registration, DBS Check, MOT
 */

// ==================== TYPES ====================

export type DocumentType =
  | 'driver-license'
  | 'insurance'
  | 'vehicle-registration'
  | 'dbs-check'
  | 'mot-certificate'
  | 'proof-of-address'
  | 'vehicle-photos'
  | 'profile-photo';

export type DocumentStatus = 'pending' | 'approved' | 'rejected' | 'expired';

export interface Document {
  id: string;
  type: DocumentType;
  name: string;
  fileName: string;
  fileSize: number; // bytes
  fileType: string; // MIME type
  fileUrl: string; // In production, use cloud storage URL
  uploadedAt: Date;
  uploadedBy: string; // User ID
  status: DocumentStatus;
  expiryDate?: Date;
  issuedDate?: Date;
  documentNumber?: string;
  issuingAuthority?: string;
  verifiedBy?: string; // Admin ID
  verifiedAt?: Date;
  rejectionReason?: string;
  notes?: string;
}

export interface DocumentRequirement {
  type: DocumentType;
  label: string;
  description: string;
  required: boolean;
  hasExpiry: boolean;
  acceptedFormats: string[];
  maxSizeMB: number;
  icon: string;
}

// ==================== DOCUMENT REQUIREMENTS ====================

export const documentRequirements: Record<DocumentType, DocumentRequirement> = {
  'driver-license': {
    type: 'driver-license',
    label: 'Driver License',
    description: 'Valid UK driving license (both sides)',
    required: true,
    hasExpiry: true,
    acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
    maxSizeMB: 5,
    icon: '🪪',
  },
  'insurance': {
    type: 'insurance',
    label: 'Vehicle Insurance',
    description: 'Goods in transit insurance certificate',
    required: true,
    hasExpiry: true,
    acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
    maxSizeMB: 5,
    icon: '🛡️',
  },
  'vehicle-registration': {
    type: 'vehicle-registration',
    label: 'Vehicle Registration (V5C)',
    description: 'Vehicle logbook (V5C)',
    required: true,
    hasExpiry: false,
    acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
    maxSizeMB: 5,
    icon: '📋',
  },
  'dbs-check': {
    type: 'dbs-check',
    label: 'DBS Check',
    description: 'Basic DBS criminal record check',
    required: true,
    hasExpiry: true,
    acceptedFormats: ['application/pdf'],
    maxSizeMB: 5,
    icon: '✅',
  },
  'mot-certificate': {
    type: 'mot-certificate',
    label: 'MOT Certificate',
    description: 'Valid MOT certificate for vehicles over 3 years old',
    required: false,
    hasExpiry: true,
    acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
    maxSizeMB: 5,
    icon: '🔧',
  },
  'proof-of-address': {
    type: 'proof-of-address',
    label: 'Proof of Address',
    description: 'Utility bill or bank statement (last 3 months)',
    required: true,
    hasExpiry: false,
    acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
    maxSizeMB: 5,
    icon: '🏠',
  },
  'vehicle-photos': {
    type: 'vehicle-photos',
    label: 'Vehicle Photos',
    description: 'Clear photos of your vehicle (front, back, sides, interior)',
    required: true,
    hasExpiry: false,
    acceptedFormats: ['image/jpeg', 'image/png'],
    maxSizeMB: 10,
    icon: '📸',
  },
  'profile-photo': {
    type: 'profile-photo',
    label: 'Profile Photo',
    description: 'Professional photo for customer trust',
    required: true,
    hasExpiry: false,
    acceptedFormats: ['image/jpeg', 'image/png'],
    maxSizeMB: 2,
    icon: '👤',
  },
};

// ==================== DOCUMENT MANAGER ====================

class DocumentManager {
  private documents: Map<string, Document> = new Map();
  private listeners: Array<(documents: Document[]) => void> = [];

  // ==================== UPLOAD DOCUMENT ====================

  async uploadDocument(
    type: DocumentType,
    file: File,
    userId: string,
    metadata?: {
      expiryDate?: Date;
      issuedDate?: Date;
      documentNumber?: string;
      issuingAuthority?: string;
      notes?: string;
    }
  ): Promise<Document> {
    // Validate file
    const requirement = documentRequirements[type];
    this.validateFile(file, requirement);

    // Create document object
    const document: Document = {
      id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      name: requirement.label,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      fileUrl: await this.uploadFileToStorage(file), // Mock upload
      uploadedAt: new Date(),
      uploadedBy: userId,
      status: 'pending',
      expiryDate: metadata?.expiryDate,
      issuedDate: metadata?.issuedDate,
      documentNumber: metadata?.documentNumber,
      issuingAuthority: metadata?.issuingAuthority,
      notes: metadata?.notes,
    };

    // Save document
    this.documents.set(document.id, document);
    this.notifyListeners();

    console.log(`[Documents] Uploaded: ${type}`, document);

    return document;
  }

  // ==================== VALIDATE FILE ====================

  private validateFile(file: File, requirement: DocumentRequirement): void {
    // Check file type
    if (!requirement.acceptedFormats.includes(file.type)) {
      throw new Error(
        `Invalid file type. Accepted formats: ${requirement.acceptedFormats.join(', ')}`
      );
    }

    // Check file size
    const maxSizeBytes = requirement.maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      throw new Error(`File too large. Maximum size: ${requirement.maxSizeMB}MB`);
    }
  }

  // ==================== MOCK FILE UPLOAD ====================

  private async uploadFileToStorage(file: File): Promise<string> {
    // In production, upload to cloud storage (S3, Supabase Storage, etc.)
    // For now, create a local URL
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  }

  // ==================== GET DOCUMENTS ====================

  getDocumentsByUser(userId: string): Document[] {
    return Array.from(this.documents.values())
      .filter(doc => doc.uploadedBy === userId)
      .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
  }

  getDocumentsByType(userId: string, type: DocumentType): Document[] {
    return this.getDocumentsByUser(userId).filter(doc => doc.type === type);
  }

  getDocumentById(documentId: string): Document | null {
    return this.documents.get(documentId) || null;
  }

  getAllPendingDocuments(): Document[] {
    return Array.from(this.documents.values())
      .filter(doc => doc.status === 'pending')
      .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
  }

  // ==================== APPROVE/REJECT DOCUMENTS ====================

  approveDocument(documentId: string, adminId: string): void {
    const document = this.documents.get(documentId);
    if (!document) throw new Error('Document not found');

    document.status = 'approved';
    document.verifiedBy = adminId;
    document.verifiedAt = new Date();

    this.notifyListeners();
    console.log(`[Documents] Approved: ${documentId}`);
  }

  rejectDocument(documentId: string, adminId: string, reason: string): void {
    const document = this.documents.get(documentId);
    if (!document) throw new Error('Document not found');

    document.status = 'rejected';
    document.verifiedBy = adminId;
    document.verifiedAt = new Date();
    document.rejectionReason = reason;

    this.notifyListeners();
    console.log(`[Documents] Rejected: ${documentId}`, reason);
  }

  // ==================== DELETE DOCUMENT ====================

  deleteDocument(documentId: string): void {
    const document = this.documents.get(documentId);
    if (!document) throw new Error('Document not found');

    this.documents.delete(documentId);
    this.notifyListeners();

    console.log(`[Documents] Deleted: ${documentId}`);
  }

  // ==================== EXPIRY TRACKING ====================

  getExpiringDocuments(daysThreshold: number = 30): Document[] {
    const now = new Date();
    const threshold = new Date(now.getTime() + daysThreshold * 24 * 60 * 60 * 1000);

    return Array.from(this.documents.values()).filter(doc => {
      if (!doc.expiryDate || doc.status !== 'approved') return false;
      return doc.expiryDate <= threshold && doc.expiryDate > now;
    });
  }

  getExpiredDocuments(): Document[] {
    const now = new Date();

    return Array.from(this.documents.values()).filter(doc => {
      if (!doc.expiryDate) return false;
      return doc.expiryDate < now;
    });
  }

  checkDocumentExpiry(documentId: string): {
    isExpired: boolean;
    isExpiringSoon: boolean;
    daysUntilExpiry: number | null;
  } {
    const document = this.documents.get(documentId);
    if (!document || !document.expiryDate) {
      return { isExpired: false, isExpiringSoon: false, daysUntilExpiry: null };
    }

    const now = new Date();
    const daysUntilExpiry = Math.floor(
      (document.expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      isExpired: daysUntilExpiry < 0,
      isExpiringSoon: daysUntilExpiry >= 0 && daysUntilExpiry <= 30,
      daysUntilExpiry,
    };
  }

  // ==================== DRIVER VERIFICATION STATUS ====================

  getDriverVerificationStatus(userId: string): {
    isFullyVerified: boolean;
    missingDocuments: DocumentType[];
    expiredDocuments: Document[];
    pendingDocuments: Document[];
    completionPercentage: number;
  } {
    const userDocs = this.getDocumentsByUser(userId);
    const requiredDocs = Object.values(documentRequirements).filter(req => req.required);

    // Check which required documents are missing or not approved
    const missingDocuments: DocumentType[] = [];
    const expiredDocuments: Document[] = [];
    const pendingDocuments: Document[] = [];

    requiredDocs.forEach(req => {
      const docs = userDocs.filter(doc => doc.type === req.type);
      const approvedDoc = docs.find(doc => doc.status === 'approved');

      if (!approvedDoc) {
        const pendingDoc = docs.find(doc => doc.status === 'pending');
        if (pendingDoc) {
          pendingDocuments.push(pendingDoc);
        } else {
          missingDocuments.push(req.type);
        }
      } else {
        // Check if expired
        const expiryCheck = this.checkDocumentExpiry(approvedDoc.id);
        if (expiryCheck.isExpired) {
          expiredDocuments.push(approvedDoc);
        }
      }
    });

    const totalRequired = requiredDocs.length;
    const completed = totalRequired - missingDocuments.length - expiredDocuments.length;
    const completionPercentage = Math.round((completed / totalRequired) * 100);

    const isFullyVerified =
      missingDocuments.length === 0 &&
      expiredDocuments.length === 0 &&
      pendingDocuments.length === 0;

    return {
      isFullyVerified,
      missingDocuments,
      expiredDocuments,
      pendingDocuments,
      completionPercentage,
    };
  }

  // ==================== LISTENERS ====================

  subscribe(callback: (documents: Document[]) => void): () => void {
    this.listeners.push(callback);

    // Initial call
    callback(Array.from(this.documents.values()));

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(): void {
    const documents = Array.from(this.documents.values());
    this.listeners.forEach(listener => listener(documents));
  }

  // ==================== UTILITIES ====================

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  getDocumentStatusColor(status: DocumentStatus): string {
    switch (status) {
      case 'approved': return 'green';
      case 'pending': return 'yellow';
      case 'rejected': return 'red';
      case 'expired': return 'red';
      default: return 'gray';
    }
  }

  getDocumentStatusLabel(status: DocumentStatus): string {
    switch (status) {
      case 'approved': return 'Approved ✅';
      case 'pending': return 'Pending Review ⏳';
      case 'rejected': return 'Rejected ❌';
      case 'expired': return 'Expired ⚠️';
      default: return 'Unknown';
    }
  }

  // ==================== SEED MOCK DATA ====================

  seedMockDocuments(userId: string): void {
    // Driver License
    this.documents.set('doc-1', {
      id: 'doc-1',
      type: 'driver-license',
      name: 'Driver License',
      fileName: 'license-front.jpg',
      fileSize: 1024000,
      fileType: 'image/jpeg',
      fileUrl: '/mock-documents/license.jpg',
      uploadedAt: new Date('2024-01-15'),
      uploadedBy: userId,
      status: 'approved',
      expiryDate: new Date('2026-01-15'),
      issuedDate: new Date('2020-01-15'),
      documentNumber: 'BROWN123456AB1CD',
      issuingAuthority: 'DVLA',
      verifiedBy: 'admin-1',
      verifiedAt: new Date('2024-01-16'),
    });

    // Insurance
    this.documents.set('doc-2', {
      id: 'doc-2',
      type: 'insurance',
      name: 'Vehicle Insurance',
      fileName: 'insurance-cert.pdf',
      fileSize: 2048000,
      fileType: 'application/pdf',
      fileUrl: '/mock-documents/insurance.pdf',
      uploadedAt: new Date('2024-02-01'),
      uploadedBy: userId,
      status: 'approved',
      expiryDate: new Date('2025-02-01'),
      issuedDate: new Date('2024-02-01'),
      documentNumber: 'INS-2024-1234567',
      issuingAuthority: 'AXA Insurance',
      verifiedBy: 'admin-1',
      verifiedAt: new Date('2024-02-02'),
    });

    // DBS Check (expiring soon)
    this.documents.set('doc-3', {
      id: 'doc-3',
      type: 'dbs-check',
      name: 'DBS Check',
      fileName: 'dbs-certificate.pdf',
      fileSize: 1536000,
      fileType: 'application/pdf',
      fileUrl: '/mock-documents/dbs.pdf',
      uploadedAt: new Date('2024-03-01'),
      uploadedBy: userId,
      status: 'approved',
      expiryDate: new Date('2025-01-15'), // Expires in ~30 days
      issuedDate: new Date('2024-03-01'),
      documentNumber: 'DBS-001234567',
      issuingAuthority: 'Disclosure and Barring Service',
      verifiedBy: 'admin-1',
      verifiedAt: new Date('2024-03-05'),
    });

    // Vehicle Registration
    this.documents.set('doc-4', {
      id: 'doc-4',
      type: 'vehicle-registration',
      name: 'Vehicle Registration (V5C)',
      fileName: 'v5c-logbook.pdf',
      fileSize: 3072000,
      fileType: 'application/pdf',
      fileUrl: '/mock-documents/v5c.pdf',
      uploadedAt: new Date('2024-01-20'),
      uploadedBy: userId,
      status: 'approved',
      documentNumber: 'V5C-AB12CDE',
      issuingAuthority: 'DVLA',
      verifiedBy: 'admin-1',
      verifiedAt: new Date('2024-01-21'),
    });

    this.notifyListeners();
  }
}

// ==================== SINGLETON INSTANCE ====================

export const documentManager = new DocumentManager();
