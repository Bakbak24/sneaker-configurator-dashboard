import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Lock, LogOut, Menu, X } from "lucide-react";
import swearLogoWhite from "@/assets/swear-logo-wh.png";

const Sidebar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
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
        <div
          className="md:hidden fixed inset-0 bg-black z-50"
          onClick={toggleMobileMenu}
        >
          <div
            className="bg-black text-white w-full h-full flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Brand and Close */}
            <div className="flex justify-between items-center p-6 border-b border-gray-800">
              <h1 className="text-xl font-bold text-white">SWEAR</h1>
              <Button
                onClick={toggleMobileMenu}
                variant="ghost"
                className="text-white hover:bg-white/10 p-2 cursor-pointer"
              >
                <X size={24} />
              </Button>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 px-6 py-8 space-y-6">
              <Button
                onClick={() => handleNavigation("/dashboard")}
                variant="ghost"
                className="w-full justify-start text-white hover:bg-white/10 hover:text-white transition-all cursor-pointer py-4 text-lg font-normal"
              >
                <LayoutDashboard className="mr-4 h-5 w-5" />
                Dashboard
              </Button>

              <Button
                onClick={() => handleNavigation("/change-password")}
                variant="ghost"
                className="w-full justify-start text-white hover:bg-white/10 hover:text-white transition-all cursor-pointer py-4 text-lg font-normal"
              >
                <Lock className="mr-4 h-5 w-5" />
                Change Password
              </Button>
            </nav>

            {/* Logout at Bottom */}
            <div className="p-6 border-t border-gray-800">
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full border-white bg-transparent text-white hover:bg-white hover:text-black hover:border-white transition-all cursor-pointer py-3 text-base"
              >
                <LogOut className="mr-3 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-black text-white flex-col">
        <div className="p-6">
          <img
            src={swearLogoWhite}
            alt="Swear London Logo"
            className="w-40 h-auto mb-8"
          />

          <nav className="space-y-4">
            <Button
              onClick={() => navigate("/dashboard")}
              variant="ghost"
              className="w-full justify-start text-white hover:bg-white/10 hover:text-white transition-all cursor-pointer"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>

            <Button
              onClick={() => navigate("/change-password")}
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
