import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, File, Calendar, Filter, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { toast } from 'sonner@2.0.3';

interface ExportManagerProps {
  data: any[];
  filename: string;
  title?: string;
}

export function ExportManager({ data = [], filename, title = 'Export Data' }: ExportManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [format, setFormat] = useState<'csv' | 'excel' | 'pdf' | 'json'>('csv');
  const [dateRange, setDateRange] = useState('all');
  const [isExporting, setIsExporting] = useState(false);

  const exportToCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map((row) =>
        headers.map((header) => {
          const value = row[header];
          return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        }).join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadFile(blob, `${filename}.csv`);
  };

  const exportToJSON = (data: any[], filename: string) => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    downloadFile(blob, `${filename}.json`);
  };

  const exportToPDF = async (data: any[], filename: string) => {
    // Simple PDF generation using HTML to PDF approach
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${filename}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #6b21a8; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #6b21a8; color: white; }
            tr:nth-child(even) { background-color: #f9f9f9; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <p>Generated on: ${new Date().toLocaleString()}</p>
          <table>
            <thead>
              <tr>
                ${Object.keys(data[0] || {}).map((key) => `<th>${key}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${data.map((row) => `
                <tr>
                  ${Object.values(row).map((value) => `<td>${value}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    downloadFile(blob, `${filename}.html`);
  };

  const exportToExcel = (data: any[], filename: string) => {
    // Simple Excel-like format using TSV
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const tsvContent = [
      headers.join('\t'),
      ...data.map((row) => headers.map((header) => row[header]).join('\t')),
    ].join('\n');

    const blob = new Blob([tsvContent], { type: 'application/vnd.ms-excel' });
    downloadFile(blob, `${filename}.xls`);
  };

  const downloadFile = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const filterDataByDateRange = (data: any[]) => {
    if (!data) return [];
    if (dateRange === 'all') return data;

    const now = new Date();
    const ranges: Record<string, number> = {
      today: 1,
      week: 7,
      month: 30,
      quarter: 90,
      year: 365,
    };

    const days = ranges[dateRange];
    if (!days) return data;

    const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    return data.filter((item) => {
      const itemDate = new Date(item.createdAt || item.date || item.timestamp);
      return itemDate >= cutoffDate;
    });
  };

  const handleExport = async () => {
    setIsExporting(true);

    const filteredData = filterDataByDateRange(data);

    if (filteredData.length === 0) {
      toast.error('No data to export', {
        description: 'Please select a different date range or check your data.',
      });
      setIsExporting(false);
      return;
    }

    try {
      switch (format) {
        case 'csv':
          exportToCSV(filteredData, filename);
          break;
        case 'json':
          exportToJSON(filteredData, filename);
          break;
        case 'pdf':
          await exportToPDF(filteredData, filename);
          break;
        case 'excel':
          exportToExcel(filteredData, filename);
          break;
      }

      toast.success('Export successful!', {
        description: `Downloaded ${filteredData.length} records as ${format.toUpperCase()}`,
      });

      setIsOpen(false);
    } catch (error) {
      toast.error('Export failed', {
        description: 'Please try again or contact support.',
      });
    }

    setIsExporting(false);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="gap-2"
      >
        <Download className="w-4 h-4" />
        Export
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="w-5 h-5 text-purple-600" />
              {title}
            </DialogTitle>
            <DialogDescription>
              Choose your export format and date range
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Format Selection */}
            <div>
              <Label className="mb-3 block">Export Format</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'csv', label: 'CSV', icon: FileText, desc: 'Comma-separated values' },
                  { value: 'excel', label: 'Excel', icon: FileSpreadsheet, desc: 'Microsoft Excel' },
                  { value: 'pdf', label: 'PDF', icon: File, desc: 'Printable document' },
                  { value: 'json', label: 'JSON', icon: FileText, desc: 'Raw data format' },
                ].map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => setFormat(option.value as any)}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        format === option.value
                          ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Icon className="w-5 h-5 text-purple-600" />
                        {format === option.value && (
                          <Check className="w-4 h-4 text-purple-600" />
                        )}
                      </div>
                      <div className="font-semibold mb-1">{option.label}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {option.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date Range */}
            <div>
              <Label htmlFor="dateRange" className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4" />
                Date Range
              </Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger id="dateRange">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                  <SelectItem value="quarter">Last 90 Days</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Info Box */}
            <Card className="p-4 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
              <div className="flex items-start gap-3">
                <Filter className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm mb-1">Export Preview</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {filterDataByDateRange(data).length} records will be exported
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export Now
                </>
              )}
            </Button>
            <Button onClick={() => setIsOpen(false)} variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
