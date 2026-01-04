import React, { useState } from 'react';
import { HelpCircle, Plus, Edit, Trash2, Save, ChevronDown, ChevronUp } from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
}

const DEFAULT_FAQS: FAQ[] = [
  {
    id: '1',
    question: 'How do I get a quote?',
    answer: 'You can get an instant quote by filling out our online booking form. Select your service, add your items, and enter pickup/delivery locations. You\'ll receive a detailed quote immediately.',
    category: 'Booking',
    order: 1,
    isActive: true,
  },
  {
    id: '2',
    question: 'What payment methods do you accept?',
    answer: 'We accept cash, all major credit/debit cards, and bank transfers. Payment is typically due upon completion of the service.',
    category: 'Payment',
    order: 2,
    isActive: true,
  },
  {
    id: '3',
    question: 'Do you provide packing materials?',
    answer: 'Yes! We offer a full range of packing materials including boxes, bubble wrap, and protective covers. These can be added to your booking or purchased separately.',
    category: 'Services',
    order: 3,
    isActive: true,
  },
  {
    id: '4',
    question: 'What areas do you cover?',
    answer: 'We operate throughout London and the surrounding regions. For relocations beyond this area, please reach out to check our availability.',
    category: 'Coverage',
    order: 4,
    isActive: true,
  },
  {
    id: '5',
    question: 'Is my furniture insured during the move?',
    answer: 'Yes, all moves include basic goods in transit insurance. Additional coverage is available upon request for high-value items.',
    category: 'Insurance',
    order: 5,
    isActive: true,
  },
  {
    id: '6',
    question: 'Can I cancel or reschedule my booking?',
    answer: 'Yes, you can cancel or reschedule. For cancellations more than 7 days in advance, we offer a full refund. See our Terms & Conditions for detailed cancellation policy.',
    category: 'Booking',
    order: 6,
    isActive: true,
  },
];

const CATEGORIES = ['Booking', 'Payment', 'Services', 'Coverage', 'Insurance', 'Other'];

export function FAQManager() {
  const [faqs, setFaqs] = useState<FAQ[]>(DEFAULT_FAQS);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const handleCreate = () => {
    setEditingFAQ({
      id: Date.now().toString(),
      question: '',
      answer: '',
      category: 'Booking',
      order: faqs.length + 1,
      isActive: true,
    });
    setIsCreating(true);
  };

  const handleSave = () => {
    if (!editingFAQ) return;

    if (isCreating) {
      setFaqs([...faqs, editingFAQ]);
    } else {
      setFaqs(faqs.map((faq) => (faq.id === editingFAQ.id ? editingFAQ : faq)));
    }

    setEditingFAQ(null);
    setIsCreating(false);
    setHasChanges(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this FAQ?')) {
      setFaqs(faqs.filter((faq) => faq.id !== id));
      setHasChanges(true);
    }
  };

  const handlePublish = () => {
    alert('✅ FAQ changes published to website!');
    setHasChanges(false);
  };

  const toggleFAQActive = (id: string) => {
    setFaqs(faqs.map((faq) => (faq.id === id ? { ...faq, isActive: !faq.isActive } : faq)));
    setHasChanges(true);
  };

  const groupedFAQs = CATEGORIES.map((category) => ({
    category,
    faqs: faqs.filter((faq) => faq.category === category).sort((a, b) => a.order - b.order),
  })).filter((group) => group.faqs.length > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">FAQ Manager</h2>
          <p className="text-slate-600 mt-1">Manage frequently asked questions on your website</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            Add FAQ
          </button>
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
      </div>

      {editingFAQ ? (
        /* Editor */
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-6">{isCreating ? 'Create New FAQ' : 'Edit FAQ'}</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
              <select
                value={editingFAQ.category}
                onChange={(e) => setEditingFAQ({ ...editingFAQ, category: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Question</label>
              <input
                type="text"
                value={editingFAQ.question}
                onChange={(e) => setEditingFAQ({ ...editingFAQ, question: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                placeholder="What is your question?"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Answer</label>
              <textarea
                value={editingFAQ.answer}
                onChange={(e) => setEditingFAQ({ ...editingFAQ, answer: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                rows={6}
                placeholder="Provide a clear and helpful answer..."
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                checked={editingFAQ.isActive}
                onChange={(e) => setEditingFAQ({ ...editingFAQ, isActive: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="text-sm font-semibold text-slate-700">
                Active (visible on website)
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-slate-200">
            <button
              onClick={() => {
                setEditingFAQ(null);
                setIsCreating(false);
              }}
              className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all"
              disabled={!editingFAQ.question || !editingFAQ.answer}
            >
              {isCreating ? 'Create FAQ' : 'Save Changes'}
            </button>
          </div>
        </div>
      ) : (
        /* List View */
        <div className="space-y-6">
          {groupedFAQs.map((group) => (
            <div key={group.category} className="bg-white rounded-2xl shadow-lg border border-slate-200">
              <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-slate-200">
                <h3 className="font-bold text-lg text-slate-900">{group.category}</h3>
                <p className="text-sm text-slate-600 mt-1">{group.faqs.length} question(s)</p>
              </div>

              <div className="divide-y divide-slate-200">
                {group.faqs.map((faq) => (
                  <div key={faq.id} className="p-6 hover:bg-slate-50 transition-all">
                    <div className="flex items-start justify-between gap-4">
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                      >
                        <div className="flex items-start gap-3">
                          <HelpCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <div className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                              {faq.question}
                              {!faq.isActive && (
                                <span className="px-2 py-0.5 bg-slate-200 text-slate-600 rounded text-xs">
                                  Inactive
                                </span>
                              )}
                            </div>
                            {expandedFAQ === faq.id && (
                              <div className="text-sm text-slate-600 mt-2">{faq.answer}</div>
                            )}
                          </div>
                          {expandedFAQ === faq.id ? (
                            <ChevronUp className="w-5 h-5 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleFAQActive(faq.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                            faq.isActive
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                          }`}
                        >
                          {faq.isActive ? 'Active' : 'Inactive'}
                        </button>
                        <button
                          onClick={() => setEditingFAQ(faq)}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(faq.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {faqs.length === 0 && (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center">
              <HelpCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-700 mb-2">No FAQs yet</h3>
              <p className="text-slate-500 mb-6">Create your first FAQ to help customers</p>
              <button
                onClick={handleCreate}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                <Plus className="w-5 h-5" />
                Add First FAQ
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}