import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface QueueItem {
  id: string;
  number: number;
  customerName?: string;
  service: string;
  serviceCategory: string;
  joinTime: string;
  estimatedArrival?: string;
  status: 'waiting' | 'on-the-way' | 'being-served' | 'completed' | 'missed';
  estimatedWait: number;
}

export interface ServiceQueue {
  id: string;
  name: string;
  category: string;
  currentServing: number;
  totalToday: number;
  averageWaitTime: number;
  activeQueues: QueueItem[];
}

interface QueueContextType {
  // State
  queues: ServiceQueue[];
  currentUserQueue: QueueItem | null;
  isAdmin: boolean;
  
  // User Actions
  joinQueue: (service: string, category: string, estimatedArrival?: number) => QueueItem;
  leaveQueue: (queueId: string) => void;
  
  // Admin Actions
  callNext: (serviceId: string) => void;
  markCompleted: (serviceId: string, queueId: string) => void;
  skipQueue: (serviceId: string, queueId: string) => void;
  recallQueue: (serviceId: string, queueId: string) => void;
  
  // Mode Toggle
  toggleMode: () => void;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

const generateInitialQueues = (): ServiceQueue[] => {
  const services = [
    { id: 'hospital-opd', name: 'OPD Appointments', category: 'Hospital & Healthcare' },
    { id: 'hospital-diagnostic', name: 'Diagnostic Center', category: 'Hospital & Healthcare' },
    { id: 'bank-teller', name: 'Teller Services', category: 'Bank & Financial' },
    { id: 'bank-loan', name: 'Loan Advisory', category: 'Bank & Financial' },
    { id: 'restaurant-table', name: 'Table Reservation', category: 'Restaurant & Dining' },
    { id: 'restaurant-takeaway', name: 'Takeaway Queue', category: 'Restaurant & Dining' },
    { id: 'salon-haircut', name: 'Haircut & Styling', category: 'Salon & Beauty' },
    { id: 'government-docs', name: 'Document Submission', category: 'Government Office' },
  ];

  return services.map(service => ({
    id: service.id,
    name: service.name,
    category: service.category,
    currentServing: Math.floor(Math.random() * 20) + 1,
    totalToday: Math.floor(Math.random() * 100) + 50,
    averageWaitTime: Math.floor(Math.random() * 20) + 10,
    activeQueues: generateMockQueue(service.id, service.name, service.category),
  }));
};

const generateMockQueue = (serviceId: string, serviceName: string, category: string): QueueItem[] => {
  const queueSize = Math.floor(Math.random() * 8) + 3;
  const queues: QueueItem[] = [];
  
  for (let i = 0; i < queueSize; i++) {
    const number = Math.floor(Math.random() * 100) + 1;
    const joinTime = new Date(Date.now() - Math.random() * 3600000).toLocaleTimeString();
    
    queues.push({
      id: `${serviceId}-${number}-${Date.now()}-${i}`,
      number,
      customerName: `Customer ${number}`,
      service: serviceName,
      serviceCategory: category,
      joinTime,
      status: i === 0 ? 'being-served' : 'waiting',
      estimatedWait: (i + 1) * 10,
    });
  }
  
  return queues.sort((a, b) => a.number - b.number);
};

export const QueueProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [queues, setQueues] = useState<ServiceQueue[]>(generateInitialQueues());
  const [currentUserQueue, setCurrentUserQueue] = useState<QueueItem | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const joinQueue = (service: string, category: string, estimatedArrival?: number): QueueItem => {
    const queueNumber = Math.floor(Math.random() * 100) + 1;
    const estimatedWait = Math.floor(Math.random() * 30) + 10;
    
    const newQueueItem: QueueItem = {
      id: `queue-${Date.now()}-${queueNumber}`,
      number: queueNumber,
      service,
      serviceCategory: category,
      joinTime: new Date().toLocaleTimeString(),
      status: 'waiting',
      estimatedWait,
      estimatedArrival: estimatedArrival ? 
        new Date(Date.now() + estimatedArrival * 60000).toLocaleTimeString() : undefined,
    };

    // Add to appropriate service queue
    setQueues(prev => prev.map(serviceQueue => {
      if (serviceQueue.name === service) {
        return {
          ...serviceQueue,
          activeQueues: [...serviceQueue.activeQueues, newQueueItem].sort((a, b) => a.number - b.number),
          totalToday: serviceQueue.totalToday + 1,
        };
      }
      return serviceQueue;
    }));

    setCurrentUserQueue(newQueueItem);
    return newQueueItem;
  };

  const leaveQueue = (queueId: string) => {
    setQueues(prev => prev.map(serviceQueue => ({
      ...serviceQueue,
      activeQueues: serviceQueue.activeQueues.filter(q => q.id !== queueId),
    })));
    
    if (currentUserQueue?.id === queueId) {
      setCurrentUserQueue(null);
    }
  };

  const callNext = (serviceId: string) => {
    setQueues(prev => prev.map(serviceQueue => {
      if (serviceQueue.id === serviceId) {
        const waitingQueues = serviceQueue.activeQueues.filter(q => q.status === 'waiting');
        if (waitingQueues.length > 0) {
          const nextQueue = waitingQueues[0];
          return {
            ...serviceQueue,
            currentServing: nextQueue.number,
            activeQueues: serviceQueue.activeQueues.map(q => 
              q.id === nextQueue.id 
                ? { ...q, status: 'being-served' as const }
                : q.status === 'being-served' 
                ? { ...q, status: 'completed' as const }
                : q
            ).filter(q => q.status !== 'completed'),
          };
        }
      }
      return serviceQueue;
    }));
  };

  const markCompleted = (serviceId: string, queueId: string) => {
    setQueues(prev => prev.map(serviceQueue => {
      if (serviceQueue.id === serviceId) {
        return {
          ...serviceQueue,
          activeQueues: serviceQueue.activeQueues.filter(q => q.id !== queueId),
        };
      }
      return serviceQueue;
    }));
  };

  const skipQueue = (serviceId: string, queueId: string) => {
    setQueues(prev => prev.map(serviceQueue => {
      if (serviceQueue.id === serviceId) {
        return {
          ...serviceQueue,
          activeQueues: serviceQueue.activeQueues.map(q => 
            q.id === queueId ? { ...q, status: 'missed' as const } : q
          ),
        };
      }
      return serviceQueue;
    }));
  };

  const recallQueue = (serviceId: string, queueId: string) => {
    setQueues(prev => prev.map(serviceQueue => {
      if (serviceQueue.id === serviceId) {
        return {
          ...serviceQueue,
          activeQueues: serviceQueue.activeQueues.map(q => 
            q.id === queueId ? { ...q, status: 'waiting' as const } : q
          ),
        };
      }
      return serviceQueue;
    }));
  };

  const toggleMode = () => {
    setIsAdmin(prev => !prev);
  };

  const value: QueueContextType = {
    queues,
    currentUserQueue,
    isAdmin,
    joinQueue,
    leaveQueue,
    callNext,
    markCompleted,
    skipQueue,
    recallQueue,
    toggleMode,
  };

  return (
    <QueueContext.Provider value={value}>
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (context === undefined) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
};