import React, { useState, Suspense, lazy, useEffect } from 'react';
import { 
  LayoutDashboard, Package, Truck, Map as MapIcon, Calculator, Settings, LogOut, 
  Menu, X, Users, DollarSign, FileText, AlertTriangle, MessageSquare, 
  Database, Globe, BarChart, Calendar, Shield, Briefcase, Layers, 
  ChevronDown, ChevronRight, Bell, Zap, Navigation as NavigationIcon,
  Search, User as UserIcon, LogIn, ChevronLeft, Lock, History
} from 'lucide-react';

import { IntegratedDashboardOverview } from '../../components/dashboard/IntegratedDashboardOverview';
import { router } from '../../utils/router';

// Lazy Load all Admin Components
const AnalyticsDashboard = lazy(() => import('../../components/admin/AnalyticsDashboard').then(m => ({ default: m.AnalyticsDashboard || m.default })));
const JobsManagement = lazy(() => import('../../components/admin/JobsManagement').then(m => ({ default: m.JobsManagement || m.default })));
const BookingsManagement = lazy(() => import('../../components/admin/BookingsManagement').then(m => ({ default: m.BookingsManagement || m.default })));
const JobDispatch = lazy(() => import('../../components/admin/JobDispatch').then(m => ({ default: m.JobDispatch || m.default })));
const CalendarView = lazy(() => import('../../components/admin/CalendarView').then(m => ({ default: m.CalendarView || m.default })));
const LiveTracking = lazy(() => import('../../components/admin/LiveTracking').then(m => ({ default: m.LiveTracking || m.default })));
const LiveTrackingAdvanced = lazy(() => import('../../components/admin/LiveTrackingAdvanced').then(m => ({ default: m.LiveTrackingAdvanced || m.default })));
const FleetMap = lazy(() => import('../../components/admin/FleetMap').then(m => ({ default: m.FleetMap || m.default })));
const JourneyManagement = lazy(() => import('../../components/admin/JourneyManagement').then(m => ({ default: m.JourneyManagement || m.default })));
const RouteOptimization = lazy(() => import('../../components/admin/RouteOptimization').then(m => ({ default: m.RouteOptimization || m.default })));
const VariationRequests = lazy(() => import('../../components/admin/VariationRequests').then(m => ({ default: m.VariationRequests || m.default })));

const DriverManagement = lazy(() => import('../../components/admin/DriverManagement').then(m => ({ default: m.DriverManagement || m.default })));
const DriverAvailability = lazy(() => import('../../components/admin/DriverAvailability').then(m => ({ default: m.DriverAvailability || m.default })));
const VehicleFleet = lazy(() => import('../../components/admin/VehicleFleet').then(m => ({ default: m.VehicleFleet || m.default })));
const FleetComplianceManager = lazy(() => import('../../components/admin/FleetComplianceManager').then(m => ({ default: m.FleetComplianceManager || m.default })));
const TrainingDocumentation = lazy(() => import('../../components/admin/TrainingDocumentation').then(m => ({ default: m.TrainingDocumentation || m.default })));
const EmergencyManagement = lazy(() => import('../../components/admin/EmergencyManagement').then(m => ({ default: m.EmergencyManagement || m.default })));

const CustomerManagement = lazy(() => import('../../components/admin/CustomerManagement').then(m => ({ default: m.CustomerManagement || m.default })));
const LeadManagement = lazy(() => import('../../components/admin/LeadManagement').then(m => ({ default: m.LeadManagement || m.default })));
const QuoteCalculator = lazy(() => import('../../components/admin/QuoteCalculator').then(m => ({ default: m.QuoteCalculator || m.default })));
const MarketingCampaigns = lazy(() => import('../../components/admin/MarketingCampaigns').then(m => ({ default: m.MarketingCampaigns || m.default })));
const PromotionsManager = lazy(() => import('../../components/admin/PromotionsManager').then(m => ({ default: m.PromotionsManager || m.default })));
const ReferralProgram = lazy(() => import('../../components/admin/ReferralProgram').then(m => ({ default: m.ReferralProgram || m.default })));
const PartnerProgram = lazy(() => import('../../components/admin/PartnerProgram').then(m => ({ default: m.PartnerProgram || m.default })));

const FinanceManager = lazy(() => import('../../components/admin/FinanceManager').then(m => ({ default: m.FinanceManager || m.default })));
const InvoiceManagement = lazy(() => import('../../components/admin/InvoiceManagement').then(m => ({ default: m.InvoiceManagement || m.default })));
const PayoutSettings = lazy(() => import('../../components/admin/PayoutSettings').then(m => ({ default: m.PayoutSettings || m.default })));
const InsuranceClaims = lazy(() => import('../../components/admin/InsuranceClaims').then(m => ({ default: m.InsuranceClaims || m.default })));
const LegalDocumentsManager = lazy(() => import('../../components/admin/LegalDocumentsManager').then(m => ({ default: m.LegalDocumentsManager || m.default })));
// Pricing, Rates, Margins are now Tabs inside FinanceManager, but keeping imports if needed directly or for types
const PricingManagement = lazy(() => import('../../components/admin/PricingManagement').then(m => ({ default: m.PricingManagement || m.default })));
const RateCards = lazy(() => import('../../components/admin/RateCards').then(m => ({ default: m.RateCards || m.default })));
const MarginConfiguration = lazy(() => import('../../components/admin/MarginConfiguration').then(m => ({ default: m.MarginConfiguration || m.default })));

const StorageManagement = lazy(() => import('../../components/admin/StorageManagement').then(m => ({ default: m.StorageManagement || m.default })));
const EquipmentInventory = lazy(() => import('../../components/admin/EquipmentInventory').then(m => ({ default: m.EquipmentInventory || m.default })));
const ItemsLibrary = lazy(() => import('../../components/admin/ItemsLibrary').then(m => ({ default: m.ItemsLibrary || m.default })));

const MessagingCenter = lazy(() => import('../../components/admin/MessagingCenter').then(m => ({ default: m.MessagingCenter || m.default })));
// Import robust: incercam ambele variante (named sau default)
const NotificationsManager = lazy(() => import('../../components/admin/communications/NotificationSystem'));
const ReviewsManagement = lazy(() => import('../../components/admin/ReviewsManagement').then(m => ({ default: m.ReviewsManagement || m.default })));
const DisputeManagement = lazy(() => import('../../components/admin/DisputeManagement').then(m => ({ default: m.DisputeManagement || m.default })));
const DamageReports = lazy(() => import('../../components/admin/DamageReports').then(m => ({ default: m.DamageReports || m.default })));
const FAQManager = lazy(() => import('../../components/admin/FAQManager').then(m => ({ default: m.FAQManager || m.default })));

const SettingsPage = lazy(() => import('../../components/admin/Settings').then(m => ({ default: m.Settings || m.default })));
const SystemConfiguration = lazy(() => import('../../components/admin/SystemConfiguration').then(m => ({ default: m.SystemConfiguration || m.default })));
const WebsiteContentManager = lazy(() => import('../../components/admin/WebsiteContentManager').then(m => ({ default: m.WebsiteContentManager || m.default })));
const IntegrationsManager = lazy(() => import('../../components/admin/IntegrationsManager').then(m => ({ default: m.IntegrationsManager || m.default })));
const BackupManager = lazy(() => import('../../components/admin/BackupManager').then(m => ({ default: m.BackupManager || m.default })));
const ExportManager = lazy(() => import('../../components/admin/ExportManager').then(m => ({ default: m.ExportManager || m.default })));
const LanguageSettings = lazy(() => import('../../components/admin/LanguageSettings').then(m => ({ default: m.LanguageSettings || m.default })));
const AuditLogs = lazy(() => import('../../components/admin/AuditLogs').then(m => ({ default: m.AuditLogs || m.default })));
const Reports = lazy(() => import('../../components/admin/Reports').then(m => ({ default: m.Reports || m.default })));

// Loading Component
const PageLoader = () => (
  <div className="flex h-full items-center justify-center p-12">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      <p className="text-slate-500 font-medium">Loading component...</p>
    </div>
  </div>
);

type NavigationGroup = {
  id: string;
  label: string;
  subsections: {
    label?: string; // Optional subtitle
    items: {
      id: string;
      label: string;
      icon: any;
      component: React.LazyExoticComponent<any> | React.ComponentType<any>;
    }[];
  }[];
};

export default function AdminApp() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile Drawer
  const [isCollapsed, setIsCollapsed] = useState(false); // Desktop Collapsed
  const [userMenuOpen, setUserMenuOpen] = useState(false); // Header User Dropdown
  
  // Default expanded sections
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'dashboard': true,
    'jobs': true,
    'journeys': true,
    'finance': false
  });

  const handleLogout = () => {
    router.navigate({ page: 'home' });
  };

  const toggleGroup = (group: string) => {
    if (isCollapsed) return; // Don't toggle in collapsed mode
    setExpandedGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  // --- NAVIGATION CONFIGURATION ---
  const navigationConfig: NavigationGroup[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      subsections: [
        {
          items: [
            { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard, component: IntegratedDashboardOverview },
          ]
        }
      ]
    },
    {
      id: 'jobs',
      label: 'Jobs & Bookings',
      subsections: [
        {
          items: [
            { id: 'jobs', label: 'Jobs Management', icon: Package, component: JobsManagement },
            { id: 'available-jobs', label: 'Available Jobs', icon: Zap, component: JobDispatch },
            { id: 'job-history', label: 'Job History & Charges', icon: FileText, component: JobsManagement }, // Maps to Jobs with history filter
            { id: 'bookings', label: 'Bookings Calendar', icon: Calendar, component: BookingsManagement },
          ]
        }
      ]
    },
    {
      id: 'journeys',
      label: 'Journey Builder',
      subsections: [
        {
          items: [
            { id: 'journey-builder', label: 'Journey Builder', icon: MapIcon, component: JourneyManagement },
            { id: 'journey-history', label: 'Journey History', icon: Layers, component: JourneyManagement }, // Placeholder for history view
          ]
        }
      ]
    },
    {
      id: 'tracking',
      label: 'Live Tracking',
      subsections: [
        {
          items: [
            { id: 'live-tracking', label: 'Live Map', icon: NavigationIcon, component: LiveTrackingAdvanced },
          ]
        }
      ]
    },
    {
      id: 'fleet',
      label: 'Fleet & Drivers',
      subsections: [
        {
          items: [
            { id: 'drivers', label: 'Driver Management', icon: Users, component: DriverManagement },
            { id: 'availability', label: 'Availability', icon: Calendar, component: DriverAvailability },
            { id: 'fleet-map', label: 'Fleet Map', icon: MapIcon, component: FleetMap },
            { id: 'vehicles', label: 'Vehicle Fleet', icon: Truck, component: VehicleFleet },
            { id: 'compliance', label: 'Compliance', icon: Shield, component: FleetComplianceManager },
          ]
        }
      ]
    },
    {
      id: 'finance',
      label: 'Finance & Payouts',
      subsections: [
        {
          items: [
            { id: 'finance-overview', label: 'Finance Overview', icon: BarChart, component: FinanceManager },
            { id: 'driver-payouts', label: 'Driver Payouts', icon: DollarSign, component: FinanceManager },
            { id: 'invoices', label: 'Invoices', icon: FileText, component: InvoiceManagement },
            { id: 'claims', label: 'Insurance Claims', icon: Shield, component: InsuranceClaims },
          ]
        }
      ]
    },
    {
      id: 'pricing',
      label: 'Pricing & Quotes',
      subsections: [
        {
          items: [
            { id: 'calculator', label: 'Quote Calculator', icon: Calculator, component: QuoteCalculator },
            { id: 'items-library', label: 'Items Library', icon: Database, component: ItemsLibrary },
            { id: 'rate-cards', label: 'Rate Cards', icon: FileText, component: RateCards },
            { id: 'margins', label: 'Margins', icon: BarChart, component: MarginConfiguration },
          ]
        }
      ]
    },
    {
      id: 'support',
      label: 'Support & Quality',
      subsections: [
        {
          items: [
            { id: 'messaging', label: 'Messaging', icon: MessageSquare, component: MessagingCenter },
            { id: 'notifications', label: 'Notifications', icon: Bell, component: NotificationsManager },
            { id: 'disputes', label: 'Disputes', icon: AlertTriangle, component: DisputeManagement },
            { id: 'damage', label: 'Damage Reports', icon: AlertTriangle, component: DamageReports },
            { id: 'reviews', label: 'Reviews', icon: Users, component: ReviewsManagement },
          ]
        }
      ]
    },
    {
      id: 'system',
      label: 'System & Settings',
      subsections: [
        {
          items: [
            { id: 'settings', label: 'Company Settings', icon: Settings, component: SettingsPage },
            { id: 'users', label: 'User Roles', icon: Lock, component: SystemConfiguration },
            { id: 'audit-logs', label: 'Audit Logs', icon: History, component: AuditLogs },
            { id: 'integrations', label: 'Integrations', icon: Layers, component: IntegrationsManager },
            { id: 'website', label: 'Website Content', icon: Globe, component: WebsiteContentManager },
            { id: 'languages', label: 'Languages', icon: Globe, component: LanguageSettings },
            { id: 'backups', label: 'Backups', icon: Database, component: BackupManager },
            { id: 'export', label: 'Data Export', icon: FileText, component: ExportManager },
          ]
        }
      ]
    }
  ];

  const flattenItems = navigationConfig.flatMap(g => g.subsections.flatMap(s => s.items));
  const activeItem = flattenItems.find(i => i.id === activeTab) || navigationConfig[0].subsections[0].items[0];
  const ActiveComponent = activeItem.component;

  // Breadcrumbs Logic
  const getActiveGroup = () => navigationConfig.find(g => 
    g.subsections.some(s => s.items.some(i => i.id === activeTab))
  );
  const activeGroup = getActiveGroup();

  return (
    <div className="h-screen w-full bg-slate-50 flex overflow-hidden font-sans">
      
      {/* --- MOBILE SIDEBAR OVERLAY --- */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 bg-slate-900 text-white transition-all duration-300 ease-in-out flex flex-col h-full shrink-0 shadow-2xl
        ${isSidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'lg:w-20' : 'lg:w-72'}
      `}>
        {/* Logo Area */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 shrink-0 bg-slate-900">
          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center w-full' : ''}`}>
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg shadow-indigo-900/50 shrink-0">
              SMH
            </div>
            {!isCollapsed && (
              <div className="animate-in fade-in duration-300">
                <h1 className="font-bold text-base leading-tight tracking-tight">ShiftMyHome</h1>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Admin Console</p>
              </div>
            )}
          </div>
          {/* Mobile Close */}
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-normal scrollbar-track-slate-800 scrollbar-thumb-slate-600 py-4">
          <div className="space-y-6 px-3">
            {navigationConfig.map((group) => (
              <div key={group.id} className="relative">
                {/* Group Header */}
                {!isCollapsed ? (
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider hover:text-slate-300 transition-colors group mb-1"
                  >
                    <span>{group.label}</span>
                    {expandedGroups[group.id] ? (
                      <ChevronDown className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                    ) : (
                      <ChevronRight className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                    )}
                  </button>
                ) : (
                  // Separator for collapsed state
                  <div className="h-px bg-slate-800 mx-2 my-2" />
                )}

                {/* Group Items */}
                <div className={`space-y-1 ${!expandedGroups[group.id] && !isCollapsed ? 'hidden' : 'block'}`}>
                  {group.subsections.flatMap(sub => sub.items).map((item) => (
                    <button
                      key={item.id}
                      title={isCollapsed ? item.label : ''} // Tooltip for collapsed
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsSidebarOpen(false);
                      }}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative
                        ${activeTab === item.id 
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/30 font-medium' 
                          : 'text-slate-400 hover:bg-slate-800 hover:text-white font-normal'}
                        ${isCollapsed ? 'justify-center' : ''}
                      `}
                    >
                      <item.icon className={`w-5 h-5 shrink-0 ${activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                      
                      {!isCollapsed && (
                        <span className="text-sm truncate animate-in fade-in duration-200">{item.label}</span>
                      )}
                      
                      {/* Active Indicator Strip */}
                      {activeTab === item.id && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white/20 rounded-r-full" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* Note: User profile removed from bottom as requested */}
      </aside>

      {/* --- MAIN LAYOUT --- */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        
        {/* --- HEADER BAR --- */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 shrink-0 z-20 shadow-sm relative">
          
          {/* Left: Toggle & Breadcrumbs */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors items-center justify-center"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>

            <div className="h-6 w-px bg-slate-200 hidden sm:block" />

            {/* Breadcrumbs */}
            <nav className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
              <span className="font-medium hover:text-slate-800 transition-colors cursor-default">
                {activeGroup?.label || 'Console'}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
              <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-xs uppercase tracking-wide">
                {activeItem.label}
              </span>
            </nav>
            <span className="sm:hidden font-bold text-slate-900 text-sm truncate">{activeItem.label}</span>
          </div>

          {/* Right: Actions & User */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Global Search (Optional) */}
            <div className="hidden md:flex relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-64 pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>

            {/* User Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 pl-1 pr-2 py-1 rounded-full hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-md ring-2 ring-white">
                  AD
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-bold text-slate-700 leading-none">Administrator</p>
                  <p className="text-[10px] text-slate-400 leading-tight">admin@shiftmyhome.com</p>
                </div>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {userMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-30" 
                    onClick={() => setUserMenuOpen(false)} 
                  />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 z-40 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-slate-50 mb-1">
                      <p className="font-bold text-sm text-slate-800">Admin Account</p>
                      <p className="text-xs text-slate-500">Super Admin Privileges</p>
                    </div>
                    
                    <div className="px-1 space-y-0.5">
                      <button 
                        onClick={() => { setActiveTab('settings'); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors"
                      >
                        <UserIcon className="w-4 h-4" />
                        Profile Settings
                      </button>
                    </div>

                    <div className="border-t border-slate-50 mt-1 pt-1 px-1">
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* --- MAIN CONTENT SCROLL AREA --- */}
        <main className="flex-1 overflow-y-auto bg-slate-50 relative scrollbar-thick scrollbar-thumb-slate-300 scrollbar-track-transparent">
          <div className="p-4 lg:p-8 min-h-full">
            <div className="max-w-[1600px] mx-auto">
              <Suspense fallback={<PageLoader />}>
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <ActiveComponent userId="admin-user" userType="admin" activeTab={activeTab} />
                </div>
              </Suspense>
            </div>
          </div>
        </main>

      </div>
    </div>
  );
}

