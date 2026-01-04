/**
 * Live Video Support Manager
 * WebRTC-based video calling for complex customer support issues
 */

export interface VideoSession {
  id: string;
  sessionId: string;
  customerId: string;
  customerName: string;
  agentId?: string;
  agentName?: string;
  jobReference?: string;
  reason: string;
  category: 'damage_assessment' | 'item_identification' | 'location_guidance' | 'technical_help' | 'other';
  status: 'waiting' | 'connecting' | 'active' | 'ended' | 'cancelled';
  startTime: Date;
  endTime?: Date;
  duration?: number; // seconds
  recordingUrl?: string;
  screenshots: string[];
  notes: string;
  resolution?: string;
  rating?: number;
  createdAt: Date;
}

export interface VideoAgent {
  id: string;
  name: string;
  role: 'support' | 'supervisor' | 'technical';
  status: 'online' | 'busy' | 'offline';
  currentSessionId?: string;
  totalSessions: number;
  averageRating: number;
  languages: string[];
  specialties: string[];
}

export interface VideoCallSettings {
  enableVideo: boolean;
  enableAudio: boolean;
  enableScreenShare: boolean;
  enableRecording: boolean;
  quality: 'low' | 'medium' | 'high';
}

// ==================== WEBRTC CONFIGURATION ====================

const WEBRTC_CONFIG = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    // Production should use TURN servers for better connectivity
    // { urls: 'turn:turn.shiftmyhome.com:3478', username: 'user', credential: 'pass' }
  ],
};

// ==================== VIDEO SUPPORT AGENTS ====================

const VIDEO_AGENTS: VideoAgent[] = [
  {
    id: 'agent-001',
    name: 'Sarah Thompson',
    role: 'support',
    status: 'online',
    totalSessions: 245,
    averageRating: 4.8,
    languages: ['en', 'ro'],
    specialties: ['damage_assessment', 'customer_service'],
  },
  {
    id: 'agent-002',
    name: 'Michael Chen',
    role: 'technical',
    status: 'online',
    totalSessions: 189,
    averageRating: 4.9,
    languages: ['en'],
    specialties: ['technical_help', 'app_guidance'],
  },
  {
    id: 'agent-003',
    name: 'Elena Popescu',
    role: 'support',
    status: 'offline',
    totalSessions: 167,
    averageRating: 4.7,
    languages: ['en', 'ro', 'hu'],
    specialties: ['item_identification', 'location_guidance'],
  },
];

// ==================== SESSION MANAGEMENT ====================

export function getAllVideoSessions(): VideoSession[] {
  const stored = localStorage.getItem('video_sessions');
  return stored ? JSON.parse(stored) : [];
}

export function getVideoSession(sessionId: string): VideoSession | undefined {
  return getAllVideoSessions().find(s => s.sessionId === sessionId);
}

export function requestVideoSupport(data: {
  customerId: string;
  customerName: string;
  jobReference?: string;
  reason: string;
  category: VideoSession['category'];
}): VideoSession {
  const sessionId = `VS-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

  const session: VideoSession = {
    id: `video-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    sessionId,
    customerId: data.customerId,
    customerName: data.customerName,
    jobReference: data.jobReference,
    reason: data.reason,
    category: data.category,
    status: 'waiting',
    startTime: new Date(),
    screenshots: [],
    notes: '',
    createdAt: new Date(),
  };

  // Save session
  const sessions = getAllVideoSessions();
  sessions.push(session);
  localStorage.setItem('video_sessions', JSON.stringify(sessions));

  // Notify available agents
  notifyAgentsOfNewRequest(session);

  // Auto-assign to available agent
  setTimeout(() => {
    autoAssignAgent(sessionId);
  }, 2000);

  return session;
}

function notifyAgentsOfNewRequest(session: VideoSession): void {
  const agents = getAvailableAgents();
  
  agents.forEach(agent => {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    notifications.push({
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: agent.id,
      type: 'video_support_request',
      title: 'New Video Support Request',
      message: `${session.customerName} needs help with ${session.category}`,
      timestamp: new Date(),
      read: false,
      actionUrl: `/video-support/${session.sessionId}`,
    });
    localStorage.setItem('notifications', JSON.stringify(notifications));
  });
}

function autoAssignAgent(sessionId: string): void {
  const session = getVideoSession(sessionId);
  if (!session || session.status !== 'waiting') return;

  const agents = getAvailableAgents();
  if (agents.length === 0) return;

  // Find best agent based on specialty and rating
  const bestAgent = agents.reduce((best, agent) => {
    const hasSpecialty = agent.specialties.includes(session.category);
    const betterRating = agent.averageRating > (best?.averageRating || 0);
    
    if (hasSpecialty && (!best || betterRating)) {
      return agent;
    }
    return best || agent;
  });

  assignAgentToSession(sessionId, bestAgent.id);
}

export function assignAgentToSession(sessionId: string, agentId: string): void {
  const sessions = getAllVideoSessions();
  const session = sessions.find(s => s.sessionId === sessionId);
  const agent = getAgent(agentId);

  if (!session || !agent) return;

  session.agentId = agentId;
  session.agentName = agent.name;
  session.status = 'connecting';

  // Update agent status
  agent.status = 'busy';
  agent.currentSessionId = sessionId;
  saveAgent(agent);

  localStorage.setItem('video_sessions', JSON.stringify(sessions));

  // Notify customer
  const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  notifications.push({
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId: session.customerId,
    type: 'agent_assigned',
    title: 'Agent Connected',
    message: `${agent.name} is joining your video call...`,
    timestamp: new Date(),
    read: false,
  });
  localStorage.setItem('notifications', JSON.stringify(notifications));
}

export function startVideoCall(sessionId: string, settings: VideoCallSettings): void {
  const sessions = getAllVideoSessions();
  const session = sessions.find(s => s.sessionId === sessionId);

  if (!session) return;

  session.status = 'active';
  session.startTime = new Date();

  localStorage.setItem('video_sessions', JSON.stringify(sessions));

  // Initialize WebRTC connection
  console.log('🎥 Starting WebRTC connection with config:', WEBRTC_CONFIG);
  console.log('📹 Video settings:', settings);
}

export function endVideoCall(sessionId: string, notes: string, resolution?: string): void {
  const sessions = getAllVideoSessions();
  const session = sessions.find(s => s.sessionId === sessionId);

  if (!session) return;

  const endTime = new Date();
  session.status = 'ended';
  session.endTime = endTime;
  session.duration = Math.floor((endTime.getTime() - new Date(session.startTime).getTime()) / 1000);
  session.notes = notes;
  session.resolution = resolution;

  // Free up agent
  if (session.agentId) {
    const agent = getAgent(session.agentId);
    if (agent) {
      agent.status = 'online';
      agent.currentSessionId = undefined;
      agent.totalSessions++;
      saveAgent(agent);
    }
  }

  localStorage.setItem('video_sessions', JSON.stringify(sessions));

  // Request rating
  setTimeout(() => {
    requestSessionRating(sessionId);
  }, 5000);
}

export function captureScreenshot(sessionId: string, imageData: string): void {
  const sessions = getAllVideoSessions();
  const session = sessions.find(s => s.sessionId === sessionId);

  if (!session) return;

  session.screenshots.push(imageData);
  localStorage.setItem('video_sessions', JSON.stringify(sessions));
}

export function rateVideoSession(sessionId: string, rating: number, feedback?: string): void {
  const sessions = getAllVideoSessions();
  const session = sessions.find(s => s.sessionId === sessionId);

  if (!session) return;

  session.rating = rating;
  if (feedback) {
    session.notes += `\n\nCustomer Feedback: ${feedback}`;
  }

  // Update agent average rating
  if (session.agentId) {
    const agent = getAgent(session.agentId);
    if (agent) {
      const totalRating = agent.averageRating * (agent.totalSessions - 1);
      agent.averageRating = (totalRating + rating) / agent.totalSessions;
      saveAgent(agent);
    }
  }

  localStorage.setItem('video_sessions', JSON.stringify(sessions));
}

function requestSessionRating(sessionId: string): void {
  const session = getVideoSession(sessionId);
  if (!session) return;

  const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  notifications.push({
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId: session.customerId,
    type: 'rate_video_session',
    title: 'Rate Your Video Support',
    message: 'How was your video support experience?',
    timestamp: new Date(),
    read: false,
    actionUrl: `/rate-session/${sessionId}`,
  });
  localStorage.setItem('notifications', JSON.stringify(notifications));
}

// ==================== AGENT MANAGEMENT ====================

export function getAllAgents(): VideoAgent[] {
  const stored = localStorage.getItem('video_agents');
  if (!stored) {
    localStorage.setItem('video_agents', JSON.stringify(VIDEO_AGENTS));
    return VIDEO_AGENTS;
  }
  return JSON.parse(stored);
}

export function getAgent(agentId: string): VideoAgent | undefined {
  return getAllAgents().find(a => a.id === agentId);
}

export function getAvailableAgents(): VideoAgent[] {
  return getAllAgents().filter(a => a.status === 'online');
}

export function saveAgent(agent: VideoAgent): void {
  const agents = getAllAgents();
  const index = agents.findIndex(a => a.id === agent.id);
  if (index !== -1) {
    agents[index] = agent;
    localStorage.setItem('video_agents', JSON.stringify(agents));
  }
}

export function updateAgentStatus(agentId: string, status: VideoAgent['status']): void {
  const agent = getAgent(agentId);
  if (agent) {
    agent.status = status;
    saveAgent(agent);
  }
}

// ==================== WEBRTC HELPERS ====================

export function createPeerConnection(): RTCPeerConnection {
  const pc = new RTCPeerConnection(WEBRTC_CONFIG);

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      console.log('🧊 ICE candidate:', event.candidate);
      // Send to signaling server
    }
  };

  pc.ontrack = (event) => {
    console.log('📹 Remote track received:', event.streams);
  };

  pc.onconnectionstatechange = () => {
    console.log('🔗 Connection state:', pc.connectionState);
  };

  return pc;
}

export async function getUserMedia(constraints: MediaStreamConstraints): Promise<MediaStream> {
  try {
    return await navigator.mediaDevices.getUserMedia(constraints);
  } catch (error) {
    console.error('Error accessing media devices:', error);
    throw error;
  }
}

export async function getDisplayMedia(): Promise<MediaStream> {
  try {
    return await navigator.mediaDevices.getDisplayMedia({ video: true });
  } catch (error) {
    console.error('Error accessing screen share:', error);
    throw error;
  }
}

// ==================== ANALYTICS ====================

export function getVideoSupportAnalytics() {
  const sessions = getAllVideoSessions();
  const agents = getAllAgents();

  const totalSessions = sessions.length;
  const completedSessions = sessions.filter(s => s.status === 'ended');
  const averageDuration = completedSessions.reduce((sum, s) => sum + (s.duration || 0), 0) / (completedSessions.length || 1);
  const ratedSessions = sessions.filter(s => s.rating !== undefined);
  const averageRating = ratedSessions.reduce((sum, s) => sum + (s.rating || 0), 0) / (ratedSessions.length || 1);

  const categoryBreakdown = sessions.reduce((acc, s) => {
    acc[s.category] = (acc[s.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalSessions,
    activeSessions: sessions.filter(s => s.status === 'active').length,
    waitingSessions: sessions.filter(s => s.status === 'waiting').length,
    completedSessions: completedSessions.length,
    averageDuration: Math.round(averageDuration),
    averageRating: averageRating.toFixed(1),
    categoryBreakdown,
    onlineAgents: agents.filter(a => a.status === 'online').length,
    busyAgents: agents.filter(a => a.status === 'busy').length,
  };
}

export function getAgentPerformance(agentId: string) {
  const sessions = getAllVideoSessions().filter(s => s.agentId === agentId && s.status === 'ended');
  const ratedSessions = sessions.filter(s => s.rating !== undefined);

  return {
    totalSessions: sessions.length,
    averageDuration: sessions.reduce((sum, s) => sum + (s.duration || 0), 0) / (sessions.length || 1),
    averageRating: ratedSessions.reduce((sum, s) => sum + (s.rating || 0), 0) / (ratedSessions.length || 1),
    resolutionRate: sessions.filter(s => s.resolution).length / (sessions.length || 1) * 100,
  };
}

// ==================== SCHEDULED CHECKS ====================

export function checkWaitingSessions(): void {
  const sessions = getAllVideoSessions().filter(s => s.status === 'waiting');
  const now = new Date();

  sessions.forEach(session => {
    const waitTime = (now.getTime() - new Date(session.createdAt).getTime()) / 1000 / 60; // minutes

    if (waitTime > 5) {
      // Escalate if waiting > 5 minutes
      escalateVideoRequest(session.sessionId);
    }
  });
}

function escalateVideoRequest(sessionId: string): void {
  const session = getVideoSession(sessionId);
  if (!session) return;

  // Notify supervisors
  const supervisors = getAllAgents().filter(a => a.role === 'supervisor');
  
  supervisors.forEach(supervisor => {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    notifications.push({
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: supervisor.id,
      type: 'escalated_video_request',
      title: '⚠️ Escalated Video Request',
      message: `${session.customerName} has been waiting for ${Math.floor((new Date().getTime() - new Date(session.createdAt).getTime()) / 1000 / 60)} minutes`,
      timestamp: new Date(),
      read: false,
      actionUrl: `/video-support/${sessionId}`,
    });
    localStorage.setItem('notifications', JSON.stringify(notifications));
  });
}
