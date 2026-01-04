import React, { useState } from 'react';
import { FileText, Download, Calendar, DollarSign, TrendingUp, Users, Package, Truck, Filter } from 'lucide-react';

export function Reports() {
  const [dateRange, setDateRange] = useState('last-30-days');
  const [reportType, setReportType] = useState('all');

  const reportCategories = [
    {
      id: 'financial',
      name: 'Financial Reports',
      icon: '💰',
      reports: [
        { id: 'revenue', name: 'Revenue Summary', description: 'Total revenue and breakdown by service', icon: DollarSign },
        { id: 'invoices', name: 'Invoice List', description: 'All invoices with payment status', icon: FileText },
        { id: 'payments', name: 'Payment Transactions', description: 'Payment history and methods', icon: TrendingUp },
        { id: 'profit', name: 'Profit & Loss', description: 'P&L statement for selected period', icon: TrendingUp },
      ],
    },
    {
      id: 'operations',
      name: 'Operations Reports',
      icon: '📊',
      reports: [
        { id: 'bookings', name: 'Bookings Summary', description: 'All bookings by status and type', icon: Package },
        { id: 'completed', name: 'Completed Jobs', description: 'Successfully completed deliveries', icon: Package },
        { id: 'vehicle-usage', name: 'Vehicle Usage', description: 'Vehicle utilization and mileage', icon: Truck },
        { id: 'driver-performance', name: 'Driver Performance', description: 'Driver stats and ratings', icon: Truck },
      ],
    },
    {
      id: 'customers',
      name: 'Customer Reports',
      icon: '👥',
      reports: [
        { id: 'customer-list', name: 'Customer List', description: 'All registered customers', icon: Users },
        { id: 'customer-activity', name: 'Customer Activity', description: 'Booking frequency and value', icon: Users },
        { id: 'reviews', name: 'Reviews & Ratings', description: 'Customer feedback summary', icon: Users },
        { id: 'retention', name: 'Customer Retention', description: 'Repeat customer analysis', icon: TrendingUp },
      ],
    },
    {
      id: 'analytics',
      name: 'Analytics Reports',
      icon: '📈',
      reports: [
        { id: 'trends', name: 'Booking Trends', description: 'Trends over time by service', icon: TrendingUp },
        { id: 'geography', name: 'Geographic Distribution', description: 'Bookings by location/postcode', icon: TrendingUp },
        { id: 'pricing', name: 'Pricing Analysis', description: 'Average prices and discounts', icon: DollarSign },
        { id: 'forecast', name: 'Revenue Forecast', description: 'Projected revenue next 90 days', icon: TrendingUp },
      ],
    },
  ];

  const quickStats = [
    { label: 'Total Revenue', value: '£47,320', change: '+12%', color: 'green' },
    { label: 'Total Bookings', value: '284', change: '+8%', color: 'blue' },
    { label: 'Active Customers', value: '162', change: '+15%', color: 'purple' },
    { label: 'Avg. Job Value', value: '£167', change: '+5%', color: 'orange' },
  ];

  const generateReport = (reportId: string, reportName: string) => {
    alert(`Generating ${reportName} report for ${dateRange}...\nReport will be downloaded as PDF.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Reports & Analytics</h2>
        <p className="text-slate-600 mt-1">Generate comprehensive business reports</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-slate-900">Report Filters</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last-7-days">Last 7 Days</option>
              <option value="last-30-days">Last 30 Days</option>
              <option value="this-month">This Month</option>
              <option value="last-month">Last Month</option>
              <option value="this-quarter">This Quarter</option>
              <option value="this-year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
            >
              <option value="all">All Reports</option>
              <option value="financial">Financial</option>
              <option value="operations">Operations</option>
              <option value="customers">Customers</option>
              <option value="analytics">Analytics</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Format</label>
            <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none">
              <option value="pdf">PDF</option>
              <option value="excel">Excel (XLSX)</option>
              <option value="csv">CSV</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        {quickStats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">{stat.label}</span>
              <span
                className={`text-xs font-semibold ${
                  stat.color === 'green'
                    ? 'text-green-600'
                    : stat.color === 'blue'
                    ? 'text-blue-600'
                    : stat.color === 'purple'
                    ? 'text-purple-600'
                    : 'text-orange-600'
                }`}
              >
                {stat.change}
              </span>
            </div>
            <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Report Categories */}
      <div className="space-y-6">
        {reportCategories
          .filter((category) => reportType === 'all' || category.id === reportType)
          .map((category) => (
            <div key={category.id} className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200">
                <h3 className="font-bold text-slate-900 text-xl flex items-center gap-2">
                  <span className="text-2xl">{category.icon}</span>
                  {category.name}
                </h3>
              </div>

              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {category.reports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-start justify-between p-4 border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all group"
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <report.icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900">{report.name}</h4>
                          <p className="text-sm text-slate-600 mt-1">{report.description}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => generateReport(report.id, report.name)}
                        className="ml-4 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Scheduled Reports */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-slate-900 text-xl">Scheduled Reports</h3>
            <p className="text-sm text-slate-600 mt-1">Automatically generated and emailed</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-semibold">
            + Add Schedule
          </button>
        </div>

        <div className="space-y-3">
          {[
            { name: 'Weekly Revenue Summary', frequency: 'Every Monday 9:00 AM', recipients: 'admin@shiftmyhome.com' },
            { name: 'Monthly P&L Report', frequency: '1st of every month', recipients: 'finance@shiftmyhome.com' },
            { name: 'Daily Bookings Report', frequency: 'Every day 6:00 PM', recipients: 'ops@shiftmyhome.com' },
          ].map((schedule, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <div className="font-semibold text-slate-900">{schedule.name}</div>
                <div className="text-sm text-slate-600 mt-1">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  {schedule.frequency} → {schedule.recipients}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-all">
                  Edit
                </button>
                <button className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-all">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export All */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-8 text-white text-center">
        <FileText className="w-12 h-12 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">Export All Data</h3>
        <p className="text-blue-100 mb-6">Download complete business data for the selected period</p>
        <button className="px-8 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-xl transition-all">
          <Download className="w-5 h-5 inline mr-2" />
          Export Complete Dataset
        </button>
      </div>
    </div>
  );
}
