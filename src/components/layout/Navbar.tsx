
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Upload, Database, Home, Menu, X, Github, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b py-3 px-4 md:px-6 backdrop-blur-xl",
        isScrolled 
          ? "bg-white/80 dark:bg-gray-900/80 border-gray-200/50 dark:border-gray-800/50" 
          : "bg-transparent border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center space-x-2"
          onClick={closeMenu}
        >
          <div className="relative w-8 h-8 flex items-center justify-center bg-primary rounded-lg">
            <Database className="w-4 h-4 text-white absolute" />
          </div>
          <span className="font-semibold text-xl tracking-tight">DevVault</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <NavItem to="/" icon={<Home className="w-4 h-4 mr-1" />} label="Home" />
          <NavItem to="/upload" icon={<Upload className="w-4 h-4 mr-1" />} label="Upload" />
          <NavItem to="/documents" icon={<FileText className="w-4 h-4 mr-1" />} label="Documents" />
          
          <div className="relative group ml-1">
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              Resources <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
            </Button>
            <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden opacity-0 translate-y-2 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-200 z-50">
              <div className="py-1 flex flex-col">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub Repository
                </a>
                <a href="#" className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
                  <FileText className="w-4 h-4 mr-2" />
                  Documentation
                </a>
              </div>
            </div>
          </div>

          <div className="ml-4">
            <Button>Get Started</Button>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={cn(
          "fixed inset-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl z-40 pt-16 px-4 md:hidden transition-all duration-300 ease-in-out",
          isMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full pointer-events-none"
        )}
      >
        <nav className="flex flex-col space-y-4 mt-4">
          <MobileNavItem to="/" icon={<Home className="w-5 h-5 mr-3" />} label="Home" onClick={closeMenu} />
          <MobileNavItem to="/upload" icon={<Upload className="w-5 h-5 mr-3" />} label="Upload" onClick={closeMenu} />
          <MobileNavItem to="/documents" icon={<FileText className="w-5 h-5 mr-3" />} label="Documents" onClick={closeMenu} />
        
          <div className="border-t border-gray-200 dark:border-gray-800 my-4 pt-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 px-3">Resources</h3>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={closeMenu}
            >
              <Github className="w-5 h-5 mr-3" />
              GitHub Repository
            </a>
            <a 
              href="#" 
              className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={closeMenu}
            >
              <FileText className="w-5 h-5 mr-3" />
              Documentation
            </a>
          </div>

          <div className="mt-4">
            <Button className="w-full">Get Started</Button>
          </div>
        </nav>
      </div>
    </header>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => (
  <Link 
    to={to} 
    className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
  >
    {icon}
    {label}
  </Link>
);

interface MobileNavItemProps extends NavItemProps {
  onClick: () => void;
}

const MobileNavItem: React.FC<MobileNavItemProps> = ({ to, icon, label, onClick }) => (
  <Link 
    to={to} 
    className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
    onClick={onClick}
  >
    {icon}
    {label}
  </Link>
);

export default Navbar;
