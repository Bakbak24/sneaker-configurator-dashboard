import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Lock, LogOut, Menu, X } from 'lucide-react';
import swearLogoWhite from '@/assets/swear-logo-wh.png';

const Sidebar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  return (
    <>
      {/* Mobile Top Navbar */}
      <div className="md:hidden bg-black text-white p-4 flex justify-between items-center">
        <img
          src={swearLogoWhite}
          alt="Swear London Logo"
          className="h-8 w-auto"
        />
        <Button
          onClick={toggleMobileMenu}
          variant="ghost"
          className="text-white hover:bg-white/10 p-2 cursor-pointer"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-50" onClick={toggleMobileMenu}>
          <div className="bg-black text-white w-80 h-full flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <img
                  src={swearLogoWhite}
                  alt="Swear London Logo"
                  className="w-32 h-auto"
                />
                <Button
                  onClick={toggleMobileMenu}
                  variant="ghost"
                  className="text-white hover:bg-white/10 p-2 cursor-pointer"
                >
                  <X size={20} />
                </Button>
              </div>
            </div>

            <nav className="flex-1 p-6 space-y-2">
              <Button
                onClick={() => handleNavigation('/dashboard')}
                variant="ghost"
                className="w-full justify-start text-white hover:bg-white/10 hover:text-white transition-all cursor-pointer py-4 text-base"
              >
                <LayoutDashboard className="mr-3 h-5 w-5" />
                Dashboard
              </Button>

              <Button
                onClick={() => handleNavigation('/change-password')}
                variant="ghost"
                className="w-full justify-start text-white hover:bg-white/10 hover:text-white transition-all cursor-pointer py-4 text-base"
              >
                <Lock className="mr-3 h-5 w-5" />
                Change Password
              </Button>
            </nav>

            <div className="p-6 border-t border-gray-700">
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full border-white bg-transparent text-white hover:bg-white hover:text-black hover:border-white transition-all cursor-pointer py-3"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-black text-white flex-col">{isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={toggleMobileMenu}>
          <div className="bg-black text-white w-64 h-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-8">
              <img
                src={swearLogoWhite}
                alt="Swear London Logo"
                className="w-32 h-auto"
              />
              <Button
                onClick={toggleMobileMenu}
                variant="ghost"
                className="text-white hover:bg-white/10 p-2 cursor-pointer"
              >
                <X size={20} />
              </Button>
            </div>

            <nav className="space-y-4">
              <Button
                onClick={() => handleNavigation('/dashboard')}
                variant="ghost"
                className="w-full justify-start text-white hover:bg-white/10 hover:text-white transition-all cursor-pointer"
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>

              <Button
                onClick={() => handleNavigation('/change-password')}
                variant="ghost"
                className="w-full justify-start text-white hover:bg-white/10 hover:text-white transition-all cursor-pointer"
              >
                <Lock className="mr-2 h-4 w-4" />
                Change Password
              </Button>
            </nav>

            <div className="absolute bottom-6 left-6 right-6">
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full border-white bg-transparent text-white hover:bg-white hover:text-black hover:border-white transition-all cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-black text-white flex-col">
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
    </>
  );
};

export default Sidebar;
