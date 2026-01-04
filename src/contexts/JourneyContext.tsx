import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { jobStatusManager, Job, Stop } from '../utils/jobStatusManager';

// Redefine Journey to strictly follow the requirement
export interface Journey {
  id: string;
  name?: string; // e.g. "Journey 1"
  driverId?: string;
  vehicleId?: string;
  status: 'planning' | 'assigned' | 'in-progress' | 'completed';
  jobs: string[]; // List of Job IDs
  stops: Stop[]; // Flattened list of ALL stops from all jobs
  startTime?: string;
  endTime?: string;
}

interface JourneyContextType {
  // Multiple Drafts State
  draftJourneys: Journey[];
  activeJourneyId: string | null;
  activeJourney: Journey | null;
  
  // Actions
  createJourneyDraft: () => string; // returns new ID
  switchJourney: (id: string) => void;
  deleteJourneyDraft: (id: string) => void;
  
  // Current Journey Operations
  journeyStops: Stop[]; 
  addJobToJourney: (jobId: string, targetJourneyId?: string) => void;
  removeJobFromJourney: (jobId: string) => void;
  reorderStops: (startIndex: number, endIndex: number) => void;
  setJourneyStops: (stops: Stop[]) => void;
  clearJourney: () => void;
  
  // Utility
  isJobInJourney: (jobId: string) => boolean; // Checks active journey or globally? Usually globally for "Available" logic
  getJourneyForJob: (jobId: string) => Journey | undefined;
}

const JourneyContext = createContext<JourneyContextType | undefined>(undefined);

export function JourneyProvider({ children }: { children: ReactNode }) {
  // Initial state: One empty draft
  const [draftJourneys, setDraftJourneys] = useState<Journey[]>([
    {
      id: 'draft-1',
      name: 'Journey 1',
      status: 'planning',
      jobs: [],
      stops: []
    }
  ]);
  
  const [activeJourneyId, setActiveJourneyId] = useState<string>('draft-1');

  // Helper to update the ACTIVE journey easily
  const updateActiveJourney = (updater: (journey: Journey) => Journey) => {
    setDraftJourneys(prev => prev.map(j => 
      j.id === activeJourneyId ? updater(j) : j
    ));
  };

  // Get active journey object
  const activeJourney = draftJourneys.find(j => j.id === activeJourneyId) || null;
  const journeyStops = activeJourney?.stops || [];

  // --- ACTIONS ---

  const createJourneyDraft = () => {
    const newId = `draft-${Date.now()}`;
    const newJourney: Journey = {
      id: newId,
      name: `Journey ${draftJourneys.length + 1}`,
      status: 'planning',
      jobs: [],
      stops: []
    };
    setDraftJourneys(prev => [...prev, newJourney]);
    setActiveJourneyId(newId);
    return newId;
  };

  const switchJourney = (id: string) => {
    if (draftJourneys.find(j => j.id === id)) {
      setActiveJourneyId(id);
    }
  };

  const deleteJourneyDraft = (id: string) => {
    setDraftJourneys(prev => {
      const filtered = prev.filter(j => j.id !== id);
      // If we deleted the active one, switch to another
      if (id === activeJourneyId && filtered.length > 0) {
        setActiveJourneyId(filtered[0].id);
      } else if (filtered.length === 0) {
        // Always keep at least one
        return [{
           id: `draft-${Date.now()}`,
           name: 'Journey 1',
           status: 'planning',
           jobs: [],
           stops: []
        }];
      }
      return filtered;
    });
    
    // If we deleted active and it was handled in setDraftJourneys, activeJourneyId needs sync?
    // The setState updater runs first. We need a useEffect or logic here. 
    // Simplified: check above logic.
    if (id === activeJourneyId && draftJourneys.length > 1) {
       const next = draftJourneys.find(j => j.id !== id);
       if (next) setActiveJourneyId(next.id);
    }
  };

  const addJobToJourney = (jobId: string, targetJourneyId?: string) => {
    const targetId = targetJourneyId || activeJourneyId;
    if (!targetId) return;

    const job = jobStatusManager.getJob(jobId);
    if (!job) {
      console.error(`Job ${jobId} not found`);
      return;
    }

    // Check if job is already in ANY journey draft? 
    // Requirement: "Un job poate fi într-un singur journey draft la un moment dat."
    const existingJourney = getJourneyForJob(jobId);
    if (existingJourney) {
      if (existingJourney.id === targetId) {
        alert('Job already in this journey');
      } else {
        // Move logic could go here, but for now just block
        alert(`Job is already in ${existingJourney.name || 'another journey'}. Remove it first.`);
      }
      return;
    }

    // Get stops
    const newStops = [...job.stops];

    setDraftJourneys(prev => prev.map(j => {
      if (j.id === targetId) {
        const updatedStops = [...j.stops, ...newStops];
        // Re-index
        updatedStops.forEach((stop, index) => {
          stop.order = index + 1;
          stop.journeyId = j.id;
        });

        return {
          ...j,
          jobs: [...j.jobs, jobId],
          stops: updatedStops
        };
      }
      return j;
    }));
    
    console.log(`✅ Added Job ${job.reference} to Journey ${targetId}`);
  };

  const removeJobFromJourney = (jobId: string) => {
    if (!activeJourneyId) return;

    updateActiveJourney(journey => {
      const updatedStops = journey.stops.filter(stop => stop.jobId !== jobId);
      updatedStops.forEach((stop, index) => stop.order = index + 1);
      
      return {
        ...journey,
        jobs: journey.jobs.filter(id => id !== jobId),
        stops: updatedStops
      };
    });
  };

  const reorderStops = (startIndex: number, endIndex: number) => {
    if (!activeJourneyId) return;

    updateActiveJourney(journey => {
      const result = Array.from(journey.stops);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);

      result.forEach((stop, index) => stop.order = index + 1);

      return { ...journey, stops: result };
    });
  };

  const setJourneyStops = (stops: Stop[]) => {
    if (!activeJourneyId) return;

    updateActiveJourney(journey => ({
      ...journey,
      stops: stops.map((stop, index) => ({
        ...stop,
        order: index + 1
      }))
    }));
  };

  const clearJourney = () => {
    if (!activeJourneyId) return;
    updateActiveJourney(journey => ({
      ...journey,
      jobs: [],
      stops: []
    }));
  };

  const isJobInJourney = (jobId: string): boolean => {
    return draftJourneys.some(j => j.jobs.includes(jobId));
  };

  const getJourneyForJob = (jobId: string): Journey | undefined => {
    return draftJourneys.find(j => j.jobs.includes(jobId));
  };

  return (
    <JourneyContext.Provider
      value={{
        draftJourneys,
        activeJourneyId,
        activeJourney,
        createJourneyDraft,
        switchJourney,
        deleteJourneyDraft,
        
        journeyStops,
        addJobToJourney,
        removeJobFromJourney,
        reorderStops,
        setJourneyStops,
        clearJourney,
        
        isJobInJourney,
        getJourneyForJob
      }}
    >
      {children}
    </JourneyContext.Provider>
  );
}

export function useJourney() {
  const context = useContext(JourneyContext);
  if (context === undefined) {
    throw new Error('useJourney must be used within a JourneyProvider');
  }
  return context;
}
