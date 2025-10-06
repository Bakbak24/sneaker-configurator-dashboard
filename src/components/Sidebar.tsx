import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Lock, LogOut } from 'lucide-react';
import swearLogoWhite from '@/assets/swear-logo-wh.png';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <aside className="w-64 bg-black text-white flex flex-col">
      <div className="p-6">
        <img 
          src={swearLogoWhite} 
          alt="Swear London Logo" 
          className="w-40 h-auto mb-8"
        />
        
        <nav className="space-y-4">
          <Button
            onClick={() => navigate('/dashboard')}
            variant="ghost"
            className="w-full justify-start text-white hover:bg-white/10 hover:text-white transition-all cursor-pointer"
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          
          <Button
            onClick={() => navigate('/change-password')}
            variant="ghost"
            className="w-full justify-start text-white hover:bg-white/10 hover:text-white transition-all cursor-pointer"
          >
            <Lock className="mr-2 h-4 w-4" />
            Change Password
          </Button>
        </nav>
      </div>
      
      <div className="mt-auto p-6">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full border-white bg-transparent text-white hover:bg-white hover:text-black hover:border-white transition-all cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;