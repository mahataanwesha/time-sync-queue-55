import React from 'react';
import { CustomButton } from './ui/custom-button';
import { useQueue } from '../contexts/QueueContext';
import { 
  Settings, 
  Users, 
  BarChart3, 
  User,
  Shield
} from 'lucide-react';

export const AdminHeader: React.FC = () => {
  const { isAdmin, toggleMode } = useQueue();

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 gradient-hero rounded-xl flex items-center justify-center text-white font-bold">
                Q
              </div>
              <div>
                <h1 className="text-xl font-bold">Queue Manager</h1>
                <p className="text-sm text-muted-foreground">
                  {isAdmin ? 'Admin Dashboard' : 'Customer Portal'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <>
                <CustomButton variant="ghost" size="sm">
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </CustomButton>
                <CustomButton variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                  Settings
                </CustomButton>
              </>
            )}
            
            <CustomButton
              variant={isAdmin ? "secondary" : "default"}
              size="sm"
              onClick={toggleMode}
            >
              {isAdmin ? (
                <>
                  <User className="w-4 h-4" />
                  Switch to User
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Admin Panel
                </>
              )}
            </CustomButton>
          </div>
        </div>
      </div>
    </header>
  );
};