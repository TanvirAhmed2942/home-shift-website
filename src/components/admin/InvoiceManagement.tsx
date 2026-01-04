import React, { useState, useMemo } from 'react';
import { 
  FileText, Download, Send, Eye, DollarSign, TrendingUp, 
  Calendar, Search, Filter, CheckCircle, Clock, AlertCircle,
  Plus, Edit, Trash2, Mail, Printer, CreditCard
} from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  getAllInvoices, 
  calculateInvoiceStats, 
  downloadInvoicePDF,
  sendInvoiceEmail,
  markInvoiceAsPaid,
  type Invoice 
} from '../../utils/invoiceGenerator';

export function InvoiceManagement() {
  const [invoices, setInvoices] = useState<Invoice[]>(getAllInvoices());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!invoices || !Array.isArray(invoices)) {
      return {
        total: 0,
        count: 0,
        paid: 0,
        paidCount: 0,
        pending: 0,
        pendingCount: 0,
        overdue: 0,
        overdueCount: 0
      };
    }
    return calculateInvoiceStats(invoices);
  }, [invoices]);

  // Filter invoices
  const filteredInvoices = useMemo(() => {
    if (!invoices || !Array.isArray(invoices)) return [];
    
    return invoices.filter(invoice => {
      if (!invoice) return false;
      
      const matchesSearch = 
        (invoice.invoiceNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (invoice.customer?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (invoice.jobReference || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchTerm, statusFilter]);

  const handleDownloadPDF = async (invoice: Invoice) => {
    try {
      await downloadInvoicePDF(invoice);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Error downloading PDF. Please try again.');
    }
  };

  const handleSendEmail = async (invoice: Invoice) => {
    try {
      await sendInvoiceEmail(invoice);
      alert(`Invoice sent to ${invoice.customer.email}`);
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Error sending email. Please try again.');
    }
  };

  const handleMarkAsPaid = (invoice: Invoice) => {
    markInvoiceAsPaid(invoice.id);
    setInvoices(getAllInvoices());
    alert(`Invoice ${invoice.invoiceNumber} marked as paid!`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'sent':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4" />;
      case 'sent':
        return <Clock className="w-4 h-4" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border-white/20 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-purple-600" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">£{(stats.total || 0).toFixed(2)}</div>
            <p className="text-xs text-gray-600 mt-1">{stats.count || 0} invoices</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-teal-500/10 border-white/20 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Paid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">£{(stats.paid || 0).toFixed(2)}</div>
            <p className="text-xs text-gray-600 mt-1">{stats.paidCount || 0} invoices</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-amber-500/10 border-white/20 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-600" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">£{(stats.pending || 0).toFixed(2)}</div>
            <p className="text-xs text-gray-600 mt-1">{stats.pendingCount || 0} invoices</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/10 via-rose-500/10 to-pink-500/10 border-white/20 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              Overdue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">£{(stats.overdue || 0).toFixed(2)}</div>
            <p className="text-xs text-gray-600 mt-1">{stats.overdueCount || 0} invoices</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="bg-white/50 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Invoice Management
          </CardTitle>
          <CardDescription>
            View, manage, and send invoices to customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by invoice number, customer name, or job reference..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('all')}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={statusFilter === 'paid' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('paid')}
                size="sm"
              >
                Paid
              </Button>
              <Button
                variant={statusFilter === 'sent' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('sent')}
                size="sm"
              >
                Pending
              </Button>
              <Button
                variant={statusFilter === 'overdue' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('overdue')}
                size="sm"
              >
                Overdue
              </Button>
            </div>
          </div>

          {/* Invoices Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-3 text-sm">Invoice #</th>
                  <th className="text-left p-3 text-sm">Customer</th>
                  <th className="text-left p-3 text-sm">Job Ref</th>
                  <th className="text-left p-3 text-sm">Date</th>
                  <th className="text-left p-3 text-sm">Due Date</th>
                  <th className="text-left p-3 text-sm">Amount</th>
                  <th className="text-left p-3 text-sm">Status</th>
                  <th className="text-right p-3 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center p-8 text-gray-500">
                      No invoices found
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-purple-600" />
                          <span className="font-mono text-sm">{invoice.invoiceNumber}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div>
                          <div className="font-medium text-sm">{invoice.customer.name}</div>
                          <div className="text-xs text-gray-500">{invoice.customer.email}</div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="font-mono text-sm text-gray-600">{invoice.jobReference}</span>
                      </td>
                      <td className="p-3 text-sm">{format(new Date(invoice.issueDate), 'dd MMM yyyy')}</td>
                      <td className="p-3 text-sm">{format(new Date(invoice.dueDate), 'dd MMM yyyy')}</td>
                      <td className="p-3">
                        <div className="font-medium">£{(invoice.total || 0).toFixed(2)}</div>
                        <div className="text-xs text-gray-500">
                          (VAT: £{(invoice.vatAmount || 0).toFixed(2)})
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className={`${getStatusColor(invoice.status)} flex items-center gap-1 w-fit`}>
                          {getStatusIcon(invoice.status)}
                          {invoice.status}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedInvoice(invoice);
                              setShowPreview(true);
                            }}
                            title="Preview"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadPDF(invoice)}
                            title="Download PDF"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSendEmail(invoice)}
                            title="Send Email"
                          >
                            <Mail className="w-4 h-4" />
                          </Button>
                          {invoice.status !== 'paid' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkAsPaid(invoice)}
                              title="Mark as Paid"
                              className="text-green-600 hover:text-green-700"
                            >
                              <CreditCard className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Preview Modal */}
      {showPreview && selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Invoice Preview</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadPDF(selectedInvoice)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSendEmail(selectedInvoice)}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreview(false)}
                >
                  Close
                </Button>
              </div>
            </div>
            <div className="p-6">
              <iframe
                srcDoc={require('../../utils/invoiceGenerator').generateInvoiceHTML(selectedInvoice)}
                className="w-full h-[70vh] border rounded-lg"
                title="Invoice Preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
