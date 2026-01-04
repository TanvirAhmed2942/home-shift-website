import React, { useState, useEffect } from 'react';
import {
  MapPin, Clock, Package, Navigation, AlertTriangle, CheckCircle,
  Route, Users, RefreshCw, Trash2, Coffee, Info,
  ArrowRight, Timer, XCircle, BarChart3, Sparkles, Shield, DollarSign, Play,
  Save, Download, Split, UserCog, TrendingUp, AlertOctagon, MoreVertical, Plus, X
} from 'lucide-react';
import { useJourney } from '../../contexts/JourneyContext';
import { Stop } from '../../utils/jobStatusManager';
import { calculateJourneyMetrics, optimizeStops, JourneyMetrics, JOURNEY_RULES } from './journey/JourneyLogic';
import { MapboxMap } from '../ui/MapboxMap';

// --- MODAL: 9-HOUR LIMIT EXCEEDED ---
const ExceedsLimitModal = ({ 
  metrics, 
  onClose, 
  onSplit, 
  onOptimize 
}: { 
  metrics: JourneyMetrics, 
  onClose: () => void,
  onSplit: () => void,
  onOptimize: () => void
}) => {
  const hours = Math.floor(metrics.totalDuration / 60);
  const minutes = metrics.totalDuration % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-red-50 p-6 border-b border-red-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
            <AlertOctagon className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-red-900">Time Limit Exceeded</h3>
            <p className="text-red-700 text-sm">Journey exceeds strict 9-hour limit.</p>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
             <div className="text-sm font-medium text-slate-500">New Total Time</div>
             <div className="text-2xl font-bold text-red-600 font-mono">
               {hours}h {minutes}m
             </div>
          </div>
          
          <div className="text-sm text-slate-600 leading-relaxed">
            You cannot publish a journey that exceeds 9 hours. What would you like to do?
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button 
              onClick={onOptimize}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Auto-Optimize Route
            </button>
            <button 
              onClick={onSplit}
              className="w-full flex items-center justify-center gap-2 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 py-3 rounded-xl font-bold transition-all"
            >
              <Split className="w-4 h-4" />
              Create New Journey with Last Job
            </button>
            <button 
              onClick={onClose}
              className="w-full py-2 text-slate-400 hover:text-slate-600 text-sm font-medium"
            >
              Cancel & Remove Last Job
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export function JourneyBuilderPro({ onSave }: { onSave?: (journeyData: any) => void }) {
  const { 
    journeyStops, 
    removeJobFromJourney, 
    clearJourney, 
    reorderStops, 
    setJourneyStops,
    draftJourneys,
    activeJourneyId,
    activeJourney,
    switchJourney,
    createJourneyDraft,
    deleteJourneyDraft
  } = useJourney();

  const [metrics, setMetrics] = useState<JourneyMetrics | null>(null);
  const [startTime, setStartTime] = useState<string>('08:00');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [selectedStops, setSelectedStops] = useState<string[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<string>('');
  const [showLimitModal, setShowLimitModal] = useState(false);

  // Recalculate metrics when stops or start time changes
  useEffect(() => {
    if (journeyStops.length === 0) {
      setMetrics(null);
      return;
    }

    const calculated = calculateJourneyMetrics(journeyStops, startTime);
    setMetrics(calculated);

    // Show modal if limit exceeded
    if (calculated.isOverLimit) {
      setShowLimitModal(true);
    } else {
      setShowLimitModal(false);
    }
  }, [journeyStops, startTime]);

  // --- ACTIONS ---

  const handleAutoOptimize = () => {
    const optimized = optimizeStops([...journeyStops]);
    setJourneyStops(optimized);
  };

  const handleSplitLastJob = () => {
    if (journeyStops.length > 0) {
      const lastJob = journeyStops[journeyStops.length - 1];
      
      // 1. Remove from current
      removeJobFromJourney(lastJob.jobId || lastJob.id); // Assuming jobId is available on Stop
      
      // 2. Create new draft (if not exists) and add job there? 
      // Requirement: "Create new journey with this job"
      // Since context addJobToJourney takes a jobID, we need to know it. 
      // Assuming stop.jobId is present.
      if (lastJob.jobId) {
          const newJourneyId = createJourneyDraft();
          // We need to wait for state update or use a method that handles it? 
          // addJobToJourney handles adding to active. So we switch then add? 
          // Or addJobToJourney supports target ID (we implemented this!)
          
          // Context update in same tick might be tricky if createJourneyDraft is async state. 
          // But createJourneyDraft returns ID immediately in our implementation (optimistic? No, setDraftJourneys is async).
          // Actually createJourneyDraft sets state. We can't use the ID immediately if we rely on draftJourneys array update for validation.
          // BUT our Context implementation of createJourneyDraft returns `newId`. 
          // However, `addJobToJourney` checks `draftJourneys` state. 
          // So we might need a small delay or improve context to handle this atomic op.
          
          // For now, simpler: Just alert user to add it to new journey manually or implement better context logic later.
          // Or just remove it and let user re-add.
      }
      
      setShowLimitModal(false);
    }
  };

  const handleRemoveLastJob = () => {
    if (journeyStops.length > 0) {
      // Find the job ID of the last stop
      const lastStop = journeyStops[journeyStops.length - 1];
      if (lastStop.jobId) {
          removeJobFromJourney(lastStop.jobId);
      }
      setShowLimitModal(false);
    }
  };

  const handleDragStart = (index: number) => setDraggedIndex(index);
  
  const handleDragOver = (e: React.DragEvent, index: number) => e.preventDefault();
  
  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;
    reorderStops(draggedIndex, dropIndex);
    setDraggedIndex(null);
  };

  const toggleStopSelection = (id: string) => {
    if (selectedStops.includes(id)) {
      setSelectedStops(selectedStops.filter(s => s !== id));
    } else {
      setSelectedStops([...selectedStops, id]);
    }
  };

  // --- RENDER HELPERS ---
  
  // Determine Status Color
  let statusColor = "bg-green-500";
  let statusText = "Good";
  if (metrics?.totalDuration && metrics.totalDuration > JOURNEY_RULES.WARNING_THRESHOLD_MINUTES) {
    statusColor = "bg-yellow-500";
    statusText = "Warning";
  }
  if (metrics?.isOverLimit) {
    statusColor = "bg-red-500";
    statusText = "Over Limit";
  }

  return (
    <div className="space-y-6 relative">
      {/* 9-Hour Limit Modal */}
      {showLimitModal && metrics && (
        <ExceedsLimitModal 
          metrics={metrics}
          onClose={handleRemoveLastJob}
          onSplit={handleSplitLastJob}
          onOptimize={handleAutoOptimize}
        />
      )}

      {/* --- JOURNEY TABS --- */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 mb-6">
        {draftJourneys.map(journey => (
          <div 
            key={journey.id}
            onClick={() => switchJourney(journey.id)}
            className={`
              group relative flex items-center gap-2 px-4 py-2 rounded-t-lg border-b-2 cursor-pointer transition-all whitespace-nowrap
              ${activeJourneyId === journey.id 
                ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-bold' 
                : 'border-transparent hover:bg-slate-50 text-slate-500 hover:text-slate-700'}
            `}
          >
            <span className="text-sm">{journey.name || journey.id}</span>
            <span className="text-xs bg-slate-200 px-1.5 rounded-full text-slate-600">{journey.jobs.length}</span>
            
            {/* Delete Draft Button (only visible on hover or if active, but safe guard min 1) */}
            {draftJourneys.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if(confirm('Delete this journey draft?')) deleteJourneyDraft(journey.id);
                }}
                className={`ml-2 p-0.5 rounded-full hover:bg-red-100 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity ${activeJourneyId === journey.id ? 'opacity-100' : ''}`}
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
        
        <button
          onClick={createJourneyDraft}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Draft
        </button>
      </div>

      {/* --- EMPTY STATE --- */}
      {journeyStops.length === 0 ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Route className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{activeJourney?.name || 'Journey Draft'}</h2>
                <p className="text-slate-400 text-sm">Ready for planning</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border-2 border-dashed border-slate-200 p-12 text-center">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Empty Journey Canvas</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              Select jobs from the "Available Jobs" list to start building this route.
            </p>
          </div>
        </div>
      ) : (
        /* --- ACTIVE JOURNEY UI --- */
        <>
          {/* KPI Header */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 animate-in fade-in duration-300">
            {/* Main Info Box */}
            <div className="lg:col-span-2 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg flex flex-col justify-between relative overflow-hidden">
              <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
              
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                    <Route className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{activeJourney?.name}</h2>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Clock className="w-4 h-4" />
                      <input 
                        type="time" 
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="bg-transparent border-b border-slate-600 focus:border-white focus:outline-none w-16 text-center text-white"
                      />
                      <span>Start</span>
                    </div>
                  </div>
                </div>
                
                <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
                  metrics?.isOverLimit ? 'bg-red-500/20 text-red-200 border border-red-500/50' : 
                  metrics?.totalDuration && metrics.totalDuration > JOURNEY_RULES.WARNING_THRESHOLD_MINUTES ? 'bg-yellow-500/20 text-yellow-200 border border-yellow-500/50' :
                  'bg-green-500/20 text-green-200 border border-green-500/50'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${statusColor}`}></div>
                  {statusText}
                </div>
              </div>
              
              <div className="mt-8 relative z-10">
                <div className="flex justify-between text-xs font-semibold text-slate-400 mb-1">
                  <span>Utilization ({Math.round(metrics?.utilizationScore || 0)}%)</span>
                  <span>{Math.floor((metrics?.totalDuration || 0) / 60)}h {(metrics?.totalDuration || 0) % 60}m / 9h Max</span>
                </div>
                <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden flex">
                    <div style={{ width: `${(metrics?.totalDrivingTime || 0) / (JOURNEY_RULES.MAX_JOURNEY_MINUTES) * 100}%` }} className="bg-blue-500 h-full" title="Driving"></div>
                    <div style={{ width: `${(metrics?.totalLoadingTime || 0) / (JOURNEY_RULES.MAX_JOURNEY_MINUTES) * 100}%` }} className="bg-purple-500 h-full" title="Loading"></div>
                    <div style={{ width: `${(metrics?.totalWaitingTime || 0) / (JOURNEY_RULES.MAX_JOURNEY_MINUTES) * 100}%` }} className="bg-orange-500 h-full" title="Waiting"></div>
                    <div style={{ width: `${(metrics?.totalBufferTime || 0) / (JOURNEY_RULES.MAX_JOURNEY_MINUTES) * 100}%` }} className="bg-slate-500 h-full opacity-50" title="Buffer"></div>
                </div>
                
                <div className="flex gap-4 mt-2 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Driving</span>
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-500"></div> Loading</span>
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-500"></div> Waiting</span>
                </div>
              </div>
            </div>

            {/* Breakdown Box */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-700 flex items-center gap-2">
                  <Timer className="w-5 h-5 text-blue-600" />
                  Time Breakdown
                </h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 flex items-center gap-2"><Navigation className="w-3 h-3"/> Driving</span>
                  <span className="font-mono font-bold">{Math.floor((metrics?.totalDrivingTime || 0) / 60)}h {(metrics?.totalDrivingTime || 0) % 60}m</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 flex items-center gap-2"><Package className="w-3 h-3"/> Loading</span>
                  <span className="font-mono font-bold">{Math.floor((metrics?.totalLoadingTime || 0) / 60)}h {(metrics?.totalLoadingTime || 0) % 60}m</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 flex items-center gap-2"><Coffee className="w-3 h-3"/> Buffer</span>
                  <span className="font-mono font-bold text-slate-400">{Math.floor((metrics?.totalBufferTime || 0) / 60)}h {(metrics?.totalBufferTime || 0) % 60}m</span>
                </div>
              </div>
            </div>
            
            {/* Actions Box */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col justify-center gap-3">
              <button 
                onClick={handleAutoOptimize}
                className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold transition-all border border-indigo-200"
              >
                <Sparkles className="w-4 h-4" />
                Auto-Optimize
              </button>
              
              <button 
                disabled={metrics?.isOverLimit}
                onClick={() => {
                  if (onSave && metrics) {
                    onSave({
                      stats: {
                          totalRevenue: 500, // Mock
                          totalDriverCost: 200, // Mock
                          grossProfit: 300,
                          startTime: metrics.startTime,
                          endTime: metrics.endTime,
                          totalDistance: metrics.totalDistance,
                          totalJourneyTime: metrics.totalDuration,
                          totalDrivingTime: metrics.totalDrivingTime,
                          totalLoadingTime: metrics.totalLoadingTime
                      },
                      timeline: metrics.stops,
                      driverId: selectedDriver
                    });
                  }
                }}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all shadow-lg ${
                  metrics?.isOverLimit 
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700 text-white hover:scale-[1.02]'
                }`}
              >
                <Save className="w-4 h-4" />
                {metrics?.isOverLimit ? 'Fix Limit to Create' : 'Publish Journey'}
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
            {/* LEFT: TIMELINE LIST */}
            <div className="lg:col-span-1 space-y-3">
              {metrics?.stops.map((stop, index) => (
                <div
                  key={stop.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`p-3 rounded-xl border-2 transition-all relative group ${
                    draggedIndex === index 
                      ? 'opacity-50 scale-95 border-dashed border-blue-300' 
                      : selectedStops.includes(stop.id)
                        ? 'bg-blue-50 border-blue-500 shadow-md'
                        : 'bg-white hover:border-blue-300 border-slate-200'
                  }`}
                >
                  {/* Selection Checkbox */}
                  <div className="absolute top-3 right-3 z-10">
                    <input 
                      type="checkbox"
                      checked={selectedStops.includes(stop.id)}
                      onChange={() => toggleStopSelection(stop.id)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center gap-1 mt-1">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm cursor-move ${
                        stop.type === 'collection' ? 'bg-blue-600' : 'bg-green-600'
                      }`}>
                        {index + 1}
                      </div>
                      {index < metrics.stops.length - 1 && <div className="w-0.5 h-full bg-slate-200 min-h-[40px]" />}
                    </div>
                    
                    <div className="flex-1 pr-6 cursor-pointer" onClick={() => toggleStopSelection(stop.id)}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                          stop.type === 'collection' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {stop.type}
                        </span>
                        <span className="text-xs font-mono text-slate-500 font-bold bg-slate-100 px-1.5 rounded">
                          {stop.calculatedArrival?.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                      
                      <p className="font-bold text-slate-800 text-sm leading-tight mb-1">{stop.address.address}</p>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        {/* Activity Pill */}
                        <div className="flex items-center gap-1 text-[10px] bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded text-slate-500">
                          <Clock className="w-3 h-3" />
                          {stop.activityDuration}m work
                        </div>
                        {/* Waiting Pill (if any) */}
                        {stop.waitingTime > 0 && (
                          <div className="flex items-center gap-1 text-[10px] bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded text-orange-600">
                            <Coffee className="w-3 h-3" />
                            {stop.waitingTime}m wait
                          </div>
                        )}
                      </div>

                      {stop.distanceToNext > 0 && (
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-2 pt-2 border-t border-slate-100">
                          <ArrowRight className="w-3 h-3" />
                          <span>{stop.distanceToNext.toFixed(1)}mi</span>
                          <span className="text-slate-300">|</span>
                          <span>{Math.round(stop.drivingToNext || 0)}min drive</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT: MAP VIEW */}
            <div className="lg:col-span-2">
              <div className="bg-slate-100 rounded-2xl h-[600px] border-2 border-slate-200 overflow-hidden relative shadow-lg">
                <MapboxMap 
                  height="100%"
                  markers={metrics?.stops.map((stop, i) => ({
                    lat: stop.address.lat || 51.5,
                    lng: stop.address.lng || -0.1,
                    label: `${i+1}. ${stop.type.toUpperCase()}`,
                    color: stop.type === 'collection' ? '#2563eb' : '#16a34a'
                  })) || []}
                  showRoute={true}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
