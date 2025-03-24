
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative w-8 h-8 flex items-center justify-center bg-primary rounded-lg">
              <span className="text-white font-bold text-sm">DV</span>
            </div>
            <span className="font-semibold text-xl">DevVault</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Modern platform for developers to process, embed, and analyze documents.
          </p>
          <div className="flex space-x-4">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium text-sm mb-4">Product</h3>
          <ul className="space-y-2">
            <FooterLink to="/">Home</FooterLink>
            <FooterLink to="/upload">Upload</FooterLink>
            <FooterLink to="/documents">Documents</FooterLink>
            <FooterLink to="/pricing">Pricing</FooterLink>
          </ul>
        </div>
        
        <div>
          <h3 className="font-medium text-sm mb-4">Resources</h3>
          <ul className="space-y-2">
            <FooterLink to="/documentation">Documentation</FooterLink>
            <FooterLink to="/api">API Reference</FooterLink>
            <FooterLink to="/examples">Examples</FooterLink>
            <FooterLink to="/blog">Blog</FooterLink>
          </ul>
        </div>
        
        <div>
          <h3 className="font-medium text-sm mb-4">Company</h3>
          <ul className="space-y-2">
            <FooterLink to="/about">About</FooterLink>
            <FooterLink to="/contact">Contact</FooterLink>
            <FooterLink to="/privacy">Privacy</FooterLink>
            <FooterLink to="/terms">Terms</FooterLink>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>&copy; {currentYear} DevVault. All rights reserved.</p>
      </div>
    </footer>
  );
};

interface FooterLinkProps {
  to: string;
  children: React.ReactNode;
}

const FooterLink: React.FC<FooterLinkProps> = ({ to, children }) => (
  <li>
    <Link 
      to={to} 
      className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
    >
      {children}
    </Link>
  </li>
);

export default Footer;
