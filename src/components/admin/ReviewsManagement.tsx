import React, { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, MessageCircle, Flag, Check, X, Search, Filter, TrendingUp, Award, User, Truck } from 'lucide-react';

interface Review {
  id: string;
  jobId: string;
  customerName: string;
  driverName: string;
  rating: number;
  comment: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  helpful: number;
  reported: boolean;
  response?: string;
}

export function ReviewsManagement() {
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const reviews: Review[] = [
    {
      id: 'R-001',
      jobId: 'J-12345',
      customerName: 'John Smith',
      driverName: 'Mike Johnson',
      rating: 5,
      comment: 'Excellent service! The driver was professional and careful with all my furniture. Highly recommend!',
      date: '2024-12-20',
      status: 'approved',
      helpful: 12,
      reported: false
    },
    {
      id: 'R-002',
      jobId: 'J-12346',
      customerName: 'Sarah Williams',
      driverName: 'David Brown',
      rating: 4,
      comment: 'Good service overall, but arrived 15 minutes late. Otherwise everything was perfect.',
      date: '2024-12-19',
      status: 'approved',
      helpful: 8,
      reported: false
    },
    {
      id: 'R-003',
      jobId: 'J-12347',
      customerName: 'Emily Davis',
      driverName: 'Mike Johnson',
      rating: 5,
      comment: 'Amazing! Very careful with fragile items. Would definitely use again.',
      date: '2024-12-18',
      status: 'pending',
      helpful: 0,
      reported: false
    },
    {
      id: 'R-004',
      jobId: 'J-12348',
      customerName: 'Robert Taylor',
      driverName: 'James Wilson',
      rating: 2,
      comment: 'Driver was rude and damaged one of my chairs. Not happy with this service.',
      date: '2024-12-17',
      status: 'pending',
      helpful: 3,
      reported: true
    },
    {
      id: 'R-005',
      jobId: 'J-12349',
      customerName: 'Lisa Anderson',
      driverName: 'David Brown',
      rating: 5,
      comment: 'Perfect move! Everything arrived safely and on time. Great communication throughout.',
      date: '2024-12-16',
      status: 'approved',
      helpful: 15,
      reported: false
    }
  ];

  const filteredReviews = reviews.filter(review => {
    const matchesStatus = selectedStatus === 'all' || review.status === selectedStatus;
    const matchesSearch = review.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.jobId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    totalReviews: reviews.length,
    averageRating: (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1),
    pending: reviews.filter(r => r.status === 'pending').length,
    approved: reviews.filter(r => r.status === 'approved').length,
    rejected: reviews.filter(r => r.status === 'rejected').length,
    fiveStars: reviews.filter(r => r.rating === 5).length,
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Reviews & Ratings</h1>
          <p className="text-slate-600 mt-1">Manage customer feedback and ratings</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Reviews</p>
              <p className="text-3xl font-bold mt-1">{stats.totalReviews}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Average Rating</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-3xl font-bold">{stats.averageRating}</p>
                <Star className="w-6 h-6 fill-white" />
              </div>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Pending Review</p>
              <p className="text-3xl font-bold mt-1">{stats.pending}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Flag className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">5-Star Reviews</p>
              <p className="text-3xl font-bold mt-1">{stats.fiveStars}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by customer, driver, or job ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-2">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                  selectedStatus === status
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Review ID</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Customer</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Driver</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Rating</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Comment</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Date</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReviews.map((review) => (
                <tr key={review.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-slate-900">{review.id}</span>
                    <p className="text-xs text-slate-500 mt-1">Job: {review.jobId}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-xs font-bold">
                        {review.customerName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-medium text-slate-900">{review.customerName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold">
                        {review.driverName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-medium text-slate-900">{review.driverName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                      <span className="ml-2 text-sm font-semibold text-slate-900">{review.rating}.0</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-600 line-clamp-2 max-w-xs">{review.comment}</p>
                    {review.reported && (
                      <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                        <Flag className="w-3 h-3" />
                        Reported
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">{review.date}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                      review.status === 'approved' ? 'bg-green-100 text-green-700' :
                      review.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {review.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {review.status === 'pending' && (
                        <>
                          <button className="p-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors">
                            <Check className="w-4 h-4" />
                          </button>
                          <button className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors">
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
