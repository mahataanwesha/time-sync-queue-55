import React, { useState } from 'react';
import { CustomButton } from './ui/custom-button';
import { useQueue } from '../contexts/QueueContext';
import { 
  Phone, 
  Clock, 
  Users, 
  CheckCircle, 
  XCircle, 
  RotateCcw,
  Play,
  Pause,
  SkipForward,
  AlertTriangle
} from 'lucide-react';

export const QueueDashboard: React.FC = () => {
  const { queues, callNext, markCompleted, skipQueue, recallQueue } = useQueue();
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'waiting': return <Clock className="w-4 h-4 text-warning" />;
      case 'being-served': return <Play className="w-4 h-4 text-success" />;
      case 'missed': return <XCircle className="w-4 h-4 text-destructive" />;
      default: return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-warning/10 text-warning border-warning/20';
      case 'being-served': return 'bg-success/10 text-success border-success/20';
      case 'missed': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 gradient-card rounded-2xl border border-border shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{queues.reduce((acc, q) => acc + q.activeQueues.length, 0)}</p>
              <p className="text-sm text-muted-foreground">Total Waiting</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 gradient-card rounded-2xl border border-border shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{queues.reduce((acc, q) => acc + q.totalToday, 0)}</p>
              <p className="text-sm text-muted-foreground">Served Today</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 gradient-card rounded-2xl border border-border shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {Math.round(queues.reduce((acc, q) => acc + q.averageWaitTime, 0) / queues.length)} min
              </p>
              <p className="text-sm text-muted-foreground">Avg Wait Time</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 gradient-card rounded-2xl border border-border shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {queues.reduce((acc, q) => acc + q.activeQueues.filter(item => item.status === 'missed').length, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Missed Calls</p>
            </div>
          </div>
        </div>
      </div>

      {/* Service Queues */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Active Service Queues</h2>
        
        <div className="grid gap-6 lg:grid-cols-2">
          {queues.map((service) => (
            <div key={service.id} className="gradient-card rounded-2xl border border-border shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{service.name}</h3>
                  <p className="text-sm text-muted-foreground">{service.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{service.currentServing}</p>
                  <p className="text-xs text-muted-foreground">Now Serving</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-muted/30 rounded-xl">
                  <p className="text-sm font-medium">{service.activeQueues.length}</p>
                  <p className="text-xs text-muted-foreground">Waiting</p>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-xl">
                  <p className="text-sm font-medium">{service.averageWaitTime} min</p>
                  <p className="text-xs text-muted-foreground">Avg Wait</p>
                </div>
              </div>

              {/* Queue List */}
              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                {service.activeQueues.slice(0, 5).map((queueItem) => (
                  <div
                    key={queueItem.id}
                    className={`flex items-center justify-between p-3 rounded-xl border ${getStatusColor(queueItem.status)}`}
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(queueItem.status)}
                      <div>
                        <p className="font-semibold">#{queueItem.number}</p>
                        <p className="text-xs opacity-75">{queueItem.joinTime}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      {queueItem.status === 'waiting' && (
                        <>
                          <CustomButton
                            size="sm"
                            variant="ghost"
                            onClick={() => callNext(service.id)}
                          >
                            <Phone className="w-3 h-3" />
                          </CustomButton>
                          <CustomButton
                            size="sm"
                            variant="ghost"
                            onClick={() => skipQueue(service.id, queueItem.id)}
                          >
                            <SkipForward className="w-3 h-3" />
                          </CustomButton>
                        </>
                      )}
                      
                      {queueItem.status === 'being-served' && (
                        <CustomButton
                          size="sm"
                          variant="success"
                          onClick={() => markCompleted(service.id, queueItem.id)}
                        >
                          <CheckCircle className="w-3 h-3" />
                        </CustomButton>
                      )}
                      
                      {queueItem.status === 'missed' && (
                        <CustomButton
                          size="sm"
                          variant="ghost"
                          onClick={() => recallQueue(service.id, queueItem.id)}
                        >
                          <RotateCcw className="w-3 h-3" />
                        </CustomButton>
                      )}
                    </div>
                  </div>
                ))}
                
                {service.activeQueues.length > 5 && (
                  <p className="text-xs text-muted-foreground text-center py-2">
                    +{service.activeQueues.length - 5} more in queue
                  </p>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <CustomButton
                  size="sm"
                  className="flex-1"
                  onClick={() => callNext(service.id)}
                  disabled={!service.activeQueues.some(q => q.status === 'waiting')}
                >
                  <Phone className="w-4 h-4" />
                  Call Next
                </CustomButton>
                <CustomButton
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedService(selectedService === service.id ? null : service.id)}
                >
                  Details
                </CustomButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};