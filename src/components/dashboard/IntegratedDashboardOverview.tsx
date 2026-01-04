import React, { useState, useEffect } from 'react';
import { 
  FileText, Globe, Shield, MessageSquare, Calendar, 
  CloudRain, Route, CheckCircle, Mail, Leaf, TrendingUp,
  Award, DollarSign, Users, BarChart
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { getIntegratedDashboardStats } from '../../utils/integrationManager';
import { useTranslation } from '../../utils/i18nManager';

interface IntegratedDashboardOverviewProps {
  userId: string;
  userType: 'customer' | 'driver' | 'admin';
}

export function IntegratedDashboardOverview({ userId, userType }: IntegratedDashboardOverviewProps) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { t, language, setLanguage } = useTranslation();

  useEffect(() => {
    loadStats();
  }, [userId, userType]);

  const loadStats = () => {
    try {
      const data = getIntegratedDashboardStats(userId, userType);
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const getTrustLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      unverified: 'bg-gray-100 text-gray-800',
      basic: 'bg-yellow-100 text-yellow-800',
      standard: 'bg-blue-100 text-blue-800',
      verified: 'bg-green-100 text-green-800',
      trusted: 'bg-purple-100 text-purple-800',
    };
    return colors[level] || colors.unverified;
  };

  return (
    <div className="space-y-6">
      {/* Language & Verification Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Language Settings */}
        <Card className="bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 border-white/20 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Globe className="w-4 h-4 text-purple-600" />
              {t('dashboard.settings')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {language === 'ro' ? '🇷🇴' : language === 'hu' ? '🇭🇺' : '🇬🇧'}
              </span>
              <div>
                <div className="font-semibold">
                  {language === 'ro' ? 'Română' : language === 'hu' ? 'Magyar' : 'English'}
                </div>
                <div className="text-xs text-gray-600">{t('nav.language')}</div>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <Button 
                size="sm" 
                variant={language === 'en' ? 'default' : 'outline'}
                onClick={() => setLanguage('en')}
              >
                EN
              </Button>
              <Button 
                size="sm" 
                variant={language === 'ro' ? 'default' : 'outline'}
                onClick={() => setLanguage('ro')}
              >
                RO
              </Button>
              <Button 
                size="sm" 
                variant={language === 'hu' ? 'default' : 'outline'}
                onClick={() => setLanguage('hu')}
              >
                HU
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Verification Status */}
        <Card className="bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-teal-500/10 border-white/20 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Verification Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm">Trust Score</span>
              <Badge className={getTrustLevelColor(stats.verification.trustLevel)}>
                {stats.verification.trustLevel}
              </Badge>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all"
                  style={{ width: `${stats.verification.trustScore}%` }}
                />
              </div>
              <span className="text-sm font-bold">{stats.verification.trustScore}/100</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
              <div className={`flex items-center gap-1 ${stats.verification.emailVerified ? 'text-green-600' : 'text-gray-400'}`}>
                <CheckCircle className="w-3 h-3" />
                Email
              </div>
              <div className={`flex items-center gap-1 ${stats.verification.phoneVerified ? 'text-green-600' : 'text-gray-400'}`}>
                <CheckCircle className="w-3 h-3" />
                Phone
              </div>
              <div className={`flex items-center gap-1 ${stats.verification.idVerified ? 'text-green-600' : 'text-gray-400'}`}>
                <CheckCircle className="w-3 h-3" />
                ID
              </div>
              <div className={`flex items-center gap-1 ${stats.verification.addressVerified ? 'text-green-600' : 'text-gray-400'}`}>
                <CheckCircle className="w-3 h-3" />
                Address
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer-Specific Widgets */}
      {userType === 'customer' && stats.sustainability && (
        <>
          {/* Environmental Impact */}
          <Card className="bg-gradient-to-br from-green-500/10 via-teal-500/10 to-blue-500/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-600" />
                Your Environmental Impact
              </CardTitle>
              <CardDescription>Carbon footprint and sustainability</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-white/50">
                  <div className="text-2xl font-bold text-green-600">
                    {stats.sustainability.totalCO2.toFixed(1)}kg
                  </div>
                  <div className="text-xs text-gray-600">Total CO2</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-white/50">
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.sustainability.totalOffset.toFixed(1)}kg
                  </div>
                  <div className="text-xs text-gray-600">Offset Purchased</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-white/50">
                  <div className="text-2xl font-bold text-purple-600">
                    {stats.sustainability.ecoVehiclePercentage.toFixed(0)}%
                  </div>
                  <div className="text-xs text-gray-600">Eco Vehicles</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-white/50">
                  <div className="text-2xl font-bold text-orange-600">
                    {stats.sustainability.treesEquivalent}
                  </div>
                  <div className="text-xs text-gray-600">Trees to Offset</div>
                </div>
              </div>
              {stats.sustainability.comparedToIndustryAvg < 0 && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800">
                    🎉 You're {Math.abs(stats.sustainability.comparedToIndustryAvg).toFixed(1)}% better than industry average!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-white/50 backdrop-blur-sm border-white/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-purple-600" />
                  <div>
                    <div className="text-2xl font-bold">{stats.invoices.length}</div>
                    <div className="text-xs text-gray-600">Invoices</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/50 backdrop-blur-sm border-white/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Shield className="w-8 h-8 text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold">{stats.claims.length}</div>
                    <div className="text-xs text-gray-600">Claims</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/50 backdrop-blur-sm border-white/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-8 h-8 text-orange-600" />
                  <div>
                    <div className="text-2xl font-bold">{stats.disputes.length}</div>
                    <div className="text-xs text-gray-600">Disputes</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/50 backdrop-blur-sm border-white/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Calendar className="w-8 h-8 text-green-600" />
                  <div>
                    <div className="text-2xl font-bold">{stats.recurringSchedules.length}</div>
                    <div className="text-xs text-gray-600">Recurring</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Driver-Specific Widgets */}
      {userType === 'driver' && stats.todayRoute && (
        <Card className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border-white/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Route className="w-5 h-5 text-blue-600" />
              Today's Optimized Route
            </CardTitle>
            <CardDescription>
              {stats.todayRoute.stops.length} stops • {stats.todayRoute.totalDistance.toFixed(1)}km
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 rounded-lg bg-white/50">
                <div className="text-xl font-bold text-blue-600">
                  {Math.floor(stats.todayRoute.totalDuration / 60)}h {stats.todayRoute.totalDuration % 60}m
                </div>
                <div className="text-xs text-gray-600">Duration</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-white/50">
                <div className="text-xl font-bold text-green-600">
                  £{stats.todayRoute.fuelCost.toFixed(2)}
                </div>
                <div className="text-xs text-gray-600">Fuel Cost</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-white/50">
                <div className="text-xl font-bold text-purple-600">
                  {stats.todayRoute.optimizationScore.toFixed(0)}%
                </div>
                <div className="text-xs text-gray-600">Optimized</div>
              </div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                💰 Saving £{stats.todayRoute.savings.cost.toFixed(2)} in fuel vs non-optimized route!
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Admin-Specific Widgets */}
      {userType === 'admin' && stats.globalSustainability && (
        <>
          {/* Global Sustainability */}
          <Card className="bg-gradient-to-br from-green-500/10 via-teal-500/10 to-blue-500/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-600" />
                Company Environmental Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center p-3 rounded-lg bg-white/50">
                  <div className="text-xl font-bold text-gray-800">
                    {stats.globalSustainability.totalJobs}
                  </div>
                  <div className="text-xs text-gray-600">Total Jobs</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/50">
                  <div className="text-xl font-bold text-red-600">
                    {stats.globalSustainability.totalCO2.toFixed(0)}kg
                  </div>
                  <div className="text-xs text-gray-600">Total CO2</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/50">
                  <div className="text-xl font-bold text-green-600">
                    {stats.globalSustainability.totalOffset.toFixed(0)}kg
                  </div>
                  <div className="text-xs text-gray-600">Offset</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/50">
                  <div className="text-xl font-bold text-blue-600">
                    {stats.globalSustainability.ecoVehiclePercentage.toFixed(0)}%
                  </div>
                  <div className="text-xs text-gray-600">Eco Fleet</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/50">
                  <div className="text-xl font-bold text-purple-600">
                    {stats.globalSustainability.treesEquivalent}
                  </div>
                  <div className="text-xs text-gray-600">Trees</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admin Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-white/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <FileText className="w-8 h-8 text-purple-600" />
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-2xl font-bold">£{stats.invoiceStats.totalRevenue.toFixed(0)}</div>
                <div className="text-xs text-gray-600">Total Revenue</div>
                <div className="mt-2 text-xs">
                  <span className="text-green-600">{stats.invoiceStats.paidCount} paid</span>
                  <span className="text-gray-400 mx-2">•</span>
                  <span className="text-yellow-600">{stats.invoiceStats.pendingCount} pending</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-white/20">
              <CardContent className="pt-6">
                <Shield className="w-8 h-8 text-blue-600 mb-2" />
                <div className="text-2xl font-bold">{stats.claimStats.total}</div>
                <div className="text-xs text-gray-600">Insurance Claims</div>
                <div className="mt-2 text-xs">
                  <span className="text-green-600">{stats.claimStats.paid} paid</span>
                  <span className="text-gray-400 mx-2">•</span>
                  <span className="text-blue-600">{stats.claimStats.underReview} pending</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-white/20">
              <CardContent className="pt-6">
                <MessageSquare className="w-8 h-8 text-orange-600 mb-2" />
                <div className="text-2xl font-bold">{stats.disputeStats.total}</div>
                <div className="text-xs text-gray-600">Disputes</div>
                <div className="mt-2 text-xs">
                  <span className="text-green-600">{stats.disputeStats.byStatus.resolved} resolved</span>
                  <span className="text-gray-400 mx-2">•</span>
                  <span className="text-orange-600">{stats.disputeStats.byStatus.mediation} active</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-teal-500/10 border-white/20">
              <CardContent className="pt-6">
                <Mail className="w-8 h-8 text-green-600 mb-2" />
                <div className="text-2xl font-bold">{stats.campaigns.length}</div>
                <div className="text-xs text-gray-600">Marketing Campaigns</div>
                <div className="mt-2 text-xs">
                  <span className="text-green-600">
                    {stats.campaigns.filter((c: any) => c.status === 'completed').length} completed
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
