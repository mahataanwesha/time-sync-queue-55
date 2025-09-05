import React, { useState } from "react";
import { CustomButton } from "./ui/custom-button";
import { ServiceCard } from "./ServiceCard";
import { AdminHeader } from "./AdminHeader";
import { AdminPanel } from "./AdminPanel";
import { useQueue } from "../contexts/QueueContext";
import { 
  Hospital, 
  Building2, 
  UtensilsCrossed, 
  Scissors,
  Building,
  Wrench,
  ShoppingBag,
  Clock,
  Users,
  ArrowRight,
  MapPin
} from "lucide-react";

const services = [
  {
    id: "hospital",
    icon: <Hospital className="w-6 h-6" />,
    title: "Hospital & Healthcare",
    description: "Medical appointments, diagnostics, pharmacy",
    services: ["OPD Appointments", "Specialist Clinics", "Diagnostic Center", "Pharmacy"]
  },
  {
    id: "bank",
    icon: <Building2 className="w-6 h-6" />,
    title: "Bank & Financial",
    description: "Banking services, loans, customer care",
    services: ["Teller Services", "Loan Advisory", "Customer Care", "Account Services"]
  },
  {
    id: "restaurant",
    icon: <UtensilsCrossed className="w-6 h-6" />,
    title: "Restaurant & Dining",
    description: "Table reservations, takeaway orders",
    services: ["Table Reservation", "Takeaway Queue", "Food Court", "Delivery Counter"]
  },
  {
    id: "salon",
    icon: <Scissors className="w-6 h-6" />,
    title: "Salon & Beauty",
    description: "Hair, beauty, wellness services",
    services: ["Haircut & Styling", "Beauty Services", "Spa Treatments", "Nail Care"]
  },
  {
    id: "government",
    icon: <Building className="w-6 h-6" />,
    title: "Government Office",
    description: "Document services, citizen support",
    services: ["Document Submission", "Passport Services", "License Department", "Citizen Care"]
  },
  {
    id: "service",
    icon: <Wrench className="w-6 h-6" />,
    title: "Service Center",
    description: "Repair services, technical support",
    services: ["Electronics Repair", "Customer Care", "Technical Support", "Warranty Claims"]
  },
  {
    id: "retail",
    icon: <ShoppingBag className="w-6 h-6" />,
    title: "Retail & Shopping",
    description: "Billing, customer support, returns",
    services: ["Billing Counter", "Customer Support", "Returns & Exchange", "Product Info"]
  }
];

export const QueueManager: React.FC = () => {
  const { isAdmin, currentUserQueue, joinQueue, leaveQueue } = useQueue();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  
  // If in admin mode, show admin panel
  if (isAdmin) {
    return <AdminPanel />;
  }

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
  };

  const handleJoinQueue = (serviceType: string) => {
    const selectedServiceData = services.find(s => s.id === selectedService);
    const category = selectedServiceData?.title || "";
    joinQueue(serviceType, category);
  };

  if (currentUserQueue) {
    return (
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">Your Queue Token</h1>
              <p className="text-muted-foreground">Please wait for your turn</p>
            </div>
            
            <div className="gradient-card p-8 rounded-3xl shadow-[var(--shadow-card)] border border-border mb-6">
              <div className="text-center">
                <div className="text-6xl font-bold text-primary mb-4">
                  {currentUserQueue.number.toString().padStart(2, '0')}
                </div>
                <div className="text-lg font-semibold text-foreground mb-2">
                  {currentUserQueue.service}
                </div>
                <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
                  <Clock className="w-4 h-4" />
                  <span>Est. wait: {currentUserQueue.estimatedWait} min</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <span className={`${
                    currentUserQueue.status === 'waiting' ? '⏳ Waiting' : 
                    currentUserQueue.status === 'being-served' ? '✅ Being Served' :
                    currentUserQueue.status === 'on-the-way' ? '🚶 On the Way' : '⏳ Waiting'
                  }`}></span>
                  <span>•</span>
                  <span>Joined at {currentUserQueue.joinTime}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between p-4 gradient-card rounded-xl border border-border">
                <span className="text-sm font-medium">Current serving</span>
                <span className="text-lg font-bold text-primary">{Math.max(1, currentUserQueue.number - 5)}</span>
              </div>
              <div className="flex items-center justify-between p-4 gradient-card rounded-xl border border-border">
                <span className="text-sm font-medium">People ahead</span>
                <span className="text-lg font-bold text-secondary">{Math.max(0, 5)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <CustomButton 
                variant="outline" 
                className="w-full"
                onClick={() => leaveQueue(currentUserQueue.id)}
              >
                Cancel Queue
              </CustomButton>
              <CustomButton 
                variant="ghost" 
                className="w-full text-primary"
              >
                Share Queue Status
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const selectedServiceData = services.find(s => s.id === selectedService);

  if (selectedService && selectedServiceData) {
    return (
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <CustomButton 
                variant="ghost" 
                size="icon"
                onClick={() => setSelectedService(null)}
              >
                ←
              </CustomButton>
              <div>
                <h1 className="text-2xl font-bold">{selectedServiceData.title}</h1>
                <p className="text-muted-foreground">{selectedServiceData.description}</p>
              </div>
            </div>

            <div className="grid gap-4">
              {selectedServiceData.services.map((service, index) => (
                <div
                  key={index}
                  className="p-6 gradient-card rounded-2xl border border-border shadow-card cursor-pointer card-hover"
                  onClick={() => handleJoinQueue(service)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{service}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{Math.floor(Math.random() * 20) + 5} waiting</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{Math.floor(Math.random() * 30) + 10} min</span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-primary" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 gradient-card rounded-2xl border border-border">
              <h3 className="font-semibold text-lg mb-4">Estimated Arrival Time</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Enter when you'll arrive so we can optimize your queue position
              </p>
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="Minutes from now"
                  className="flex-1 h-12 px-4 rounded-xl border border-border bg-background text-foreground"
                  min="0"
                  max="120"
                />
                <CustomButton variant="secondary">
                  Set Arrival
                </CustomButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 gradient-hero rounded-2xl flex items-center justify-center text-white font-bold text-xl">
              Q
            </div>
            <h1 className="text-3xl font-bold gradient-hero bg-clip-text text-transparent">
              Queue Manager
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Skip the physical lines. Join digital queues and get notified when it's your turn.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              icon={service.icon}
              title={service.title}
              description={service.description}
              services={service.services}
              onClick={() => handleServiceSelect(service.id)}
            />
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-16 grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
          <div className="text-center p-6 gradient-card rounded-2xl border border-border shadow-card">
            <div className="text-3xl font-bold text-primary mb-2">1,247</div>
            <div className="text-sm text-muted-foreground">Active Queues Today</div>
          </div>
          <div className="text-center p-6 gradient-card rounded-2xl border border-border shadow-card">
            <div className="text-3xl font-bold text-secondary mb-2">15 min</div>
            <div className="text-sm text-muted-foreground">Average Wait Time</div>
          </div>
          <div className="text-center p-6 gradient-card rounded-2xl border border-border shadow-card">
            <div className="text-3xl font-bold text-success mb-2">98%</div>
            <div className="text-sm text-muted-foreground">Customer Satisfaction</div>
          </div>
        </div>
      </div>
    </div>
  );
};