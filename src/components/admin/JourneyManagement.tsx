import React, { useState } from 'react';
import { 
  Route, Plus, Search, Filter 
} from 'lucide-react';
import { JourneyCard, JourneyStatus } from './JourneyCard';
import { JourneyDetailsView } from './JourneyDetailsView';
import { JourneyBuilderPro } from './JourneyBuilderPro';
import { JourneyCreatedView } from './JourneyCreatedView';

// MOCK DATA
const MOCK_JOURNEYS = [
  {
    id: '308562',
    title: '2 Man Journey / Full Day / 11m³',
    price: 265.11,
    status: 'allocated' as JourneyStatus,
    date: 'Today, starting at 08:40',
    totalJobs: 6,
    totalMiles: 102,
    totalTime: '7 hr 58 min',
    capacity: 10.72,
    people: 2,
    startLocation: 'Edinburgh, EH9',
    startTime: 'Today, 08:40',
    endLocation: 'Dunfermline, KY12',
    endTime: 'Today, 16:38',
    driverName: 'David Lacatos',
    vehicleReg: 'DC16OCJ',
    breakdown: {
      drivingTime: '3 hr 41 min',
      loadingTime: '4 hr 16 min',
      distance: '102 miles',
      maxWeight: '660kg'
    },
    jobs: [
       { 
         status: 'completed', completedAt: '9:29 - 30/12/25', 
         pickup: { address: 'Edinburgh to Edinburgh' },
         time: '08:40 - 08:57',
         customerName: 'Kulumba James',
         phone: '+442038741877'
       },
       { 
         status: 'pending', 
         pickup: { address: 'Edinburgh to Edinburgh' },
         time: '09:16 - 09:31',
         customerName: 'Sarah Smith',
         phone: '+442038741888'
       },
       { 
         status: 'pending', 
         pickup: { address: 'Edinburgh to Glasgow' },
         time: '10:00 - 11:30',
         customerName: 'John Doe',
         phone: '+442038741899'
       }
    ]
  },
  {
    id: '308563',
    title: '1 Man Journey / Half Day / 5m³',
    price: 150.00,
    status: 'draft' as JourneyStatus,
    date: 'Tomorrow, starting at 09:00',
    totalJobs: 3,
    totalMiles: 45,
    totalTime: '4 hr 30 min',
    capacity: 5.0,
    people: 1,
    startLocation: 'London, SW1',
    startTime: 'Tomorrow, 09:00',
    endLocation: 'London, E1',
    endTime: 'Tomorrow, 13:30',
    breakdown: {
      drivingTime: '2 hr',
      loadingTime: '2 hr 30 min',
      distance: '45 miles',
      maxWeight: '300kg'
    },
    jobs: []
  },
  {
    id: '308564',
    title: '3 Man Journey / Full Day / 20m³',
    price: 450.50,
    status: 'published' as JourneyStatus,
    date: 'Jan 2, starting at 07:00',
    totalJobs: 8,
    totalMiles: 150,
    totalTime: '9 hr 15 min',
    capacity: 20.0,
    people: 3,
    startLocation: 'Manchester, M1',
    startTime: 'Jan 2, 07:00',
    endLocation: 'Liverpool, L1',
    endTime: 'Jan 2, 16:15',
    breakdown: {
      drivingTime: '4 hr',
      loadingTime: '5 hr 15 min',
      distance: '150 miles',
      maxWeight: '1200kg'
    },
    jobs: []
  }
];

export function JourneyManagement() {
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'detail' | 'created_success'>('list');
  const [selectedJourneyId, setSelectedJourneyId] = useState<string | null>(null);
  const [journeys, setJourneys] = useState(MOCK_JOURNEYS);
  const [newJourneyData, setNewJourneyData] = useState<any>(null);

  // VIEW: DETAILS
  if (viewMode === 'detail' && selectedJourneyId) {
    const journey = journeys.find(j => j.id === selectedJourneyId);
    if (!journey) return <div>Journey not found</div>;
    
    return (
      <JourneyDetailsView 
         journey={journey} 
         onBack={() => setViewMode('list')}
         onStatusChange={(newStatus) => {
            // Update local state
            setJourneys(prev => prev.map(j => 
              j.id === selectedJourneyId ? { ...j, status: newStatus } : j
            ));
         }}
      />
    );
  }

  // VIEW: CREATE (Builder)
  if (viewMode === 'create') {
    return (
      <div className="h-full flex flex-col">
         <div className="p-4 bg-white border-b border-slate-200 flex items-center gap-4">
             <button onClick={() => setViewMode('list')} className="text-slate-500 hover:text-slate-700">Back to List</button>
             <h2 className="font-bold text-slate-900">New Journey Builder</h2>
         </div>
         <div className="flex-1 overflow-auto p-6">
            <JourneyBuilderPro onSave={(data) => {
               // 1. Create new journey object
               const newId = `JNY-${Math.floor(Math.random() * 10000)}`;
               const newJourney = {
                  id: newId,
                  title: `${data.timeline.length} Stop Journey / Custom`,
                  price: data.stats.totalRevenue,
                  status: 'draft' as JourneyStatus, // Starts as Draft per requirements
                  date: 'Today', // simplified
                  totalJobs: data.timeline.length,
                  totalMiles: data.stats.totalDistance,
                  totalTime: `${Math.floor(data.stats.totalJourneyTime / 60)}h ${Math.round(data.stats.totalJourneyTime % 60)}m`,
                  capacity: 20, // default
                  people: 2, // default
                  startLocation: data.timeline[0]?.address.address || 'Unknown',
                  startTime: data.stats.startTime.toLocaleTimeString(),
                  endLocation: data.timeline[data.timeline.length - 1]?.address.address || 'Unknown',
                  endTime: data.stats.endTime.toLocaleTimeString(),
                  breakdown: {
                    drivingTime: `${Math.floor(data.stats.totalDrivingTime / 60)}h ${Math.round(data.stats.totalDrivingTime % 60)}m`,
                    loadingTime: `${Math.floor(data.stats.totalLoadingTime / 60)}h ${Math.round(data.stats.totalLoadingTime % 60)}m`,
                    distance: `${data.stats.totalDistance.toFixed(1)} miles`,
                    maxWeight: '1000kg'
                  },
                  jobs: data.timeline.map((stop: any, idx: number) => ({
                     status: 'pending',
                     pickup: { address: stop.address.address },
                     time: stop.arrivalTime?.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                     customerName: `Customer ${idx + 1}`,
                     phone: '0700000000'
                  }))
               };

               // 2. Add to mock list
               setJourneys(prev => [newJourney, ...prev]);
               
               // 3. Set temp data for success view
               setNewJourneyData({ ...data, id: newId });

               // 4. Switch view
               setViewMode('created_success');
            }} />
         </div>
      </div>
    );
  }

  // VIEW: SUCCESS
  if (viewMode === 'created_success' && newJourneyData) {
    return (
      <div className="h-full overflow-auto p-6">
        <JourneyCreatedView 
          journeyId={newJourneyData.id}
          journeyNumber={newJourneyData.id}
          totalPrice={newJourneyData.stats.totalRevenue}
          driverRevenue={newJourneyData.stats.totalDriverCost}
          companyRevenue={newJourneyData.stats.grossProfit}
          startLocation={newJourneyData.timeline[0]?.address.address || 'Start'}
          endLocation={newJourneyData.timeline[newJourneyData.timeline.length - 1]?.address.address || 'End'}
          startTime={newJourneyData.stats.startTime}
          endTime={newJourneyData.stats.endTime}
          totalStops={newJourneyData.timeline.length}
          totalDistance={newJourneyData.stats.totalDistance}
          totalDrivingTime={newJourneyData.stats.totalDrivingTime}
          totalLoadingTime={newJourneyData.stats.totalLoadingTime}
          vehicleType="Luton Van" // Default
          onBack={() => setViewMode('list')}
          onModifyPrice={() => console.log("Modify price clicked")}
          onSendToDriver={() => {
             // In real app, this would update status to 'published' or 'allocated'
             setViewMode('list'); 
          }}
        />
      </div>
    );
  }

  // VIEW: LIST
  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Journey Management</h2>
          <p className="text-slate-600 mt-1">Plan, optimize, and allocate multi-drop routes.</p>
        </div>
        <button 
          onClick={() => setViewMode('create')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-md font-medium"
        >
          <Plus className="w-5 h-5" />
          Create New Journey
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 shrink-0">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search journeys by ID, driver, or route..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>
        <button className="px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium flex items-center gap-2 hover:bg-slate-50 shadow-sm text-sm">
          <Filter className="w-4 h-4" />
          Filter Status
        </button>
      </div>

      {/* Journey List */}
      <div className="flex-1 overflow-y-auto space-y-3 pb-6">
        {journeys.length === 0 ? (
           <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <Route className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-700">No journeys found</h3>
              <p className="text-slate-500">Create a new journey to get started.</p>
           </div>
        ) : (
           journeys.map(journey => (
             <JourneyCard 
               key={journey.id}
               id={journey.id}
               title={journey.title}
               date={journey.date}
               price={journey.price}
               status={journey.status}
               onClick={() => {
                 setSelectedJourneyId(journey.id);
                 setViewMode('detail');
               }}
             />
           ))
        )}
      </div>
    </div>
  );
}
